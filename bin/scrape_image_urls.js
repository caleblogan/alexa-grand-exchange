'use strict'
const scrapeit = require('scrape-it')
const request = require('request')
const fs = require('fs')

const items = require('../src/rs07_item_ids')


let itemNames = Object.keys(items)
function scrapeImgUrl(itemNames, i) {
  if (i >= itemNames.length) {
    return
  }
  let itemName = itemNames[i]
  // let itemName = 'dragon_chainbody'
  let path = `http://2007.runescape.wikia.com/wiki/${itemName}`
  scrapeit(path, {
    largeImg: {
          selector: "#mw-content-text .floatleft .image"
        , attr: "href"
      }
  }).then(content => {
      let filename = 'imgs/' + itemName.replace(/ /g, '_') + '.png'
      try {
        request.get(content.largeImg)
            .pipe(fs.createWriteStream(filename))
            .on('close', () => {
              console.log(`Done writing the image to disk: ${filename}`)
              scrapeImgUrl(itemNames, ++i)
            })
        } catch(err) {
          console.log(`Error: itemname=${itemName}  index:${i}`)
          scrapeImgUrl(itemNames, ++i)
        }
  })
}
scrapeImgUrl(itemNames, 1027)

// for (let i = 0; i < itemNames.length; ++i) {
//   // let itemName = 'dragon chainbody'
//   let itemName = itemNames[i]
//   let path = `http://2007.runescape.wikia.com/wiki/${itemName}`
//   scrapeit(path, {
//     largeImg: {
//           selector: "#mw-content-text .floatleft .image"
//         , attr: "href"
//       }
//   }).then(content => {
//     request(content.largeImg).pipe(fs.createWriteStream('imgs/'+itemName.replace(' ', '_')+'.png'))
//                             .on('close', () => {
//                               console.log('done writing image to disk')
//                             })
//   })
//   break
// }
