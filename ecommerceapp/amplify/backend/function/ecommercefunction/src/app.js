/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	AUTH_ECOMMERCEAPP137D6BDE_USERPOOLID
	ENV
	REGION
	STORAGE_PRODUCTTABLE_ARN
	STORAGE_PRODUCTTABLE_NAME
	STORAGE_PRODUCTTABLE_STREAMARN
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const AWS = require('aws-sdk')
const { v4: uuid } = require('uuid')


/* Cognito SDK */
const cognito = new
AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
})

/* Cognito User Pool ID
* This User Pool ID Variable will be givent oy ou by the CLI output
  adding the category
  ( this will also be available in the file itself, commented out at t
*/
var userpoolId = process.env.AUTH_ECOMMERCEAPP137D6BDE_USERPOOLID;

// DynoamoDB configuration
const region = process.env.region
const ddb_table_name = process.env.STORAGE_PRODUCTTABLE_NAME
const docClient = new AWS.DynamoDB.DocumentClient({region})



// amplify/backend/function/ecommercefunction/src/app.js
async function getGroupsForUser(event) {
  let userSub =
    event
      .requestContext
      .identity
      .cognitoAuthenticationProvider
      .split(':CognitoSignIn:')[1]

  // console.log("GROUPS FOR USER, user sub", userSub)

  let userParams = {
    UserPoolId: userpoolId,
    Filter: `sub = "${userSub}"`,
  }
  // console.log("GROUPS FOR USER 2, ", userParams)


  let userData = await cognito.listUsers(userParams).promise()
  // console.log("GROUPS FOR USER USER DATA 3, ", userData)

  const user = userData.Users[0]
  // console.log("GROUPS FOR USER 4, ", user)

  let groupParams = {
    UserPoolId: userpoolId,
    Username: user.Username
  }
  // console.log("GROUPS FOR USER, 5", groupParams)
  
  const groupData = await cognito.adminListGroupsForUser(groupParams).promise()
  // console.log("GROUPS FOR USER, 6", groupData)

  return groupData
}


async function canPerformAction(event, group) {
  // console.log("START 1: ")
  return new Promise(async (resolve, reject) => {
    if (!event.requestContext.identity.cognitoAuthenticationProvider) {
      // console.log("GETS HERE: sub3-1")
      return reject()
    }


    const groupData = await getGroupsForUser(event)
    // console.log("GETS HERE sub3:2", groupData)

    const groupsForUser = groupData.Groups.map(group => group.GroupName)
    // console.log("GETS HERE, sub3:3 ", groupsForUser)

    if (groupsForUser.includes(group)) {
      // console.log("GETS HERE, sub3:4 ")
      resolve()
    } else {
      // console.log("GETS HERE  ERROR REJECT")
      reject('user not in group, cannot perform action.')

    }
  })
}




// declare a new express app (Where the actual app begins vvv)
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/products', async function(req, res) {
  try {
    const data = await getItems()
    res.json({ data: data})
  } catch (err) {
    res.json({ error: err})
  }
});

async function getItems() {
  var params = { TableName: ddb_table_name }
  try {
    const data = await docClient.scan(params).promise()
    return data
  } catch (err) {
    return err
  }
}


app.get('/products/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/products', async function(req, res) {
  const { body } = req
  console.log("KENDRA LOOK HERE (req)")
  console.log(req)
  // console.log("GETS HERE 1: ", body)

  const { event } = req.apiGateway
  // console.log("GETS HERE 2: ", event)

  try {
    await canPerformAction(event, 'Admin')
    // console.log("GETS HERE 3: ")

    const input = { ...body, upvotes: 0, id: uuid() }
    console.log("KENDRA LOOK HERE (input)")
    console.log(input)
    // console.log("GETS HERE 4: ", input)
    
    var params = {
      TableName: ddb_table_name,
      Item: input
    }
    // console.log("GETS HERE 5: ", params)


    await  docClient.put(params).promise()
    // console.log("GETS HERE 6:")

    res.json({ success: 'item saved to database.' })
    // console.log("GETS HERE 7: ")

  } catch (err) {
    res.json({ error: err })
    // console.log("GETS HERE ERROR CATCH")
  }

});


app.post('/products/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
  // console.log("GETS HERE POST /products/*")
});

/****************************
* Example put method *
****************************/

app.put('/products', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/products/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/products/:id', async function(req, res) {
  
  const { event } = req.apiGateway
  try {
    await canPerformAction(event, 'Admin')
    var params = { 
      TableName : ddb_table_name,
      Key: { id: req.params.id }
    }

    await docClient.delete(params).promise()
    res.json({ success: 'successfully deleted item' })

  } catch (err) {
    res.json({ error: err })
  }

});

app.delete('/products/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
