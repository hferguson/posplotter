const axios = require('axios');
require('dotenv').config();
const params = {
  access_key: process.env.GEOAPIKEY,
  query: '343 Somerset Ave. E, Ottawa, ON, CAN',
  fields: 'results.latitude,results.longitude,results.label,results.map_url'
}

axios.get('http://api.positionstack.com/v1/forward', {params})
  .then(response => {
    console.log(response.data);
  }).catch(error => {
    console.log(error);
  });
