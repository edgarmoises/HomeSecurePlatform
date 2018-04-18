var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitSchema = new Schema({
    calle: {
        type: String,
        required: true
    },
    colonia: {
        type: String, 
        required: true
    },
    nombreVisitante: {
        type: String,
        required: true
    },
    nombreResidente: {
        type: String,
        required: true
    },
    idResidente: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pendiente'
    }
});

module.exports = mongoose.model('Visit', VisitSchema);