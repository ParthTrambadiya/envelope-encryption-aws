const AWS = require('aws-sdk');
const { v4: uuidv4 } = require("uuid");

const encryption = require('../crypto/encryption');

AWS.config.update({
    region: process.env.AWS_REGION
})

const s3 = new AWS.S3();
const kms = new AWS.KMS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const upload = async (req, res) => {
    const file = req.files.file;

    kmsParams = {
        KeyId: process.env.KMS_KEY_ARN, 
        KeySpec: "AES_256"
    };

    try {
        const dataKey = await kms.generateDataKey(kmsParams).promise();

        try {
            const encryptedFile = encryption(file.data, dataKey.Plaintext);
            delete dataKey.Plaintext;

            s3Params = {
                Bucket: process.env.S3_BUCKET_NAME, // name of the bucket
                Body: encryptedFile,
                Key: file.name,
            };

            try {
                await s3.putObject(s3Params).promise();

                dynamodbParams = {
                    TableName: process.env.DYNAMODB_TABLE_NAME, // name of the table
                    Item: {
                        id: uuidv4(),
                        encryptedDataKey: dataKey.CiphertextBlob,
                        fileName: file.name
                    }
                }

                try {
                    await dynamodb.put(dynamodbParams).promise();
                    res.redirect('/download')
                } catch(error) {
                    console.log("Something went wrong in writing in dynamodb", error);
                    return res.status(500).send(error)
                }
            } catch (error) {
                console.log("Something went wrong in uploading object in S3 Bucket", error);
                return res.status(500).send(error)
            }
        } catch(error) {
            console.log('Something went wrong during encryption process', error)
            return res.status(500).send(error)
        }
    } catch(error) {
        console.log('Something went wrong during generation of data key', error)
        return res.status(500).send(error)
    }
}

module.exports = upload