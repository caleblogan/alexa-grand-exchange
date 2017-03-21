'use strict'
const fs = require('fs')

const INPUT_IDS_LIST_FILENAME = './bin/rs07_item_ids_complete_raw.json'
const ITEM_IDS_FILENAME = './src/rs07_tradeable_items.json'

fs.readFile(INPUT_IDS_LIST_FILENAME, 'utf-8', function(err, inputdata) {
  if (err) {
    console.log('[-] Error:', err)
  }
  inputdata = JSON.parse(inputdata)
  // console.log(inputdata[4151])

  let itemIDS = Object.keys(inputdata)
  let itemIDMap = {}
  for (let i = 0; i < itemIDS.length; ++i) {
    let key = itemIDS[i]
    if (inputdata[key].tradeable) {
      itemIDMap[inputdata[key].name.toLowerCase()] = key
    }
  }
  // console.log(itemIDMap['dragon chainbody'])
  // console.log('Number of items:', Object.keys(itemIDMap).length)

  fs.writeFile(ITEM_IDS_FILENAME, JSON.stringify(itemIDMap, null, 2),function(err, data) {
    if (err) {
      console.log('[-] Error:', err)
    }
    console.log('[+] Successfully wrote items ids to ' + ITEM_IDS_FILENAME)
  })

})
