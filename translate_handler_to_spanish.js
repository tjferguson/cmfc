'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const translateService = new AWS.Translate();

module.exports.translate = async (event, context) => {
  console.log('event', event);
  translate()

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

function translate() {
  let params = {
    SourceLanguageCode: 'STRING_VALUE', /* required */
    TargetLanguageCode: 'STRING_VALUE', /* required */
    Text: 'STRING_VALUE' /* required */
  };
  return translateService.translateText(params).promise()
}