'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const translateService = new AWS.Translate();
const s3 = new AWS.S3();
// const destinationBucket = process.env.polly_input_bucket
const destinationBucket = 'work-polly-input-to-spanish'
const badWords = ['google', 'ibm', 'azure', 'cpc']

function tasks(src_bkt,src_key,destinationBucket ) {
  return new Promise(function(resolve,reject) {
    return getS3Object(src_bkt, src_key)
      .then((text) => {
        console.log('text',JSON.stringify(text,undefined,2));
        resolve(translate('en', 'es', text.Body.toString('utf-8'))
          .then((translatedText) => {
            console.log('translatedText', translatedText);
            // let stringToTest = translatedText['TranslatedText']['results']['transcripts'][0]['transcript'].toString('utf-8'); // Use the encoding necessary
            // console.log('stringToTest', stringToTest);
            /*
             BAD DETECTOR
             */
            console.log('destinationBucket',destinationBucket)
            let base64data = new Buffer(translatedText.toString(), 'binary');
            return putObject(destinationBucket, src_key, base64data)
          })
        );
      });
  });
}
module.exports.translate_to_spanish = (event, context,callback) => {
  console.log('event', event);
  let src_bkt = event.Records[0].s3.bucket.name;
  let src_key = event.Records[0].s3.object.key;
  let results_p = tasks(src_bkt,src_key,destinationBucket)
  Promise.all([results_p]).then(function(data){
    console.log('lamda successful...',data);
    const response = {
      statusCode: 200,
      body: {
        message: 'lamda successful',
        results: data,
      },
    };
    callback(null, response);
  }).catch(function(err){
    console.log('ending err',err);
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'lambda unsuccessful',
        input: err,
      }),
    };
    callback(response, null);
  });
};

function translate(source, target, text) {
  console.log('translating')
  let params = {
    SourceLanguageCode: source, /* required */
    TargetLanguageCode: target, /* required */
    Text: text /* required */
  };
  return translateService.translateText(params).promise();
}

function getS3Object(src_bkt, src_key) {
  // Retrieve the object
  let params = {
    Bucket: src_bkt,
    Key: src_key
  };
  return s3.getObject(params).promise()
}

function putObject(bucket, key, body) {
  let params = {
    Body: body,
    Bucket: bucket,
    Key: key
    // ServerSideEncryption: "AES256",
    // Tagging: "key1=value1&key2=value2"
  };
  return s3.putObject(params).promise()
}