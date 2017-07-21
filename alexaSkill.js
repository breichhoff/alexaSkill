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
const APP_ID = undefined;
var docClient = new AWS.DynamoDB.DocumentClient();

const handlers = {
    'LaunchRequest': function () {
        // this.emit('GetFact');
    },
    'WhoseTurn': function (choreName) {
        var startDate = getChoreStartDate(choreName);
        var order = getOrderDefault();
        var luckyPersonName = getLuckyPerson(startDate, order);
        this.emit(':tell', luckyPersonName);
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
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function getChoreStartDate(choreName){
    const userId = this.event.session.user.userId;
    var params = {
        TableName : "Chore",
        Key: {
            "UserId": userId,
            "Name": choreName
        }
    };
    docClient.get(params, function(err, data) {
        if(err){
            console.error("Error getting chore:",
                JSON.stringify(err, null, 2));
        } else {
            return data.StartDate;
        }
    });
}
function getOrderDefault(){
    const userId = this.event.session.user.userId;
    var params = {
        TableName : "Person",
        KeyConditionExpression: "#id = :ID",
        ExpressionAttributeNames:{
            "#id": "UserId"
        },
        ExpressionAttributeValues: {
            ":ID": userId
        }
    };
    docClient.query(params, function(err, data) {
        if(err){
            console.error("Error getting order of people for chore:",
                JSON.stringify(err, null, 2));
        } else {
            return data;
        }
    });
}
function getLuckyPerson(startDate, order) {
    var today = new Date();
    var diffMillis = today - startDate;
    var diffDays = Math.floor(diffMillis/86400000);
    var luckyIndex = diffDays % order.length;
    var luckyPerson = order[luckyIndex];
    return luckyPerson;
}