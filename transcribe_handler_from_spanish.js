'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const transcribeservice = new AWS.TranscribeService();
const s3 = new AWS.S3();
const destinationBucket = process.env.translate_input_bucket

module.exports.transcribe_from_spanish = (event, context) => {
  console.log('event',event);
  var src_bkt = event.Records[0].s3.bucket.name;
  var src_key = event.Records[0].s3.object.key;
  if (event.Records[0].s3.object.key.includes('.txt')) {
    copyS3File(destinationBucket, src_bkt, src_key)
  }else{
    transcribe(src_bkt, src_key, 'mp4', `${src_bkt}/${src_key}, destinationBucket)
  }
};

function transcribe(sourceBucket, key, mediaFormat, jobName, outputBucket) {
  let params = {
    LanguageCode: "es-US",
    Media: {
      MediaFileUri: `https://s3.amazonaws.com/${sourceBucket}/${key}`,
    },
    MediaFormat: "mp4",
    TranscriptionJobName: jobName,
    OutputBucketName: outputBucket
  }
  return transcribeservice.startTranscriptionJob(params).promise()
};

function copyS3File(destinationBucket, copySource, key) {
  let params = {
    Bucket: destinationBucket,
    CopySource: copySource,
    Key: key
  };
  return s3.copyObject(params).promise()
}