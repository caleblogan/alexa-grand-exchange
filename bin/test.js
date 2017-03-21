const request = require('request')
const natural = require('natural')

const itemIDS = require('../src/rs07_item_ids')

const RS_API_ENDPOINT = 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item='

request.get({url: RS_API_ENDPOINT + '2619', json: true}, function(err, res, body) {
  console.log(body['item']['current']['price'])
  console.log(convertPriceToSSML(body['item']['current']['price']))
})

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
// let start = Date.now()
// console.log('Are alike:', fuzzymatch(itemIDS, 'bandos good  sword'))
// let totalTime = Date.now() - start
// console.log('Time:', totalTime + 'ms')


// console.log(natural.LevenshteinDistance('gold ore', 'gold ore'))

// let itemName = fuzzymatch(itemIDS, 'cole')
// let itemID = itemIDS[itemName]
// console.log('NAME:', itemName, ' - ', 'ID:', itemID)
//
// if (itemID) {
//   request.get({url: RS_API_ENDPOINT + itemID, json: true})
//       .on('response', function(res) {
//         if (res.statusCode !== 200) {
//           console.log('Error:', 'There was an error with the rs api.')
//           throw Error('error with rs api')
//         }
//       })
//       .on('data', function(data) {
//         console.log(JSON.parse(data.toString('utf-8'))['item']['current']['price'])
//       })
//       .on('error', function(err) {
//         console.log('Error:', err)
//       })
// } else {
//   console.log('Invalid name:', itemName)
// }
function convertPriceToSSML(rawPrice) {
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
