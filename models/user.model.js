var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    'name': {type:String, required:false},
    'lastName': {type:String, required:false},
    'username': {type:String, required:false},
    'type': {type:String, required:false}, 
    'email': {type:String, required:false},
    'age': {type:String, required:false},
    'pictureUrl': {type:String, required:false},
    'password': {type:String, required:false},
    'mercadopago_alias': {type:String, required:false},
    'ranking': {type:String, required:false},
    'description': {type:String, required:false},
    'securityLevel': {type:String, required:false},
    'pictures': [
        {
            'id': { type: Number, required: false },
            'url': { type: String, required: false },
        }
    ],
    'merch': [
        {
            'id': { type: Number, required: false },
            'name': { type: String, required: false },
            'price': { type: String, required: false },
            'url': { type: String, required: false },
        }
    ],
    "lastLogin": {type: Date, default: Date.now},
    "createdAt": {type: Date, default: Date.now},
    "updatedAt": {type: Date, default: Date.now},
    "deletedAt": {type: Date, default: null}
});


module.exports = mongoose.model('User', userSchema);
