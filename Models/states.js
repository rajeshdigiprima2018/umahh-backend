/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;

var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var StatesSchema =   new  Schema({
    id          :   {type : Number, default : null},
    name        :   {type : String, default : null},
    country_id  :   {type : String, default : null}
});


StatesSchema.virtual('state_id').get(function () {
    return this._id;
});


StatesSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

StatesSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.state_id = ret._id;
    delete ret._id;
    //delete ret.id;
    return ret;
}

StatesSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

StatesSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.state_id = ret._id
    delete ret._id;
   // delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    StatesModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const StatesModel = mongoose.model('States', StatesSchema, 'States');


module.exports = {

    StatesModel

}