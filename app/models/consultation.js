// app/models/consultation.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ConsultationSchema   = new Schema({
    description: String,
    patientID: mongoose.Schema.Types.ObjectId,
    drID: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('consultation', ConsultationSchema);
