const COINBASE_AMOUNT = 50;

class TxInput { // a reference to an output from another transaction
  constructor(txId, txOutIndex, signature) {
    this.txId = txId;
    this.txOutIndex = txOutIndex;
    this.signature = signature;
  }
}

class TxOutput {
  constructor(address, amount) {
    this.address = address;
    this.amount = amount;
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount, db) {
    // firstly, create the inputs for the transaction
    this.txIns = [];

    // iterate through the chain until we find valid outputs to spend
    let total = 0;
    
  }
}

function coinbaseTransaction(minerAddress) {
  return new Transaction(null, minerAddress, COINBASE_AMOUNT);
}