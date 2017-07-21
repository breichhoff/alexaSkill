/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

function getLuckyPerson(startDate, order) {
    var today = new Date();
    var diffMillis = today;
    var diffDays = Math.floor(diffMillis/86400000);
    var luckyIndex = diffDays % order.length;
    var luckyPerson = order[luckyIndex];
    return luckyPerson;
}

const handlers = {
    'LaunchRequest': function () {
    },
    'WhoseTurn': function () {
        const speechOutput = this;
        // const choreName = this.event.request.intent.slots["Chore"].value;
        var startDate = new Date();
        var order = this.attributes["people"];
        var luckyPersonName = getLuckyPerson(startDate, order);
        this.emit(':tell', luckyPersonName);
    },
    'AddPerson': function(){
        const person = this.event.request.intent.slots["AMAZON.US_FIRST_NAME"].value;
        const userId = this.event.session.user.userId;
        if(this.attributes["people"]){
            this.attributes["people"].push(person);
        } else{
            this.attributes["people"] = [];
            this.attributes["people"].push(person);
        }
        this.emit(':tell', 'I added ' + person + ' to the list of people.');
    },
    'AddChore': function(){
        const chore = this.event.request.intent.slots["Chore"].value;
        if(this.attributes["chores"]){
            this.attributes["chores"].push(chore);
        } else{
            this.attributes["chores"] = [];
            this.attributes["chores"].push(chore);
        }
        this.emit(':ask', 'I\'m adding ' + chore + ' to the list of chores. Who do you want to add?');
    },
    'whoDoYouWantToAdd': function(){
        const speechOutput = this.t('Who do you want to add');
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};
