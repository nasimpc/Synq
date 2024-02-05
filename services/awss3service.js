const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

exports.uploadToS3 = async (image, filename) => {
  try {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const bucketName = process.env.BUCKET_NAME;
    const s3Client = new S3Client({
      region: "ap-south-1",
      credentials: { accessKeyId, secretAccessKey },
    });
    const uploadParams = {
      Bucket: bucketName,
      Key: filename,
      Body: image,
      ACL: "public-read",
      ContentType: "image/jpeg",
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    return `https://${uploadParams.Bucket}.s3.ap-south-1.amazonaws.com/${uploadParams.Key}`;

  } catch (err) {
    console.log('Error uploading files to S3:', err);
  }
}
