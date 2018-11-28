const AWS = require('aws-sdk')
AWS.config.update({region:'us-east-1'});

const transcribeservice = new AWS.TranscribeService();
var params = {
  TranscriptionJobName: 'nick-test-sdk-hola' /* required */
};
transcribeservice.getTranscriptionJob(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});