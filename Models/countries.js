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

var CountriesSchema =   new  Schema({
    id          :   {type : Number, default : null},
    sortname    :   {type : String, default : null},
    name        :   {type : String, default : null},
    phoneCode   :   {type : Number, default : null}
});


CountriesSchema.virtual('country_id').get(function () {
    return this._id;
});


CountriesSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

CountriesSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.country_id = ret._id;
    delete ret._id;
   // delete ret.id;
    return ret;
}

CountriesSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

CountriesSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.country_id = ret._id
   // delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    CountriesModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const CountriesModel = mongoose.model('Countries', CountriesSchema, 'Countries');


module.exports = {

    CountriesModel

}