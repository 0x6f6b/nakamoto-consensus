const COINBASE_AMOUNT = 50;

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

function coinbaseTransaction(minerAddress) {
  return new Transaction(null, minerAddress, COINBASE_AMOUNT);
}