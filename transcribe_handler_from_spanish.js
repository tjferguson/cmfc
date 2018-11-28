'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const transcribeservice = new AWS.TranscribeService();

module.exports.transcribe = async (event, context) => {
  console.log('event',event);

  let params = {
    LanguageCode: "es-US",
    Media: {
      MediaFileUri: 'https://s3.amazonaws.com/transcribe-input-nbas/hack_audio.m4a',
    },,
    MediaFormat: "mp4"
    TranscriptionJobName: 'nick-test-sdk-hola' /* required */
  };
  return transcribeservice.startTranscriptionJob(params).promise()
    // .then((res) => {
    //   return res
    // });
};