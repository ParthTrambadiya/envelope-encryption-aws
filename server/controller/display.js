const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.AWS_REGION
})

const dynamodb = new AWS.DynamoDB.DocumentClient();

const display = async (req, res) => {
    dynamoDBParams = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        ProjectionExpression: "id, fileName, mimeType"
    }
    try {
        const scanResult = await dynamodb.scan(dynamoDBParams).promise()
        res.status(200).send(scanResult.Items)
    } catch (error) {
        console.log('Something went wrong in getting data from dynamodb', error)
        res.status(500).send(error);
    }
}

module.exports = display
