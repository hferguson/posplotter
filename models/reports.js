const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Needed to add this to support float/double in Mongoose.
// Mongoose doesn't natively support doubles, so added this library
// It is deprecated so need to look for an alternative at some point.
require('mongoose-double')(mongoose);

const SchemaTypes = mongoose.Schema.Types;

// Create a new schema to manage noise reports and their co-ordinates
const ReportSchema = new Schema({
    incident_date: {
        type: Date,
        required: [true, 'a date and time are required']
    },
    incident_details: {
        type: String,
        required: [true, 'please give some details on the event']
    },
    address_string: {
        type: String,
        required: [true, 'a valid address is required']
    },
    bylaw_rpt_id : {
        type: String,
        default: 'unknown'
    },
    postal_code: {
        type: String,
    },
    city: {
        type: String,
        default: 'Ottawa'
    },
    province: {
        type: String,
        default: 'ON'
    },
    country: {
        type: String,
        default: 'CA'
    },
    lat: {
        type: SchemaTypes.Double
    },
    lon: {
        type: SchemaTypes.Double
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
          type: [Number],
        }
      }
});

// Create model for reporting
const BylawReports = mongoose.model('reports', ReportSchema);

module.exports = BylawReports;