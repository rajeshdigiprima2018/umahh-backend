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

var CitiesSchema =   new  Schema({
    id          :   {type : Number, default : null},
    name        :   {type : String, default : null},
    state_id   :   {type : String, default : null}
});


CitiesSchema.virtual('cities_id').get(function () {
    return this._id;
});


CitiesSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

CitiesSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.cities_id = ret._id;
    delete ret._id;
   /// delete ret.id;
    return ret;
}

CitiesSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

CitiesSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.cities_id = ret._id
    delete ret._id;
   // delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    CitiesModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const CitiesModel = mongoose.model('Cities', CitiesSchema, 'Cities');


module.exports = {

    CitiesModel

}