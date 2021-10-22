/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;



var Schema = mongoose.Schema;

var PersonnageSchema =   new  Schema({
    name           :   {type : String, default : null},
    // iconUrl        :   {type : String, default: null},
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},
 

});


PersonnageSchema.virtual('personnage_id').get(function () {
    return this._id;
});


PersonnageSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

PersonnageSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.personnage_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

PersonnageSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

PersonnageSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.personnage_id = ret._id
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



const PersonnageModel = mongoose.model('Personnage', PersonnageSchema, 'Personnage');


module.exports = {

    PersonnageModel

}