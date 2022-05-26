CryptoJS = require('crypto-js');

class Block {
  constructor(transactions, previousHash) {
    this.transactions = transactions;
    this.previousHash = previousHash;
  }

  calculateProofOfWork(difficulty) {
    this.nonce = 0;
    let hash = this.calculateHash();
    while (hash >= difficulty) {
      this.nonce++;
      hash = this.calculateHash();
    }
    console.log(`Found proof of work: ${hash}, nonce: ${this.nonce}`);
  }

  calculateHash() {
    return CryptoJS.SHA256(this.previousHash + this.transactions + this.nonce).toString();
  }
}

function genesisBlock() {
  return new Block(
    [coinbaseTransaction('0')],
    '0'
  );
}

