'use strict';
exports.handler = (event, context, callback) => {
    
/*
##### References
- [AWS Docs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-how-it-works-tutorial.html)
- [AWS Github](https://github.com/awslabs/serverless-application-model/blob/master/examples/2016-10-31/lambda_edge/src/index.js)
- [Stackery Blog](https://github.com/Nuatu/demo-lambda-edge-example/blob/master/src/edgeFunction/index.js)

*/

function add(h, k, v) {
        h[k.toLowerCase()] = [
            {
                key: k,
                value: v
            }
        ];
    }


//Get contents of Request
const request = event.Records[0].cf.request;

//Get contents of response
const response = event.Records[0].cf.response;

const headers = response.headers;

console.log("Request: %j", request);
console.log("Headers: %j", headers);

const euPath = '/eu';
const inPath = '/in';

if (headers['cloudfront-viewer-country']) {
    const countryCode = headers['cloudfront-viewer-country'][0].value;
    if (countryCode === 'EU') {
      request.uri = euPath + request.uri;
    } else if(countryCode === 'IN') {
      request.uri = inPath + request.uri;
    }
}

console.log(`Request uri set to "${request.uri}"`);


//Set new headers
headers['strict-transport-security'] = [{key: 'Strict-Transport-Security', value: 'max-age= 63072000; includeSubdomains; preload'}]; 
headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: "default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'"}]; 
 
 
// Reduce XSS risks
add(headers, "X-Content-Type-Options", "nosniff");
add(headers, "X-XSS-Protection", "1; mode=block");
add(headers, "X-Frame-Options", "DENY");

add(headers, "Referrer-Policy", "same-origin");

// Custom Headers
add(headers, "Custom-Lambda-Headers", "Mystique-Added");

//Return modified response
console.log("ResponsePostProcessing: %j", response);
console.log("RequestPostProcessing: %j", request);

//Return modified response
callback(null, response);

};