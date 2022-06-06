const CryptoJS = require('crypto-js');

const COINBASE_AMOUNT = 50;

class Transaction {
  constructor(fromAddress, toAddress, amount, db) {
    // using the account model
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

function signTransaction(transaction, privateKey) {
  const hash = CryptoJS.SHA256(transaction.fromAddress + transaction.toAddress + transaction.amount).toString();
  const signature = CryptoJS.HmacSHA256(hash, privateKey).toString();
  transaction.signature = signature;
  return transaction;
}

function coinbaseTransaction(minerAddress) {
  return new Transaction(null, minerAddress, COINBASE_AMOUNT);
}

module.exports = { Transaction, coinbaseTransaction, signTransaction };