# Solana & Anchor Setup Commands

## After Installing Rust, Solana, and Anchor

### 1. Configure Solana for Devnet
```bash
solana config set --url devnet
solana config get
```

### 2. Create or Import Wallet
```bash
# Create new wallet (save the seed phrase!)
solana-keygen new -o owner-keypair.json

# Or recover existing wallet from seed phrase
solana-keygen recover -o owner-keypair.json
```

### 3. Get Devnet SOL (Airdrop)
```bash
solana airdrop 2 --keypair owner-keypair.json
solana balance --keypair owner-keypair.json
```

### 4. Build the Contract
```bash
cd "D:\Advantage Group Australasia\solana_contract"
anchor build
```

### 5. Deploy to Devnet
```bash
anchor deploy
```

### 6. Initialize the Contract
After deployment, run:
```bash
yarn install
yarn initialize
yarn initialize-vault
```

## Troubleshooting

### If airdrop fails:
- Try requesting 1 SOL at a time
- Use web faucet: https://faucet.solana.com/
- Or use: https://solfaucet.com/

### If build fails:
- Ensure all dependencies are installed: `yarn install`
- Check Rust version: `rustc --version` (should be 1.75+)
- Clear cache: `anchor clean` then rebuild

### Check program ID:
```bash
solana address -k target/deploy/metah2o_ico_contract-keypair.json
```

Make sure it matches the ID in:
- `lib.rs` line 5: `declare_id!("FAyhizc49sd4CuQBgLwLSdBGRfZpQrrcZ9tQzd7xsJtP")`
- `Anchor.toml` lines 9 & 12
