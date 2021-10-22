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

var SupplicationSchema =   new  Schema({
    supCategory_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'SuplicationCategory', required : true, default : null},
    supplicationLike_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'SupplicationLike', default : null},
    title     :   {type : String, default : null},
    description     :   {type : String, default : null},
    title_aro     :   {type : String, default : null},
    description_aro :   {type : String, default : null},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


SupplicationSchema.virtual('supplication_id').get(function () {
    return this._id;
});


SupplicationSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

SupplicationSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.supplication_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

SupplicationSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

SupplicationSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.supplication_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    SupplicationModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const SupplicationModel = mongoose.model('Supplication', SupplicationSchema, 'Supplication');


module.exports = {

    SupplicationModel

}