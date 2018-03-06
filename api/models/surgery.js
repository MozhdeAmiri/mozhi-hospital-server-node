const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const SurgerySchema = new Schema({
  title: { type: String, required: true },
  patient: { type: Schema.ObjectId, ref: 'Patient', required: false },
  date: { type: Date, required: false, default: Date.now },
  doctor: [{ type: Schema.ObjectId, ref: 'Doctor', required: false }],
  summary: { type: String, required: false },
  status: { type: Boolean, default: false },
});

// Virtual for this surgery URL.
SurgerySchema
  .virtual('url')
  .get(function () {
    return `/surgeries/${this._id}`;
  });

SurgerySchema
  .virtual('date_formatted')
  .get(function () {
    return moment(this.date).format('YYYY-MM-DD');
  });

// Export model.
module.exports = mongoose.model('Surgery', SurgerySchema);
