'use strict'
const request = require('request')
const natural = require('natural')

const itemIDS = require('./rs07_item_ids')

const RS_API_ENDPOINT = 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item='

module.exports = {
  // Calls the cb with the itemName and itemPrice in format 3.2b 3.2m 3.2k 333
  getItemPrice: function(itemSlotName, cb) {
    let itemName = fuzzymatch(itemIDS, itemSlotName)
    console.log('Fuzzymatch res:', itemName)
    let itemID = itemIDS[itemName]
    getItemAPI(itemID, function(item) {
      console.log('Item price:', item['current']['price'])
      cb(itemName, item['current']['price'])
    })
  },
  // Takes in a itemPrice in the format of 333 3.2m 1.2k
  // Returns the price in the format alexa needs to sound right
  // like 3.2 mill; 1.2 k; 333 gp
  convertPriceToSSML: function(rawPrice) {
    rawPrice += ''
    let priceSSML = ''
    if (rawPrice.indexOf('b') > -1) {
      priceSSML = rawPrice.replace('b', ' bill')
    } else if (rawPrice.indexOf('m') > -1) {
      priceSSML = rawPrice.replace('m', ' mill')
    } else if (rawPrice.indexOf('k') > -1) {
      priceSSML = rawPrice
    } else if (rawPrice.indexOf('gp') > -1) {
      priceSSML = rawPrice
    } else {
      priceSSML = rawPrice + ' gp'
    }
    return priceSSML
  }
}


function getItemAPI(itemID, cb) {
  request.get({url: RS_API_ENDPOINT + itemID, json: true})
      .on('data', function(data) {
        let itemData = JSON.parse(data.toString('utf-8'))['item']
        cb(itemData)
      })
      .on('error', function(err) {
        console.log('Error:', err)
      })
}

function fuzzymatch(lookuptable, searchword) {
  let metaphone = natural.Metaphone
  let dm = natural.DoubleMetaphone
  let encoding = dm.process('Matrix')
  metaphone.attach()
  // console.log(metaphone.compare('cole', 'clay'))

  let itemNames = Object.keys(lookuptable)
  let soundAlike = []
  for (let i = 0; i < itemNames.length; ++i) {
    let item = itemNames[i]
    let alike = metaphone.compare(item, searchword)
    if (alike) {
      soundAlike.push(item)
    }
  }

  // If we dont find any words that sound alike look for edit distance on
  // all items.
  if (!soundAlike.length) {
    soundAlike = itemNames
  }
  let minItem = soundAlike[0]
  let minDistance = natural.LevenshteinDistance(minItem, searchword)
  for (let i = 1; i < soundAlike.length; ++i) {
    let dist = natural.LevenshteinDistance(soundAlike[i], searchword)
    if (dist < minDistance) {
      minItem = soundAlike[i]
      minDistance = dist
    }
  }
  return minItem
}
