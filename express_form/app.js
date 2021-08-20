var express = require('express');
var app = express();

// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://aws.amazon.com/developers/getting-started/nodejs/
//TODO: update licensing info - Apache 2.0 - visit AWS site

// Load the AWS SDK
var AWS = require('aws-sdk'),
    region = "us-west-1",
    secretName = "db_credentials",
    secret,
    decodedBinarySecret;

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

// In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
// See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
// We rethrow the exception by default.

client.getSecretValue({SecretId: secretName}, function(err, data) {
    if (err) {
        if (err.code === 'DecryptionFailureException')
            // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InternalServiceErrorException')
            // An error occurred on the server side.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidParameterException')
            // You provided an invalid value for a parameter.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'InvalidRequestException')
            // You provided a parameter value that is not valid for the current state of the resource.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
        else if (err.code === 'ResourceNotFoundException')
            // We can't find the resource that you asked for.
            // Deal with the exception here, and/or rethrow at your discretion.
            throw err;
    }
    else {
        // Decrypts secret using the associated KMS CMK.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ('SecretString' in data) {
            secret = data.SecretString;
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            decodedBinarySecret = buff.toString('ascii');
        }
    }
    
    // Code below is my own and not from template provided by AWS 
    // Code below is from Express JS MySQL connection page 
    
    var secretObj = JSON.parse(secret);
    var mysql = require('mysql');
    var response_text = ''; 
    var connection = mysql.createConnection({
      host: secretObj["host"].replace(":3306", ""),
      user: secretObj["username"],
      password: secretObj["password"],
      database: secretObj["database"]
    });

    connection.connect();

    connection.query('SELECT * FROM people', function (err, rows, fields) {
      if (err) throw err

      //console.log('The solution is: ', rows)
      response_text = rows

      // Write MySQL data to file, set up app server to serve response containing JSON data from MySQL

      app.set('port', (process.env.PORT || 8080))
      app.use(express.static(__dirname + '/public'))

      app.get('/', function(request, response) {
        response.send(response_text)
      })

      app.listen(app.get('port'), function() {
        console.log("App listening at localhost:" + app.get('port'))
      })

    });

    connection.end();
});

module.exports = app;
