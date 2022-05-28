const { Level } = require('level');
const fs = require('fs');

const BlockUtils = require('./Block');
const Block = BlockUtils.Block;

// Create a database / access an existing one
const db = new Level(__dirname + '/blockchain', { valueEncoding: 'json' })

if (!fs.existsSync(__dirname + '/blockchain')) {
  // the blockchain does not exist, so create it
  intialiseBlockchain()
  console.log("Restart the application to mine new blocks")
} else {
  mine()
}

function intialiseBlockchain() {
  db.put("lastHash", "0");
  // generate the genesis block
  BlockUtils.genesisBlock(db);
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