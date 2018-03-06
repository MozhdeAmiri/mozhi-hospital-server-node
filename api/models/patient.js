const mongoose = require('mongoose');
const moment = require('moment'); // For date handling.

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  gender: { type: Array },
  diagnosis: { type: String },
  treatment: { type: String },
});

// Virtual for patient "full" name.
PatientSchema
  .virtual('name')
  .get(function () {
    return `${this.family_name}, ${this.first_name}`;
  });

// Virtual for this patient instance URL.
PatientSchema
  .virtual('url')
  .get(function () {
    return `/patients/${this._id}`;
  });

PatientSchema
  .virtual('date_of_birth_yyyy_mm_dd')
  .get(function () {
    if (undefined !== this.date_of_birth) {
      return moment(this.date_of_birth).format('YYYY-MM-DD');
    } 
    return null;
    
  });

// Export model.
module.exports = mongoose.model('Patient', PatientSchema);
