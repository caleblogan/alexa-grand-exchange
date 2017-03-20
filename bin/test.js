const request = require('request')

const RS_API_ENDPOINT = 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item='

// request.get({url: RS_API_ENDPOINT + '4151', json: true}, function(err, res, body) {
//   console.log(body['item']['current']['price'])
// })

request.get({url: RS_API_ENDPOINT + '4151', json: true})
      .on('data', function(data) {
        console.log(JSON.parse(data.toString('utf-8'))['item']['current']['price'])
      })
      .on('error', function(err) {
        console.log('Error:', err)
      })
