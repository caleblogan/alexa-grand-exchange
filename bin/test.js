const request = require('request')
const natural = require('natural')

const itemIDS = require('../src/rs07_item_ids')

const RS_API_ENDPOINT = 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item='

// request.get({url: RS_API_ENDPOINT + '1231', json: true}, function(err, res, body) {
//   console.log(body['item']['current']['price'])
//   console.log(convertPriceToSSML(body['item']['current']['price']))
// })

// let inp = 'room dagger'
// let a = 'iron dagger'
// let b = 'rune dagger'
let item = 'shortbow (u)'.replace('(u)', ' unstrung')
                        .split(' ')
                        .filter(word => word !== '')
console.log(item)

let inp = 'run acts'
let a = 'rune axe'
let b = 'rune dart'
// console.log(natural.LevenshteinDistance(inp, a))
// console.log(natural.LevenshteinDistance(inp, b))
// console.log(natural.JaroWinklerDistance(inp, a))
// console.log(natural.JaroWinklerDistance(inp, b))
let metaphone = natural.Metaphone
let soundEx = natural.SoundEx
let dm = natural.DoubleMetaphone
let encodingA = dm.process('room')
let encodingB = dm.process('rune')

let ap = metaphone.process('rune axe')
let bp = metaphone.process('rune acts')

let cp = metaphone.process('rune dart')
let dp = metaphone.process('room dark')

console.log(metaphone.process('dharok\'s platebody'))

console.log(natural.LevenshteinDistance(ap, bp))
console.log(natural.LevenshteinDistance(ap, cp))

// console.log(encodingA)
// console.log(encodingB)
// metaphone.attach()
// console.log(metaphone.compare(inp.split(' ')[1], a.split(' ')[1]))
// console.log(metaphone.compare(inp.split(' ')[1], b.split(' ')[1]))
// console.log(dm.compare('room', 'rune'))
// console.log(metaphone.compare(inp, b))

function fuzzymatch(lookuptable, searchword) {
  let metaphone = natural.Metaphone
  let dm = natural.DoubleMetaphone

  let itemNames = Object.keys(lookuptable)
  let soundAlike = []
  for (let i = 0; i < itemNames.length; ++i) {
    let item = itemNames[i]
    // let alike = metaphone.compare(metaphone.item, searchword)
    let alike = metaphone.process(item, 1) === metaphone.process(searchword, 1)
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
    } else if (dist == minDistance) {
      let minDPLev = natural.LevenshteinDistance(metaphone.process(minItem), metaphone.process(searchword))
      let itemDPLev = natural.LevenshteinDistance(metaphone.process(soundAlike[i]), metaphone.process(searchword))
      if (itemDPLev < minDPLev) {
        minItem = soundAlike[i]
        minDistance = dist
      }
    }
  }
  return minItem
}
let start = Date.now()
let testStrings = [
  'room dark',
  'rune acts',
  'bandyl god sword',
  "dharok's platebody"
]
console.log('Fuzzymatch:', fuzzymatch(itemIDS, testStrings[3]))
let totalTime = Date.now() - start
console.log('Time:', totalTime + 'ms')


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
