const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
//It represents the S3 service client, which you use to send requests to the Amazon S3 service.
//You create an instance of S3Client to configure and manage the connection to Amazon S3, including specifying credentials, region, and other configurations.
//It represents a command that you can send to the S3 service to upload an object (file) to an S3 bucket.
//You create an instance of PutObjectCommand with specific parameters such as the bucket name, key (file name), and body (file content), and then send this command using the S3Client.

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
