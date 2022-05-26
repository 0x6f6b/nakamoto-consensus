const { Level } = require('level')

main()
async function main() {
  // Create a database
  const db = new Level(__dirname + '/blocks', { valueEncoding: 'json' })

  const value = await db.get('block1')

  console.log("value: ", value)
}
