const Patient = require('../models/patient');
const async = require('async');
const Surgery = require('../models/surgery');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Patients.
exports.patient_list = (req, res, next) => {
  Patient.find()
  .exec((err, patientsList) => {
    if (err) { return res.json(err.message); }
    res.json(patientsList);// Successful, so render.
  });
};

// Display detail page for a specific Patient.
exports.patient_detail = (req, res, next) => {
  async.parallel({
    patient(callback) {
      Patient.findById(req.params.id).exec(callback);
    },
    patients_surgeries(callback) {
      Surgery.find({ patient: req.params.id }).populate('doctor').populate('patient').exec(callback);
    },
  }, (err, results) => {
    if (err) { return res.json(err.message); } // Error in API usage.
    if (results.patient == null) { // No results.
    }
    // Successful, so render.
    res.json({ patient: results.patient, surgeries: results.patients_surgeries });
  });
};

// Display Patient create form on GET.
exports.patient_create_get = (req, res, next) => {
  res.json({ title: 'Create Patient' });
};

// Handle Patient create on POST.
exports.patient_create_post = [

  // Validate fields.
  // body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
  //   .isAlphanumeric()
  //   .withMessage('First name has non-alphanumeric characters.'),
  // body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
  //   .isAlphanumeric()
  //   .withMessage('Family name has non-alphanumeric characters.'),
  // body('diagnosis').isLength({ min: 1 }).trim().withMessage('Diagnosis must be specified.'),
  // body('treatment'),
  // body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),

  // // Sanitize fields.
  // sanitizeBody('*').trim().escape(),
  // sanitizeBody('date_of_birth').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   // There are errors. Render form again with sanitized values/errors messages.
    //   // res.render('patient_form', { title: 'Create Patient', patient: req.body, errors: errors.array() });
    //   res.json({ title: 'Create Patient', patient: req.body, errors: errors.array() });
    //   return;
    // }
    // Data from form is valid.
    // Create an Patient object with escaped and trimmed data.
    const patient = new Patient({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      diagnosis: req.body.diagnosis,
      treatment: req.body.treatment,
      date_of_birth: req.body.date_of_birth,
      gender: req.body.gender,
    });
    patient.save((err, savedPatient) => {
      if (err) { 
        console.log('ERROR in savedPatient')
        res.send(err); 
      }// Successful - redirect to new patient record.
      res.json(savedPatient);
    });
  },
];


// Display Patient delete form on GET.
exports.patient_delete_get = (req, res, next) => {
  Patient.findByIdAndRemove({ _id: req.params.id },
    function (err, patient) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
};

// Handle Patient delete on POST.
exports.patient_delete_post = (req, res, next) => {
  async.parallel({
    patient(callback) {
      Patient.findById(req.body.patientid).exec(callback);
    },
    patients_surgeries(callback) {
      Surgery.find({ patient: req.body.patientid }).populate('doctor').exec(callback);
    },
  }, (err, results) => {
    if (err) { return res.json(err.message); }
    // Success.
    if (results.patients_surgeries.length > 0) {
      // Patient has surgeries. Render in same way as for GET route.
      // res.render('patient_delete', { title: 'Delete Patient', patient: results.patient, patient_surgeries: results.patients_surgeries });
      res.json({ title: 'Delete Patient', patient: results.patient, patient_surgeries: results.patients_surgeries });
    } else {
      // Patient has no surgeries. Delete object and redirect to the list of patients.
      Patient.findByIdAndRemove(req.body.patientid, (errP) => {
        if (err) { return next(errP); }
        // Success - go to patient list.
        res.json({ message: 'Patient successfully deleted' });
      });
    }
  });
};

// Display Patient update form on GET.
exports.patient_update_get = (req, res, next) => {
  Patient.findById(req.params.id, (err, patient) => {
    if (err) { return res.json(err.message); }
    if (patient == null) { // No results.
      const err = new Error('Patient not found');
      err.status = 404;
      return res.json(err.message);
    }
    // Success.
    // res.render('patient_form', { title: 'Update Patient', patient });
    res.json({ title: 'Update Patient', patient });
  });
};

// Handle Patient update on POST.
exports.patient_update_post = [

  // Validate fields.
  // body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
  //   .isAlphanumeric()
  //   .withMessage('First name has non-alphanumeric characters.'),
  // body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
  //   .isAlphanumeric()
  //   .withMessage('Family name has non-alphanumeric characters.'),
  // body('diagnosis').isLength({ min: 1 }).trim().withMessage('Diagnosis must be specified.'),
  // body('treatment'),
  // body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),

  // // Sanitize fields.
  // sanitizeBody('*').trim().escape(),
  // sanitizeBody('date_of_birth').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    // const errors = validationResult(req);

    // Create Patient object with escaped and trimmed data (and the old id!)
    // const patient = new Patient({
    //   first_name: req.body.first_name,
    //   family_name: req.body.family_name,
    //   diagnosis: req.body.diagnosis,
    //   treatment: req.body.treatment,
    //   date_of_birth: req.body.date_of_birth,
    //   gender: req.body.gender,
    //   _id: req.params.id,
    // });

    // if (!errors.isEmpty()) {
    //   // There are errors. Render the form again with sanitized values and error messages.
    //   // res.render('patient_form', { title: 'Update Patient', patient, errors: errors.array() });
    //   res.json({ title: 'Update Patient', patient, errors: errors.array() });
    // } else {
    //   // Data from form is valid. Update the record.
    //   Patient.findByIdAndUpdate(req.params.id, patient, {}, (err, thepatient) => {
    //     if (err) { return res.json(err.message); }
    //     // Successful - redirect to patient detail page.
    //     // res.redirect(thepatient.url);
    //   });
    // }

    var patient = new Patient(req.body);
    console.log(patient);

    patient._id = req.params.id;
    Patient.findByIdAndUpdate(req.params.id, patient, {} ,function(err, newPatient) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('edited Patient:' , newPatient);
            res.json(newPatient);
        }
    });
  },
];
