/**
 * This file is our API route definition.  It defines all the GET and POST (and possibly PUT and DELETE)
 * that our REST API will accept
 */
const axios = require('axios');
const express = require('express');
const router = express.Router();
const BylawReports = require('../models/reports');
require('dotenv').config();

const queryLatLon = (data) => {
    console.log("Querying Geo API...");
    console.log(data._id.toString());
    console.log(`Sending to ${process.env.GEOURL}`);
    const id = data._id.toString();
    let query_string = `${data.address_string} ${data.city}, ${data.province},  ${data.country}`;
    const params = {
                    access_key: process.env.GEOAPIKEY,
                    query: query_string
    };
    console.log(`Using payload data ${params.query}`);
    axios.get(process.env.GEOURL, {params})
        .then((response) => {
            
            const data = response.data.data;      
            console.log(data);   
            console.log('adding entry to db');  
            processGeoData(id, data);
          })
          .then(console.log("data inserted"))
          .catch(error => {
            console.log(error);
          });
}

const processGeoData = (id, entries) => {
    
    if (entries.length == 0)
        return;
    if (entries.length > 1) {
        // sort by confidence - highest confidence first
        entries.sort((a,b) => b.confidence-a.confidence);
    }
    const posEntry = entries[0];
    //console.log(posEntry);
    console.log(`updating entry ${id}. New coordinates ${posEntry.latitude}, ${posEntry.longitude}`);
    BylawReports.updateOne({_id: id}, 
                           {$set:{'lat' : posEntry.latitude, 'lon' : posEntry.longitude}},
                           {upsert:true})
                .then("Data inserted")
                .catch(error => console.log(error));
}

router.get('/reports', (req, res, next) => {
    BylawReports.find({})
    .then((data) => res.json(data) )        // send data back as a JSON array
    .catch(next);           // todo, figure out what next is
});


router.get('/reports/:id/finddups', (req, res, next) => {
    const id= req.params.id;
    const rpt = req.body;
    const srch_date = rpt.incident_date;
    const 
});

router.post('/reports', (req, res, next) => {
    // request body should contain a JSON object with
    // incident date, incident details, and an address
    if (req.body.incident_date && req.body.incident_details && req.body.address_string) {
        BylawReports.create(req.body)
            .then((data) => queryLatLon(data))
            .then((data) => res.json(data))
            .catch(next);
    } else {
        let err_msg = 'Incomplete data ';
        if (!req.body.incident_date)
            err_msg = "Missing incident date";
        else if (!req.body.incident_details)
            err_msg = "Missing incident details";
        else if (!req.body.address_string)
            err_msg = "Missing address";
        else
            err_msg = "Unknown error";
            res.json({error: err_msg});
    }
});


// delete and update coming later.  We will need an update route
// for when we get our co-ordinates back
router.delete('/reports/:id', (req, res, next) => {
    BylawReports.findOneAndDelete({ _id: req.params.id })
    .then((data) => {
            console.log(`deleted item with IF ${req.params.id}`);
            return res.json(data);
    })
    .catch(error => {error: error});
});
module.exports = router;