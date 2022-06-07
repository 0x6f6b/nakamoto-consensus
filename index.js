const prompt = require('prompt-async')
const ec = require('elliptic').ec;
var ecCurve = new ec('secp256k1');

const { Level } = require('level');
const { generateKeyPairSync, generateKeyPair } = require('crypto')

// accessing the file system
const fs = require('fs');

const BlockUtils = require('./Block');
const Block = BlockUtils.Block;

const TransactUtils = require('./Transaction');


const Transaction = TransactUtils.Transaction;

if (!fs.existsSync(__dirname + '/blockchain')) {
  // the blockchain does not exist, so create it
  intialiseBlockchain()
  console.log("Restart the application to mine new blocks")
} else {
  home()
}

function home() {
  console.log("What would you like to do?")
  console.log("1. Mine a new block")
  console.log("2. Make a new transaction")
  console.log("3. Create an account")

  prompt.start()

  prompt.get(['choice'], function (err, result) {
    if (err) { return onErr(err) }
    switch (result.choice) {
      case '1':
        mine()
        break
      case '2':
        formTransaction()
        break
      case '3':
        createAccount()
        break
    }
  })
}

async function intialiseBlockchain() {
  // Create a database / access an existing one
  const db = new Level(__dirname + '/blockchain', { valueEncoding: 'json' })
  await db.open();
  await db.put("lastHash", "0");
  await db.close();

  // generate the genesis block
  BlockUtils.genesisBlock();
  console.log("The Genesis Block has been created")
}

async function mine() {
  // get the hash of the last block
  const lastHash = await db.get("lastHash");

  // get the last block number
  const lastBlockNumber = await db.get("lastBlockNumber");

  // fetch the transactions from the mempool
  const transactions = getTransactions();

  // create a new block
  const newBlock = new Block(transactions, lastHash)
  newBlock.blockNumber = lastBlockNumber + 1;

  // add the block to the blockchain and persist it
  await BlockUtils.addBlock(db, newBlock);

  // recursively call this function to mine the next block
  mine();
}

function getTransactions() {
  return null
}

function createAccount() {
  // generate a key pair
  const keys = ecCurve.genKeyPair();

  let pubPoints = keys.getPublic();
  let pub = pubPoints.encode('hex');
  console.log("Public Key: " + pub)

  let priv = keys.getPrivate();
  let privHex = priv.toString(16);

  // save the account to the database
  let account = {
    publicKey: pub,
    privateKey: privHex
  }

  console.log("Would you like to save this account? (y/n)")
  prompt.start()

  prompt.get(['choice'], function (err, result) {
    if (err) { return onErr(err) }
    switch (result.choice) {
      case 'y':
        saveAccount(account)
        home()
        break
      case 'n':
        console.log("Account not saved")
        home()
        break
    }
  })
}

async function saveAccount(account) {
  // save the account to the database
  let accountDB = new Level(__dirname + '/accounts', { valueEncoding: 'json' })
  await accountDB.open()
  await accountDB.put("userAccount", account)
  await accountDB.close()
}

async function formTransaction() {
  let accountDB = new Level(__dirname + '/accounts', { valueEncoding: 'json' })

  await accountDB.open()
  let account = await accountDB.get("userAccount")

  let keys = ecCurve.keyFromPrivate(account.privateKey, 'hex');
  await accountDB.close()

  console.log("Your Public Key was successfully fetched")
  let pubPoints = keys.getPublic();
  let pub = pubPoints.encode('hex');
  console.log("Public Key: " + pub)

  // prompt.start()
  // await prompt.get(['Recipient Public Key'], function (err, result) {
  //   if (err) { return onErr(err) }
  //   recipientPublicKey = ecCurve.keyFromPublic(result.recipient, 'hex');
  // })

  // prompt.start()
  // await prompt.get(['Amount'], function (err, result) {
  //   if (err) { return onErr(err) }
  //   amount = result.amount
  // })

  console.log("I got here")
  // output the private
  let privPoints = keys.getPrivate();
  let priv = privPoints.toString(16);
  console.log("Private Key: " + priv)

  // create a new transaction
  const transaction = new Transaction(pub, null, 20)

  // sign the transaction
  const signedTransaction = TransactUtils.signTransaction(transaction, privateKey)
  console.log("Signed Transaction: " + signedTransaction)
}