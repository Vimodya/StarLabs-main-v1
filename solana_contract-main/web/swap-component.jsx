// Complete React Component with Wallet Adapter and Anchor
// Install dependencies: npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js @coral-xyz/anchor @solana/spl-token

import React, { useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress
} from '@solana/spl-token';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Import your IDL
import idl from '../target/idl/metah2o_ico_contract.json';

const PROGRAM_ID = new PublicKey("4JthSceLk69nmUyp2MhokzP1DQZ7KHZ3sUndMSVHXG44");
const USDT_MINT = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");
const META_MINT = new PublicKey("Meta7vTTVcggN4dDxdi8yJ9dr4N6FsZS2pSaaA8y2KF");
const PAYMENT_RECIPIENT = new PublicKey("2qaVvAfbERWFA1DgoaCxywyWFMLJ1ukmMaBNdq9ZUtng");

export default function TokenSwap() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [usdtAmount, setUsdtAmount] = useState('');
    const [metaAmount, setMetaAmount] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [txSignature, setTxSignature] = useState('');

    // Initialize Anchor program
    const program = useMemo(() => {
        if (!wallet.publicKey) return null;

        const provider = new AnchorProvider(
            connection,
            wallet,
            { commitment: 'confirmed' }
        );

        return new Program(idl, PROGRAM_ID, provider);
    }, [connection, wallet]);

    // Calculate META tokens to receive
    useEffect(() => {
        if (usdtAmount && !isNaN(usdtAmount)) {
            const meta = parseFloat(usdtAmount) * 100;
            setMetaAmount(meta.toFixed(2));
        } else {
            setMetaAmount('0');
        }
    }, [usdtAmount]);

    const handleSwap = async () => {
        if (!wallet.publicKey || !program) {
            setError('Please connect your wallet first');
            return;
        }

        if (!usdtAmount || parseFloat(usdtAmount) < 10) {
            setError('Minimum swap amount is 10 USDT');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');
        setTxSignature('');

        try {
            // Convert USDT amount to smallest units (6 decimals)
            const inputAmount = new BN(parseFloat(usdtAmount) * 1_000_000);

            // Derive PDAs
            const [statePda] = PublicKey.findProgramAddressSync(
                [Buffer.from("state")],
                PROGRAM_ID
            );

            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("token_vault")],
                PROGRAM_ID
            );

            const [vaultAuthority] = PublicKey.findProgramAddressSync(
                [Buffer.from("vault_authority")],
                PROGRAM_ID
            );

            // Get associated token accounts
            const userInputTokenAccount = await getAssociatedTokenAddress(
                USDT_MINT,
                wallet.publicKey
            );

            const userOutputTokenAccount = await getAssociatedTokenAddress(
                META_MINT,
                wallet.publicKey
            );

            const ownerInputTokenAccount = await getAssociatedTokenAddress(
                USDT_MINT,
                PAYMENT_RECIPIENT
            );

            // Execute swap
            const tx = await program.methods
                .swapTokens(inputAmount)
                .accounts({
                    state: statePda,
                    user: wallet.publicKey,
                    userInputTokenAccount,
                    userOutputTokenAccount,
                    inputTokenMint: USDT_MINT,
                    outputTokenMint: META_MINT,
                    ownerInputTokenAccount,
                    ownerWallet: PAYMENT_RECIPIENT,
                    rewardVault: vaultPda,
                    vaultAuthority,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log("Transaction signature:", tx);
            setTxSignature(tx);
            setSuccess(`Successfully swapped ${usdtAmount} USDT for ${metaAmount} META!`);
            setUsdtAmount('');

        } catch (err) {
            console.error('Swap error:', err);

            // Parse error message
            let errorMsg = 'Swap failed: ';
            if (err.message.includes('0x1771')) {
                errorMsg += 'Insufficient reward tokens in vault';
            } else if (err.message.includes('0x1')) {
                errorMsg += 'Insufficient funds. Check your USDT balance';
            } else if (err.message.includes('Contract is paused')) {
                errorMsg += 'Contract is currently paused';
            } else {
                errorMsg += err.message;
            }

            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h1>MetaH2O Token Swap</h1>
            <p>Swap USDT for META tokens at 1:100 ratio</p>

            <WalletMultiButton style={{ marginBottom: '20px' }} />

            {error && (
                <div style={{
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    padding: '12px',
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    borderRadius: '8px',
                    marginBottom: '20px'
                }}>
                    {success}
                    {txSignature && (
                        <>
                            <br />
                            <a
                                href={`https://solscan.io/tx/${txSignature}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View on Solscan
                            </a>
                        </>
                    )}
                </div>
            )}

            {wallet.publicKey && (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>
                            USDT Amount (Minimum 10)
                        </label>
                        <input
                            type="number"
                            min="10"
                            step="0.01"
                            value={usdtAmount}
                            onChange={(e) => setUsdtAmount(e.target.value)}
                            placeholder="Enter USDT amount"
                            style={{
                                width: '100%',
                                padding: '12px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb'
                            }}
                        />
                    </div>

                    <div style={{
                        backgroundColor: '#f0f9ff',
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>You Send:</span>
                            <strong>{usdtAmount || '0'} USDT</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>You Receive:</span>
                            <strong>{metaAmount} META</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Rate:</span>
                            <strong>1 USDT = 100 META</strong>
                        </div>
                    </div>

                    <button
                        onClick={handleSwap}
                        disabled={loading || !usdtAmount}
                        style={{
                            width: '100%',
                            padding: '12px 24px',
                            fontSize: '16px',
                            fontWeight: '600',
                            backgroundColor: loading || !usdtAmount ? '#ccc' : '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading || !usdtAmount ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Processing...' : 'Swap Tokens'}
                    </button>
                </>
            )}
        </div>
    );
}
