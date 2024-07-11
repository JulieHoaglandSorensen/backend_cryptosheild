const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;
const axios = require('axios').default;

// middleware to set headers to allow CORS
// const setHeaders = (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
//   next();
// };


// middleware to set headers on any request to TI API
const setAPIKey = (req, res, next) => {
  res.setHeader('apiKey', 'API_KEY_GOES_HERE');
  next();
};

// middleware to retrieve coin list from TI API
const coinListMiddleware = async (req, res, next) => {
  const options = {
    method: 'GET',
    url: 'https://api.tokeninsight.com/api/v1/coins/list',
    headers: {accept: 'application/json'}
  };

  try {
    const response = await axios.get(options.url);
    console.log('getCoin response: ', response);
    res.locals = response;
  } catch (error) {
    console.error(error);
  }
    
  next();
};

app.get('/coins', setAPIKey, coinListMiddleware, (req, res) => {
  return res.status(200).json(`SOME RESPONSE FROM EXTERNAL API`);
});

// insert middleware into the above that fires a GET request to the Tokeninsight API and returns a JSON response to the client
// start small in terms of how much data to retrieve from TI API.  start with retrieving a basic spread of data for their most popular coin (Bitcoin?)
// set query params: offset = 0, limit = 1


// Unknown route handler
app.use((req, res) => res.sendStatus(404));

// Global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log('errorObj.log: ', errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

  