import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const PROGRAM_ID = new PublicKey('BzGwMb1Cp6P16CzYEiZUN3wfVCCz59Lwj3zV7EWtPDWr');

async function check() {
  const sigs = await connection.getSignaturesForAddress(PROGRAM_ID, { limit: 1 });
  if (sigs.length === 0) {
    console.log("No transactions found");
    return;
  }
  
  const txHash = sigs[0].signature;
  console.log("Latest transaction:", txHash);
  
  const tx = await connection.getParsedTransaction(txHash, { maxSupportedTransactionVersion: 0 });
  if (!tx || !tx.meta) {
    console.log("No meta");
    return;
  }
  
  let grossUsdtTransferred = 0;
  let grossStarTransferred = 0;

  if (tx.meta && tx.meta.innerInstructions) {
    const accountInfoMap = {};
    const populateInfo = (balances) => {
      if (!balances) return;
      balances.forEach(b => {
        const keyObj = tx.transaction.message.accountKeys[b.accountIndex];
        const pubkeyStr = keyObj.pubkey ? keyObj.pubkey.toString() : keyObj.toString();
        accountInfoMap[pubkeyStr] = {
          mint: b.mint,
          decimals: b.uiTokenAmount.decimals
        };
      });
    };
    populateInfo(tx.meta.preTokenBalances);
    populateInfo(tx.meta.postTokenBalances);

    tx.meta.innerInstructions.forEach(ix => {
      ix.instructions.forEach(innerIx => {
        if (innerIx.parsed && innerIx.parsed.type === 'transfer') {
          const info = innerIx.parsed.info;
          const destInfo = accountInfoMap[info.destination];
          if (destInfo) {
            const uiAmount = Number(info.amount) / Math.pow(10, destInfo.decimals);
            if (destInfo.mint === "6gWLtgTa3oS1UTa4Q4Qevu5AwYwT9ohnh8MQZwTL1xVh") {
              grossUsdtTransferred += uiAmount;
            } else if (destInfo.mint === "Baq6WjwcXX8pJBm5SALhCxWgjT5zFqHayBmGva52RNLF") {
              grossStarTransferred += uiAmount;
            }
          }
        }
      });
    });
  }
  
  console.log("Calculated USDT Transferred:", grossUsdtTransferred);
  console.log("Calculated STAR Transferred:", grossStarTransferred);
}

check().catch(console.error);
