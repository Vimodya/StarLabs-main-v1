import { Connection } from "@solana/web3.js";

async function main() {
    const conn = new Connection("https://api.devnet.solana.com");
    const tx = await conn.getTransaction("5ZrB21gEWsgeWA9ER2UB1Q7sv2NAao8iTiucxoY8XuG2Q5oMCfWdAharpH9iWrTySmZ5kptEfH6GHF7W582yssUx", {maxSupportedTransactionVersion: 0});
    
    if(tx) {
        const pId = tx.transaction.message.accountKeys[3];
        console.log("ACTUAL PROGRAM ID:", pId.toBase58());
    }
}

main().catch(console.error);
