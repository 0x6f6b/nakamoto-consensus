const { createHash } = require("crypto");

const COINBASE_AMOUNT = 50;

class Transaction {
  constructor(fromAddress, toAddress, amount, db) {
    // using the account model
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;

    // hash the transaction
    this.hash = createHash("sha256")
      .update(JSON.stringify(this.fromAddress + this.toAddress + this.amount))
      .digest("hex");
    console.log(this.hash);
  }
}

function coinbaseTransaction(minerAddress) {
  return new Transaction(null, minerAddress, COINBASE_AMOUNT);
}

module.exports = { Transaction, coinbaseTransaction };
