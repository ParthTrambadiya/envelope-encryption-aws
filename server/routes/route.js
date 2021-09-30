const express = require('express')
const route = express.Router()

const upload = require('../controller/upload')
const display = require('../controller/display')
const download = require('../controller/download')
const services = require('../services/services');

/**
 * @description Root route
 * @method GET
 */
route.get('/', services.rootRoute)

/**
 * @description Download route
 * @method GET
 */
route.get('/download', services.downloadRoute)

/**
 * @description Upload encrypted file to s3 bucket and record data in dynamodb
 * @method POST
 */
route.post("/upload/api", upload)

/**
 * @description Download decryptes file from s3 bucket
 * @method POST
 */
route.get('/download/api/:fileId', download)

/**
 * @description Display all files from DynamoDB table
 * @method GET
 */
route.get('/display/api', display)
module.exports = route