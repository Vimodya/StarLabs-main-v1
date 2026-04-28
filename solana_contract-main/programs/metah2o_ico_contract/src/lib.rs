use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("BzGwMb1Cp6P16CzYEiZUN3wfVCCz59Lwj3zV7EWtPDWr");

// Hardcoded addresses as Pubkey constants (more efficient than string comparison)
pub mod constants {
    use anchor_lang::prelude::*;
    use anchor_lang::solana_program::pubkey;

    // Admin wallet (upgrade authority) - can initialize vault, pause/unpause
    #[constant]
    pub const ADMIN_WALLET: Pubkey = pubkey!("9UCKSVjTtxxSCyuLf38WW69Z4D4wzNxt7w9AN8rE2bPn");

    // Payment recipient wallet - receives payment tokens from swaps (MAINNET)
    #[constant]
    pub const PAYMENT_RECIPIENT: Pubkey = pubkey!("9UCKSVjTtxxSCyuLf38WW69Z4D4wzNxt7w9AN8rE2bPn");

    // Payment token mint (what users send to buy)
    // DEVNET: Dummy USDT (6 decimals)
    #[constant]
    pub const INPUT_TOKEN_MINT: Pubkey = pubkey!("6gWLtgTa3oS1UTa4Q4Qevu5AwYwT9ohnh8MQZwTL1xVh");

    // Reward token mint (what users receive)
    // STAR token (6 decimals)
    #[constant]
    pub const OUTPUT_TOKEN_MINT: Pubkey = pubkey!("Baq6WjwcXX8pJBm5SALhCxWgjT5zFqHayBmGva52RNLF");
}

// MAINNET CONFIGURATION:
// - Input token (Dummy USDT): 6 decimals
// - Output token (STAR): 6 decimals
// - Decimal difference: 0 (No multiplication padding needed)
// - Swap ratio: 1 USDT = 100 STAR
// - Example: 10 USDT (10_000_000) * 100 = 1_000_000_000 = 1000 STAR ✅
const SWAP_RATIO: u64 = 100;  // 100
const MIN_INPUT_AMOUNT: u64 = 10_000_000;  // 10 USDT with 6 decimals

#[program]
pub mod metah2o_ico_contract {
    use super::*;

