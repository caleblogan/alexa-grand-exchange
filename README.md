# Grand Exchange
Alexa skill using the Runescape api to get price info about items.
Check it out on the Alexa skills directory: <a href="https://www.amazon.com/caleb-logan-Unofficial-Grand-Exchange/dp/B06XS4ZL4L/ref=sr_1_1?s=digital-skills&ie=UTF8&qid=1501643093&sr=1-1&keywords=grand+exchange">alexa skill</a>

# Sample Utterances
- "Alexa, ask Marketplace what's the price of dragon warhammer"
- "Alexa, ask Marketplace what's the price of coal"

# How to Setup
- Create a new alexa skill on amazon developers dashboard
- Add the slots and utterances to skill and fill at the rest appropriately
- Create a new lambda function (Node.js 4.3) and name the handler index.handler
- Upload the bin/dist.zip to lambda function
- Make sure to point alexa skill to lambda function
