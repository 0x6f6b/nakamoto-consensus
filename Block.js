const CryptoJS = require('crypto-js');

const TARGET = 0xFAB4643C9EECCE1AA639D1A4284AE63DCDDF3479F584E2135AFF04D6A76n; // about 20 seconds on my cpu

class Block {
  constructor(transactions, previousHash) {
    this.transactions = transactions;
    this.previousHash = previousHash;
  }

  calculateProofOfWork(target) {
    console.log("Calculating proof of work...");
    this.nonce = 0;
    let hash = this.calculateHash();

    // convert hash to a big number
    let hashValue = BigInt("0x" + hash);

    while (hashValue >= target) {
      this.nonce = Math.random().toString();
      hash = this.calculateHash();
      hashValue = BigInt("0x" + hash);
    }

    console.log(`Found proof of work: ${hash}, nonce: ${this.nonce}`);
    this.hash = hash;
    this.timestamp = Date.now();
  }

  calculateHash() {
    return CryptoJS.SHA256(this.blockNumber + this.previousHash + this.transactions + this.nonce).toString();
  }
}

function genesisBlock(db) {
  console.log("Creating the Genesis Block...");
  // creating the genesis block
  genesisBlock = new Block(null, "0");

  // calculate the proof of work
  console.log("Starting the proof of work...");
  genesisBlock.calculateProofOfWork(TARGET);
  console.log("finished the proof of work...");

  // set the lastHash to the genesis block's hash
  db.put("lastHash", genesisBlock.hash);
  console.log("last hash set to genesis block's hash");

  // set the lastBlockNumber to 0
  db.put("lastBlockNumber", 0);
  console.log("last block number set to 0");

  db.put(genesisBlock.hash, genesisBlock); // add the genesis block to the blockchain"
  console.log("added the genesis block to the blockchain");
}

async function addBlock(blockchain, newBlock) {
  newBlock.calculateProofOfWork(TARGET)

  await blockchain.put("lastHash", newBlock.calculateHash());
  await blockchain.put("lastBlockNumber", newBlock.blockNumber);
  await blockchain.put(newBlock.calculateHash(), newBlock);
}

module.exports = { addBlock, genesisBlock, Block: Block };