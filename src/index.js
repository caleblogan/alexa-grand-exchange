'use strict'
const Alexa = require('alexa-sdk')
const ge = require('./grandexchange')
const config = require('./config.json')

const APP_ID = config['APP_ID']

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'))
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMT')
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech)
    },
    'LookupItemPriceIntent': function() {
      let itemSlot = this.event.request.intent.slots.Item
      let itemName = itemSlot ? itemSlot.value.toLowerCase() : null
      console.log('Item Slot:', itemSlot)
      console.log('Item Name:', itemName)

      if (itemName) {
        ge.getItemPrice(itemName, (itemPrice) => {
          try {
            this.emit(':tell', 'The price of ' + itemName + ' is ' + itemPrice + '.')
          } catch(e) {
            this.emit(':tellWithCard', 'Error with item' + itemName, 'Error Title', 'Item Name spoken: ' + itemName)
          }
        })
      } else {
        this.emit(':tell', 'The item you requested was not found.')
      }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE')
        this.attributes.repromptSpeech = this.t('HELP_REPROMT')
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech)
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest')
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest')
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'))
    },
};

const languageStrings = {
    'en-GB': {
        translation: {},
    },
    'en-US': {
        translation: {
            SKILL_NAME: 'The Grand Exchange',
            WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, what\'s the price of coal... Now, what can I help you with.",
            WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s - Price for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the price of iron ore, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what\'s the price of gold bars, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
        },
    },
    'de-DE': {
        translation: {},
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context)
    alexa.APP_ID = APP_ID
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings
    alexa.registerHandlers(handlers)
    alexa.execute()
};
