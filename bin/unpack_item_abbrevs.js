// Unpakcs items abbreviations like
// (unf) (1,2,3,4) (p) (p+) (p++) (u) (lg) (sk)
// (t) (g) (t4) (h1-h5) (e)

'use strict'
const fs = require('fs')

const ITEMS_FILENAME = './src/rs07_tradeable_items.json'

fs.readFile(ITEMS_FILENAME, 'utf-8', function(err, inputdata) {
  if (err) {
    console.log('[-] Error:', err)
  }
  inputdata = JSON.parse(inputdata)

  let itemNames = Object.keys(inputdata)
  let itemIDMap = {}
  for (let i = 0; i < itemNames.length; ++i) {
    let itemname = itemNames[i]
    let id = inputdata[itemname]
    itemname = itemname.replace('(unf)', ' unfinished')
    itemname = itemname.replace('(1)', ' one')
    itemname = itemname.replace('(2)', ' two')
    itemname = itemname.replace('(3)', ' three')
    itemname = itemname.replace('(4)', ' four')
    itemname = itemname.replace('(p)', ' poison')
    itemname = itemname.replace('(p+)', ' poison plus')
    itemname = itemname.replace('(p++)', ' poison plus plus')
    itemname = itemname.replace('(u)', ' unstrung')
    itemname = itemname.replace('(lg)', ' legs')
    itemname = itemname.replace('(sk)', ' skirt')
    itemname = itemname.replace('(t)', ' trimmed')
    itemname = itemname.replace('(g)', ' gilded')
    itemname = itemname.replace('(t4)', ' t four')
    itemname = itemname.replace('(e)', ' enchanted')

    // Get rid of extra spaces
    itemname = itemname.split(' ')
                      .filter(word => word !== '')
                      .map(word => word.trim())
                      .join(' ')
    itemIDMap[itemname] = id
  }
  console.log(itemIDMap['dragon spear poison plus plus'])

  fs.writeFile(ITEMS_FILENAME, JSON.stringify(itemIDMap, null, 2),function(err, data) {
    if (err) {
      console.log('[-] Error:', err)
    }
    console.log('[+] Successfully wrote items ids to ' + ITEMS_FILENAME)
  })

})
