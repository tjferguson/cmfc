'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const translateService = new AWS.Translate();
const s3 = new AWS.S3();
// const destinationBucket = process.env.polly_output_bucket_to_spanish
const destinationBucket = 'polly-to-spanish'
module.exports.polly_to_spanish = (event, context,callback) => {
  console.log('event', JSON.stringify(event,undefined,2));
  var src_bkt = event.Records[0].s3.bucket.name;
  var src_key = event.Records[0].s3.object.key;
  return getS3Object(src_bkt,src_key)
    .then((text) => {
      console.log('text', JSON.stringify(text,undefined,2))
      return pollyize('en-US', text, destinationBucket)
    });
};

function pollyize(lang, text, bucket) {
  let params = {
    OutputFormat: "ogg_vorbis", /* required */
    OutputS3BucketName: bucket, /* required */
    Text: text, /* required */
    // VoiceId: Geraint | Gwyneth | Mads | Naja | Hans | Marlene | Nicole | Russell | Amy | Brian | Emma | Raveena | Ivy | Joanna | Joey | Justin | Kendra | Kimberly | Matthew | Salli | Conchita | Enrique | Miguel | Penelope | Chantal | Celine | Lea | Mathieu | Dora | Karl | Carla | Giorgio | Mizuki | Liv | Lotte | Ruben | Ewa | Jacek | Jan | Maja | Ricardo | Vitoria | Cristiano | Ines | Carmen | Maxim | Tatyana | Astrid | Filiz | Vicki | Takumi | Seoyeon | Aditi | Zhiyu | Bianca | Lucia | Mia, /* required */
    LanguageCode: lang,
    // LexiconNames: [
    //   'STRING_VALUE',
    //   /* more items */
    // ],
    // OutputS3KeyPrefix: 'STRING_VALUE',
    // SampleRate: 'STRING_VALUE',
    // SnsTopicArn: 'STRING_VALUE',
    // SpeechMarkTypes: [
    //   sentence | ssml | viseme | word,
    //   /* more items */
    // ],
    // TextType: ssml | text
  };
  return polly.startSpeechSynthesisTask(params).promise;
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