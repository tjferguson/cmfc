'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const translateService = new AWS.Translate();
const s3 = new AWS.S3();
const destinationBucket = process.env.polly_input_bucket
const badWords = ['google', 'ibm', 'azure', 'cpc']
module.exports.translate_to_english = (event, context) => {
  console.log('event', event);
  var src_bkt = event.Records[0].s3.bucket.name;
  var src_key = event.Records[0].s3.object.key;
  return getS3Object(src_bkt,src_key)
    .then((text) => {
      return translate('es', 'en', text)
        .then((translatedText) => {
          let stringToTest = translatedText.Body.toString('utf-8'); // Use the encoding necessary
          console.log('stringToTest', stringToTest);
          /*
          BAD DETECTOR
           */


          let base64data = new Buffer(translatedText, 'binary');
          return putObject(destinationBucket, src_key, base64data)
        });
    });
};

function translate(source, target, text) {
  let params = {
    SourceLanguageCode: source, /* required */
    TargetLanguageCode: target, /* required */
    Text: text /* required */
  };
  return translateService.translateText(params).promise();
}

function getS3Object(src_bkt, src_key) {
  // Retrieve the object
  var params = {
    Bucket: src_bkt,
    Key: src_key
  };
  return s3.getObject(params).promise()
}

function putObject(bucket, key, body) {
  let params = {
    Bucket: bucket,
    Key: key,
    Body: body,
    // ServerSideEncryption: "AES256",
    // Tagging: "key1=value1&key2=value2"
  };
  return s3.putObject(params).promise()
}