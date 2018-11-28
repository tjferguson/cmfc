'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const transcribeservice = new AWS.TranscribeService();
const s3 = new AWS.S3();
const destinationBucket = process.env.translate_input_bucket;
// const destinationBucket = "translate-input-to-spanish-dev"

function tasks(src_bkt, src_key,destinationBucket) {
  return new Promise(function(resolve,reject) {
    if (src_key.includes('.txt')) {
      resolve(copyS3File(destinationBucket, src_bkt, src_key))
    } else {
      resolve(transcribe(src_bkt, src_key, 'mp4', `${src_bkt}-${src_key}`, destinationBucket))
    };
  });
}

module.exports.transcribe_from_english = (event, context, callback) => {
  console.log('event',JSON.stringify(event, undefined,2));
  console.log('I am here')
  var src_bkt = event.Records[0].s3.bucket.name;
  var src_key = event.Records[0].s3.object.key;
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

function transcribe(sourceBucket, key, mediaFormat, jobName, outputBucket) {
  console.log('transcribing')
  console.log(`https://s3.amazonaws.com/${sourceBucket}/${key}`)
  let params = {
    LanguageCode: "en-US",
    Media: {
      MediaFileUri: `https://s3.amazonaws.com/${sourceBucket}/${key}`,
    },
    MediaFormat: "mp4",
    TranscriptionJobName: jobName,
    OutputBucketName: outputBucket
  };
  return transcribeservice.startTranscriptionJob(params).promise()
};

function copyS3File(destinationBucket, copySource, key) {
  console.log('copying file')
  let params = {
    Bucket: destinationBucket,
    CopySource: copySource,
    Key: key
  };
  return s3.copyObject(params).promise()
};