    /// Initialize the contract state
    /// Sets initial admin and payment recipient from hardcoded constants
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.is_paused = false;
        state.admin = constants::ADMIN_WALLET;
        state.payment_recipient = constants::PAYMENT_RECIPIENT;
        msg!("Token swap contract initialized");
        msg!("Admin: {}", state.admin);
        msg!("Payment recipient: {}", state.payment_recipient);
        Ok(())
    }

    /// Initialize the token vault (must be called before first swap)
    pub fn initialize_vault(_ctx: Context<InitializeVault>) -> Result<()> {
        msg!("Token vault initialized with authority PDA");
        Ok(())
    }

    /// Pause the contract (owner only)
    pub fn pause(ctx: Context<AdminAction>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.is_paused = true;
        msg!("Contract paused");
        Ok(())
    }

    /// Unpause the contract (owner only)
    pub fn unpause(ctx: Context<AdminAction>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.is_paused = false;
        msg!("Contract unpaused");
        Ok(())
    }

    /// Update payment recipient address (admin only)
    pub fn update_payment_recipient(
        ctx: Context<AdminAction>,
        new_recipient: Pubkey,
    ) -> Result<()> {
        // Validate new recipient is not system program
        require!(
            new_recipient != System::id(),
            ErrorCode::InvalidAddress
        );

        let state = &mut ctx.accounts.state;
        let old_recipient = state.payment_recipient;
        state.payment_recipient = new_recipient;
        msg!("Payment recipient updated");
        msg!("Old recipient: {}", old_recipient);
        msg!("New recipient: {}", new_recipient);
        Ok(())
    }

    /// Transfer admin ownership to a new admin (current admin only)
    pub fn transfer_admin(
        ctx: Context<AdminAction>,
        new_admin: Pubkey,
    ) -> Result<()> {
        // Validate new admin is not system program
        require!(
            new_admin != System::id(),
            ErrorCode::InvalidAddress
        );

        let state = &mut ctx.accounts.state;
        let old_admin = state.admin;
        state.admin = new_admin;
        msg!("Admin ownership transferred");
        msg!("Old admin: {}", old_admin);
        msg!("New admin: {}", new_admin);
        Ok(())
    }

    /// Swap input tokens for output tokens at rate: 1 input = 100 output
    /// User specifies amount of input tokens to send, output tokens calculated automatically
    /// Example: Send 10 custom tokens → Get 1000 MetaH2O tokens
    pub fn swap_tokens(
        ctx: Context<SwapTokens>,
        input_amount: u64,
    ) -> Result<()> {
        // Check if contract is paused
        require!(!ctx.accounts.state.is_paused, ErrorCode::ContractPaused);

        // Validate input_amount meets minimum requirement
        require!(
            input_amount >= MIN_INPUT_AMOUNT,
            ErrorCode::BelowMinimumSwap
        );

        // Calculate output token amount based on swap ratio
        // Example: 10 tokens in * 100 = 1000 tokens out
        let output_amount = input_amount
            .checked_mul(SWAP_RATIO)
            .ok_or(ErrorCode::CalculationOverflow)?;

        // Ensure reward vault has sufficient output tokens
        require!(
            ctx.accounts.reward_vault.amount >= output_amount,
            ErrorCode::InsufficientRewardTokens
        );

        // Ensure user has sufficient input tokens
        require!(
            ctx.accounts.user_input_token_account.amount >= input_amount,
            ErrorCode::InsufficientUserTokens
        );

        // Transfer input tokens from user to owner's token account
        let cpi_accounts_payment = Transfer {
            from: ctx.accounts.user_input_token_account.to_account_info(),
            to: ctx.accounts.owner_input_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx_payment = CpiContext::new(cpi_program.clone(), cpi_accounts_payment);

        token::transfer(cpi_ctx_payment, input_amount)?;

        // Transfer output tokens from reward vault to user using PDA authority
        let seeds = &[b"vault_authority".as_ref(), &[ctx.bumps.vault_authority]];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts_reward = Transfer {
            from: ctx.accounts.reward_vault.to_account_info(),
            to: ctx.accounts.user_output_token_account.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        let cpi_ctx_reward = CpiContext::new_with_signer(cpi_program, cpi_accounts_reward, signer_seeds);

        token::transfer(cpi_ctx_reward, output_amount)?;

        // Emit swap event
        emit!(SwapEvent {
            user: ctx.accounts.user.key(),
            input_amount,
            output_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Swapped {} input tokens for {} output tokens. Payment sent to owner.", input_amount, output_amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + ContractState::INIT_SPACE,
        seeds = [b"state"],
        bump
    )]
    pub state: Account<'info, ContractState>,

    /// Only admin can initialize the contract
    #[account(
        mut,
        constraint = payer.key() == constants::ADMIN_WALLET @ ErrorCode::Unauthorized
    )]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    /// Contract state to verify admin
    #[account(seeds = [b"state"], bump)]
    pub state: Account<'info, ContractState>,

    /// Reward vault PDA that will hold MetaH2O tokens for distribution
    #[account(
        init,
        payer = payer,
        seeds = [b"token_vault"],
        bump,
        token::mint = output_token_mint,
        token::authority = vault_authority,
    )]
    pub vault: Account<'info, TokenAccount>,

    /// Vault authority PDA that controls the reward vault
    #[account(seeds = [b"vault_authority"], bump)]
    /// CHECK: PDA validated via seeds
    pub vault_authority: AccountInfo<'info>,

    /// Output token mint (MetaH2O)
    #[account(
        constraint = output_token_mint.key() == constants::OUTPUT_TOKEN_MINT @ ErrorCode::InvalidOutputTokenMint
    )]
    pub output_token_mint: Account<'info, Mint>,

    /// Only admin can initialize vault
    #[account(
        mut,
        constraint = payer.key() == state.admin @ ErrorCode::Unauthorized
    )]
    pub payer: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AdminAction<'info> {
    #[account(
        mut,
        seeds = [b"state"],
        bump
    )]
    pub state: Account<'info, ContractState>,

    /// Current admin must sign
    #[account(
        constraint = admin.key() == state.admin @ ErrorCode::Unauthorized
    )]
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct SwapTokens<'info> {
    #[account(seeds = [b"state"], bump)]
    pub state: Account<'info, ContractState>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// User's input token account (sends payment tokens)
    /// Automatically created if it doesn't exist (user pays rent)
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = input_token_mint,
        associated_token::authority = user
    )]
    pub user_input_token_account: Account<'info, TokenAccount>,

    /// User's output token account (receives reward tokens)
    /// Automatically created if it doesn't exist (user pays rent)
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = output_token_mint,
        associated_token::authority = user
    )]
    pub user_output_token_account: Account<'info, TokenAccount>,

    /// Input token mint (payment token: custom token on devnet, USDT on mainnet)
    #[account(
        constraint = input_token_mint.key() == constants::INPUT_TOKEN_MINT @ ErrorCode::InvalidInputTokenMint
    )]
    pub input_token_mint: Account<'info, Mint>,

    /// Output token mint (reward token: MetaH2O)
    #[account(
        constraint = output_token_mint.key() == constants::OUTPUT_TOKEN_MINT @ ErrorCode::InvalidOutputTokenMint
    )]
    pub output_token_mint: Account<'info, Mint>,

    /// Owner's input token account (receives payment tokens)
    /// Must be created by payment recipient before first swap
    #[account(
        mut,
        associated_token::mint = input_token_mint,
        associated_token::authority = owner_wallet
    )]
    pub owner_input_token_account: Account<'info, TokenAccount>,

    /// Payment recipient wallet address
    /// CHECK: Validated via constraint to match state.payment_recipient
    #[account(
        constraint = owner_wallet.key() == state.payment_recipient @ ErrorCode::InvalidPaymentRecipient
    )]
    pub owner_wallet: AccountInfo<'info>,

    /// Reward vault (PDA) that holds MetaH2O tokens to distribute
    #[account(
        mut,
        seeds = [b"token_vault"],
        bump,
        constraint = reward_vault.mint == output_token_mint.key() @ ErrorCode::InvalidOutputTokenMint,
        constraint = reward_vault.owner == vault_authority.key() @ ErrorCode::InvalidVaultAuthority
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    /// Vault authority PDA that can transfer tokens from the reward vault
    #[account(seeds = [b"vault_authority"], bump)]
    /// CHECK: PDA validated via seeds constraint
    pub vault_authority: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct ContractState {
    pub is_paused: bool,
    pub admin: Pubkey,                  // Current admin (can pause, update settings, transfer admin)
    pub payment_recipient: Pubkey,      // Wallet that receives payment tokens from swaps
}

#[event]
pub struct SwapEvent {
    pub user: Pubkey,
    pub input_amount: u64,
    pub output_amount: u64,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Input amount is below minimum swap amount (10 tokens)")]
    BelowMinimumSwap,
    #[msg("Calculation overflow occurred")]
    CalculationOverflow,
    #[msg("Invalid payment recipient wallet address")]
    InvalidPaymentRecipient,
    #[msg("Invalid input token mint - must match configured payment token")]
    InvalidInputTokenMint,
    #[msg("Invalid output token mint - must be MetaH2O token")]
    InvalidOutputTokenMint,
    #[msg("Insufficient reward tokens in vault")]
    InsufficientRewardTokens,
    #[msg("Insufficient user tokens for swap")]
    InsufficientUserTokens,
    #[msg("Contract is paused")]
    ContractPaused,
    #[msg("Unauthorized: Only owner can perform this action")]
    Unauthorized,
    #[msg("Invalid vault authority - vault must be owned by authority PDA")]
    InvalidVaultAuthority,
    #[msg("Invalid address - cannot be system program")]
    InvalidAddress,
}
