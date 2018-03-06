const Doctor = require('../models/doctor');
const Surgery = require('../models/surgery');
const async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Doctors.
exports.doctor_list = (req, res, next) => {
  Doctor.find()
    .exec((err, doctorsList) => {
      if (err) { return res.json(err.message); }
      res.json(doctorsList);// Successful, so render.
    });
};

// Display detail page for a specific Doctor.
exports.doctor_detail = (req, res, next) => {
  async.parallel({
    doctor(callback) {
      Doctor.findById(req.params.id).exec(callback);
    },
    surgery_doctors(callback) {
      Surgery.find({ doctor: req.params.id }).populate('doctor').populate('patient').exec(callback);
    },
  }, (err, results) => {
    if (err) { return res.json(err.message); }
    if (results.doctor == null) { // No results.
    }
    // Successful, so render.
    res.json({ doctor: results.doctor, surgeries: results.surgery_doctors});
 });
};

// Display Doctor create form on GET.
exports.doctor_create_get = (req, res, next) => {
  res.json({ title: 'Create Doctor' });
};

// Handle Doctor create on POST.
exports.doctor_create_post = [

  // Validate fields.
  // body('gender', 'Gender must be specified').isLength({ min: 1 }).trim(),
  // body('date_of_birth', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // // Sanitize fields.
  // sanitizeBody('gender').trim().escape(),
  // sanitizeBody('extraInfo').trim().escape(),
  // sanitizeBody('expertise').trim().escape(),
  // sanitizeBody('date_of_birth').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    // const errors = validationResult(req);
    console.log('before Save in server')

    // Create a Doctor object with escaped and trimmed data.
    const doctor = new Doctor({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      gender: req.body.gender,
      extraInfo: req.body.extraInfo,
      expertise: req.body.expertise,
      date_of_birth: req.body.date_of_birth,
    });
    console.log('before Save => doctor', doctor)

    // if (!errors.isEmpty()) {
    //   // There are errors. Render form again with sanitized values and error messages.
    //   console.log('savedDoctor ERROR', errors)
    //   res.json(errors);
    //   // res.json({ title: 'Create Doctor', doctor, errors: errors.array() });
    //   // res.render('doctor_form', { title: 'Create Doctor', doctor, errors: errors.array() });
    //   return;
    // }

    // Data from form is valid
    doctor.save((err, savedDoctor) => {
      if (err) { 
        console.log('ERROR in savedDoctor')
        res.send(err); 
      }
      console.log('savedDoctor', savedDoctor)
      res.json(savedDoctor);
    });
  },
];


// Display Doctor delete form on GET.
exports.doctor_delete_get = (req, res, next) => {
  Doctor.findByIdAndRemove({ _id: req.params.id },
    function (err, doctor) {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
};

// Handle Doctor delete on POST.
exports.doctor_delete_post = (req, res, next) => {
  // Assume the post has valid id (ie no validation/sanitization).
  async.parallel({
    doctor(callback) {
      Doctor.findById(req.params.id).populate('patient').populate('surgery').exec(callback);
    },
    surgery_doctors(callback) {
      Surgery.find({ doctor: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) { return res.json(err.message); }
    // Success
    if (results.surgery_doctors.length > 0) {
      // Doctor has surgeries. Render in same way as for GET route.
      res.json({ title: 'Delete Doctor', doctor: results.doctor, surgeries: results.surgery_doctors });
      // res.render('doctor_delete', { title: 'Delete Doctor', doctor: results.doctor, surgeries: results.surgery_doctors });
      return;
    }

    // Doctor has no Surgery objects. Delete object and redirect to the list of surgeries.
    Doctor.findByIdAndRemove(req.body.id, (errR) => {
      if (errR) { 
        return next(errR); 
      }
      // Success, so redirect to list of Doctor items.
      res.json({ message: 'Doctor successfully deleted' });
    });
  });
};

// Display Doctor update form on GET.
exports.doctor_update_get = (req, res, next) => {
  // Get doctors for form.
  Doctor.findById(req.params.id, (err, doctor) => {
    if (err) { return res.json(err.message); }
    if (doctor == null) { // No results.
      const err = new Error('Doctor not found');
      err.status = 404;
      return res.json(err.message);
    }
    // Success.
    res.json({ title: 'Update Doctor', doctor });
    // res.render('doctor_form', { title: 'Update Doctor', doctor });
  });
};

// Handle Doctor update on POST.
exports.doctor_update_post = [

  // Validate fields.
  // body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
  //   .isAlphanumeric()
  //   .withMessage('First name has non-alphanumeric characters.'),
  // body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
  //   .isAlphanumeric()
  //   .withMessage('Family name has non-alphanumeric characters.'),
  // body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),

  // // Sanitize fields.
  // sanitizeBody('*').trim().escape(),
  // sanitizeBody('date_of_birth').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    // const errors = validationResult(req);

    // Create a Doctor object with escaped/trimmed data and current id.

    var doctor = new Doctor(req.body);
    console.log(doctor);

    doctor._id = req.params.id;
    Doctor.findByIdAndUpdate(req.params.id, doctor, {} ,function(err, newDoctor) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('edited Doctor:' , newDoctor);
            res.json(newDoctor);
        }
    });
    // const doctor = new Doctor({
    //   first_name: req.body.first_name,
    //   family_name: req.body.family_name,
    //   gender: req.body.gender,
    //   extraInfo: req.body.extraInfo,
    //   expertise: req.body.expertise,
    //   date_of_birth: req.body.date_of_birth,
    //   _id: req.params.id,
    // });

    // if (!errors.isEmpty()) {
    //   // There are errors. Render the form again with sanitized values and error messages.
    //   res.json({ title: 'Update Doctor', doctor, errors: errors.array() });
    //   // res.render('doctor_form', { title: 'Update Doctor', doctor, errors: errors.array() });
    // } else {
    //   // Data from form is valid. Update the record.
    //   Doctor.findByIdAndUpdate(req.params.id, doctor, {}, (err, thedoctor) => {
    //     if (err) { return res.json(err.message); }
    //     // Successful - redirect to doctor detail page.
    //     // res.redirect(thedoctor.url);
    //     res.json(thedoctor);
    //   });
    // }
  },
];
