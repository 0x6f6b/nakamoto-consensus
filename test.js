const { Level } = require('level');

async function getData() {
    let otherDb = new Level(__dirname + '/blockchain', { valueEncoding: 'json' });
    otherDb.open()
    console.log("Last hash is: " + await otherDb.get("lastHash"))
    otherDb.close()

    let accountDB = new Level(__dirname + '/accounts', { valueEncoding: 'json' });
    await accountDB.open()
    accountDB.put("userAccount", "something")
    console.log("Your Public Key is: " + await accountDB.get("userAccount").publicKey)
    accountDB.close()
}
getData()
    