# MetaH2O ICO - Web Frontend

This folder contains the web interface for interacting with the MetaH2O ICO smart contract on Solana.

## Quick Start Options

### Option 1: Simple HTML Demo (Quick Test)
1. Open `index.html` directly in your browser
2. Click "Connect Phantom" or "Connect Solflare"
3. Note: This is a demo UI and requires additional implementation for actual swaps

### Option 2: Full React App (Production Ready)

#### Installation

```bash
cd web
npm install
```

#### Setup

1. Make sure your IDL file is accessible:
   - The IDL should be at `../target/idl/metah2o_ico_contract.json`
   - Or update the import path in `swap-component.jsx`

2. Configure your RPC endpoint (optional):
   - Edit `wallet-provider.jsx`
   - Replace the default RPC with your custom endpoint for better performance

#### Run Development Server

```bash
npm run dev
```

#### Build for Production

```bash
npm run build
```

The production files will be in the `dist` folder.

## Files Explained

- **index.html** - Simple standalone demo page (no build required)
- **App.jsx** - Main React application component
- **wallet-provider.jsx** - Wallet adapter configuration for Phantom & Solflare
- **swap-component.jsx** - Complete swap functionality with Anchor integration
- **package.json** - Dependencies for React frontend

## Smart Contract Details

- **Program ID**: `4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44`
- **Input Token**: USDT (`Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`)
- **Output Token**: META (`Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF`)
- **Swap Rate**: 1 USDT = 100 META
- **Minimum Swap**: 10 USDT
- **Network**: Solana Mainnet

## User Flow

1. User connects Phantom or Solflare wallet
2. User enters USDT amount (minimum 10)
3. UI shows calculated META tokens to receive
4. User clicks "Swap Tokens"
5. Wallet prompts for transaction approval
6. Transaction is sent to the smart contract
7. User receives META tokens in their wallet
8. Transaction link displayed for verification

## Important Notes

### Before Going Live

1. **Fund the Vault**: The reward vault must be funded with META tokens
   ```bash
   # Use your initialization script
   npx ts-node scripts/initialize-vault.ts
   ```

2. **Custom RPC**: Use a paid RPC endpoint (Helius, QuickNode, etc.) for production
   - Free RPCs have rate limits
   - Paid RPCs provide better reliability

3. **Error Handling**: The component includes basic error handling, but you should:
   - Add retry logic for failed transactions
   - Handle network errors gracefully
   - Add loading states for better UX

4. **Security**:
   - Contract can be paused by admin if needed
   - Token accounts are created automatically if needed
   - All transfers are validated on-chain

### Testing

Before going live:
1. Test with small amounts first (10 USDT)
2. Verify token balances before and after
3. Check transaction on Solscan
4. Test with both Phantom and Solflare wallets
5. Test error cases (insufficient balance, etc.)

### Common Issues

**"Insufficient reward tokens in vault"**
- Vault needs to be funded with META tokens
- Check vault balance using Solana explorer

**"Transaction timeout"**
- RPC endpoint might be slow
- Try increasing timeout or use a better RPC

**"Token account not found"**
- User needs USDT in their wallet first
- Token accounts will be auto-created if needed

**"User rejected transaction"**
- User declined the transaction in their wallet
- This is normal user behavior

## Customization

To customize the UI:
- Edit styles in `index.html` or create separate CSS files
- Modify colors, fonts, and layout in the component files
- Add additional features like transaction history
- Add balance display for user's USDT/META tokens

## Support

For issues with:
- Smart contract: Check the Rust code in `programs/metah2o_ico_contract/src/lib.rs`
- Frontend: Check browser console for errors
- Wallet connection: Ensure wallet extension is installed and unlocked
- Transactions: Check on Solscan using the transaction signature
