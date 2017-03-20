'use strict'
const request = require('request')
const itemIDS = require('./rs07_item_ids')

const RS_API_ENDPOINT = 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item='

module.exports = {
  getItemPrice: function(itemName, cb) {
    let itemID = itemIDS[itemName]
    getItemAPI(itemID, function(item) {
      cb(item['current']['price'])
    })
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


// getItemAPI('4151', (itemPrice) => console.log('Item Price:', itemPrice))
module.exports.getItemPrice('abyssal whip', price => console.log('The price:', price))
