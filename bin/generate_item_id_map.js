'use strict'
const fs = require('fs')

const INPUT_IDS_LIST_FILENAME = './bin/rs07_item_ids_raw.json'
const ITEM_IDS_FILENAME = './src/rs07_item_ids.json'

fs.readFile(INPUT_IDS_LIST_FILENAME, 'utf-8', function(err, inputdata) {
  if (err) {
    console.log('[-] Error:', err)
  }
  inputdata = JSON.parse(inputdata)

  let itemIDMap = {}
  for (let i = 0; i < inputdata.length; ++i) {
    itemIDMap[inputdata[i].name.toLowerCase()] = inputdata[i].id
  }

  fs.writeFile(ITEM_IDS_FILENAME, JSON.stringify(itemIDMap, null, 2),function(err, data) {
    if (err) {
      console.log('[-] Error:', err)
    }
    console.log('[+] Successfully wrote items ids to ' + ITEM_IDS_FILENAME)
  })

})
