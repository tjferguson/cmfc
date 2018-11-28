const AWS = require('aws-sdk')
AWS.config.update({region:'us-east-1'});

const transcribeservice = new AWS.TranscribeService();
let params = {
  LanguageCode: "es-US",
  Media: {
    MediaFileUri: 'https://s3.amazonaws.com/transcribe-input-nbas/hack_audio.m4a',
  },
  MediaFormat: "mp4",
  TranscriptionJobName: 'nick-test-sdk-hola' /* required */
};
transcribeservice.startTranscriptionJob(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});