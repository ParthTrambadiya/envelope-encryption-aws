# Envelope Encryption in AWS: Explanation, work, and Implementation

This is a small project for envelope encryption is AWS using AWS KMS and AWS SDK. This project is done in HTML, CSS, JQUERY, EJS, NodeJS, ExpressJS, and AWS SDK for NodeJS. so, to deploy and run this small project you need to follow the below steps.

## Prerequisites
- The node must be installed on your machine.
- AWS CLI must be installed and configured on your machine, to do this visit this link https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html

## Steps
- Clone the above repository.
- Open a project in your favorite IDE and run the below command.
```
cd aws/cloudformation
```
- In `cloudformation` folder, open `parameters.json` file in an editor and enter a value of S3BucketName and DynamoDBTableName and save that file. S3 bucket name should be unique.
- Run the below command to create a CloudFormation stack, this stack will create an S3 bucket, DynamoDB Table, and Customer Master Key in KMS with proper permissions.
```
aws cloudformation create-stack --stack-name <stack-name> --template-body file://template.yaml --parameters file://parameters.json
```
- Once, the stack has been created run the below command to get KMS key ARN, S3 bucket name, and DynamoDB table name.
```
aws cloudformation describe-stacks --stack-name envelope-encryption --query "Stacks[0].Outputs"
```
- Note those returned values in the text editor or somewhere, because we will use those values in our environment variable of application.
- Inside the root directory of the project, create one file with a name `config.env` , and copy the below text and write necessary values in that file. You can get KMS key ARN, S3 bucket, and DynamoDB table name from the above command.
```
PORT=8080
AWS_REGION=
KMS_KEY_ARN=
S3_BUCKET_NAME=
DYNAMODB_TABLE_NAME=
```
- Run the below command to install dependencies and run the project in the root directory of the project.
```
npm install
npm start
```
- You can check the project on http://\<IP>:\<PORT>, e.g. http://localhost:8080.

## Test
Visit the below video for testing.
https://youtu.be/c77fXWPldMU

## Cleanup
After our work clean the CloudFormation stack if we don't need it more. To do that follow the below steps.

- Empty your bucket
```
aws s3 rm s3://bucket-name --recursive
```
- Run the below command
```
aws cloudformation delete-stack --stack-name <stack-name>
```
- **Note:** KMS Customer Master Key will not remove immediately, it will have 30 days deletion period by default, after 30 days it will delete automatically. You can change the deletion period by cancel and reschedule from the console or run the below commands from CLI.
```
aws kms cancel-key-deletion --key-id <kms-key-arn>
aws kms schedule-key-deletion --key-id <kms-key-arn> --pending-window-in-days <days>
```