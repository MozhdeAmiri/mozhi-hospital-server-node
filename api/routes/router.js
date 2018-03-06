const surgeryController = require('../controllers/surgeryController');
const patientController = require('../controllers/patientController');
const doctorController = require('../controllers/doctorController');

module.exports = (app) => {

  // Routes

  // / SURGERY ROUTES ///
  app.route('/')
    .get(surgeryController.index);

  app.route('/surgeries/create')
    // .get(surgeryController.surgery_create_get)
    .post(surgeryController.surgery_create_post);

  app.route('/surgeries/:id/delete')
    .get(surgeryController.surgery_delete_get)
    .delete(surgeryController.surgery_delete_post);

  app.route('/surgeries/:id/update')
    .get(surgeryController.surgery_update_get)
    .put(surgeryController.surgery_update_post)
    .post(surgeryController.surgery_update_post);

  app.route('/surgeries/:id')
    .get(surgeryController.surgery_detail);

  app.route('/surgeries/')
    .get(surgeryController.surgery_list)
    .post(surgeryController.surgery_list_post);

  // / PATINT ROUTES ///
  app.route('/patients/create')
    .get(patientController.patient_create_get)
    .post(patientController.patient_create_post);

  app.route('/patients/:id/delete')
    .get(patientController.patient_delete_get)
    .delete(patientController.patient_delete_post);

  app.route('/patients/:id/update')
    .get(patientController.patient_update_get)
    .put(patientController.patient_update_post)
    .post(patientController.patient_update_post);

  app.route('/patients/:id')
    .get(patientController.patient_detail);

  app.route('/patients')
    .get(patientController.patient_list);


  // / DOCTOR ROUTES ///
  app.route('/doctors/create')
    .get(doctorController.doctor_create_get)
    .post(doctorController.doctor_create_post);

  app.route('/doctors/:id/delete')
    .get(doctorController.doctor_delete_get)
    .delete(doctorController.doctor_delete_post);

  app.route('/doctors/:id/update')
    .get(doctorController.doctor_update_get)
    .put(doctorController.doctor_update_post)
    .post(doctorController.doctor_update_post);

  app.route('/doctors/:id')
    .get(doctorController.doctor_detail);

  app.route('/doctors/')
    .get(doctorController.doctor_list);

};
