/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;



var Schema = mongoose.Schema;

var PersonnageUsersSchema =   new  Schema({
    title           :   {type : String, default : null},
    image           :   {type : String, default : null},
    textarea        :   {type : String, default : null},
    personnage_id  :   {type : mongoose.Schema.Types.ObjectId, ref: 'Personnage', required : true, default : null},
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},
 

});


PersonnageUsersSchema.virtual('personnageUser_id').get(function () {
    return this._id;
});


PersonnageUsersSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

PersonnageUsersSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.personnageUser_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

PersonnageUsersSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

PersonnageUsersSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.personnageUser_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    PersonnageModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const PersonnageUsersModel = mongoose.model('PersonnageUsers', PersonnageUsersSchema, 'PersonnageUsers');


module.exports = {

    PersonnageUsersModel

}