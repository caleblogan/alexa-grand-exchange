'use strict'
const fs = require('fs')

const INPUT_ITEM_NAMES_FILENAME = './src/rs07_tradeable_items.json'
const SLOTS_FILENAME = './speech_assets/slots/LIST_OF_ITEMS_en_US'

fs.readFile(INPUT_ITEM_NAMES_FILENAME, 'utf-8', function(err, inputdata) {
  if (err) {
    console.log('[-] Error:', err)
  }
  inputdata = JSON.parse(inputdata)

  let items = Object.keys(inputdata)
  let itemNames = []
  for (let i = 0; i < items.length; ++i) {
    itemNames.push(items[i])
  }

  fs.writeFile(SLOTS_FILENAME, itemNames.join('\n'), function(err, data) {
    if (err) {
      console.log('[-] Error:', err)
    }
    console.log('[+] Successfully wrote items ids to ' + SLOTS_FILENAME)
  })

})
