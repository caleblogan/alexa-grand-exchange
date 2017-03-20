'use strict'
const utterances = require('alexa-utterances')
const fs = require('fs')

const UTTERANCES_FILE_PATH = './speech_assets/'
const UTTERANCES_FILE_NAME = 'utterances_en_us'

let dictionary = {
  'city_team': ['{-|City} {-|Team}', '{-|Team}']
};
let slots = {};
let templates = [
  "LookupItemPriceIntent what{'s|s| is} the price of {the |}{-|Item}",
  "LookupItemPriceIntent for the price of {the |}{-|Item}",
]
let exhaustive = true


let data = []
for (let i = 0; i < templates.length; ++i) {
  data = data.concat(utterances(templates[i], slots, dictionary, exhaustive))
}
// console.log(data.join('\n'))

fs.writeFile(UTTERANCES_FILE_PATH + UTTERANCES_FILE_NAME, data.join('\n'), (err, data) => {
  console.log('[+] Successfully wrote utterances to ' + UTTERANCES_FILE_PATH + UTTERANCES_FILE_NAME)
})
