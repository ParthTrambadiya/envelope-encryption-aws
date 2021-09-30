const AWS = require('aws-sdk');
const decryption = require('../crypto/decryption');

AWS.config.update({
    region: process.env.AWS_REGION
})

const s3 = new AWS.S3();
const kms = new AWS.KMS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const download = async(req, res) => {
    const fileId = req.params.fileId;

    dyanmodbParams = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
            id: fileId,
        }
    }

    try {
        const item = await dynamodb.get(dyanmodbParams).promise();

        s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: item.Item.fileName,
        };

        try {
            const object = await s3.getObject(s3Params).promise();

            kmsParams = {
                CiphertextBlob: item.Item.encryptedDataKey, 
                KeyId: process.env.KMS_KEY_ARN
            };

            try {
                const decryptedDataKey = await kms.decrypt(kmsParams).promise();
                const decryptedFile = decryption(object.Body, decryptedDataKey.Plaintext);

                return res.status(200).send({ file: decryptedFile, fileName: item.Item.fileName });

            } catch(error) {
                console.log("Something went wrong during decryption of data key: ", error);
                return res.status(500).send(error)
            }
        } catch(error) {
            console.log("Something went wrong in fetching object from s3 bucket: ", error);
            return res.status(500).send(error)
        }

    } catch(error) {
        console.log("Something went wrong in fetching data from dynamodb: ", error);
        return res.status(500).send(error)
    }
}

module.exports = download