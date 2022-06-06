const prompt = require('prompt-async')

const ec = require('elliptic').ec;

const { Level } = require('level');
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
  // generate an elliptic curve key pair
  const ecKey = new ec('secp256k1');
  const keyPair = ecKey.genKeyPair();

  // get the public key
  const publicKey = keyPair.getPublic('hex');

  // get the private key
  const privateKey = keyPair.getPrivate('hex');

  console.log("Your public key is: " + publicKey)
  console.log("Your private key is: " + privateKey)

  console.log("Would you like to save this account? (y/n)")
  prompt.start()

  prompt.get(['choice'], function (err, result) {
    if (err) { return onErr(err) }
    switch (result.choice) {
      case 'y':
        saveAccount(keyPair)
        home()
        break
      case 'n':
        console.log("Account not saved")
        home()
        break
    }
  })
}

async function saveAccount(keyPair) {
  // save the account to the database
  let accountDB = new Level(__dirname + '/accounts', { valueEncoding: 'json' })
  await accountDB.open()
  await accountDB.put("userAccount", keyPair)
  await accountDB.close()
}

async function formTransaction() {
  let recipientPublicKey;
  let amount;
  let senderPublicKey;

  let accountDB = new Level(__dirname + '/accounts', { valueEncoding: 'json' })
  await accountDB.open()
  senderKeyPair = await accountDB.get("userAccount")
  senderPublicKey = senderKeyPair.getPublic('hex')
  await accountDB.close()

  console.log("Your Public Key is: " + senderPublicKey)

  prompt.start()
  await prompt.get(['Recipient Public Key'], function (err, result) {
    if (err) { return onErr(err) }
    recipientPublicKey = result.recipient
  })

  prompt.start()
  await prompt.get(['Amount'], function (err, result) {
    if (err) { return onErr(err) }
    amount = result.amount
  })

  // create a new transaction
  const transaction = new Transaction(senderPublicKey, recipientPublicKey, amount)

  // sign the transaction
  const signedTransaction = TransactUtils.signTransaction(transaction, await accountDB.get("userAccount").getPrivate('hex'))
  console.log("Signed Transaction: " + signedTransaction)
}