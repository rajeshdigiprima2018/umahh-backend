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

var KhutbaSchema =   new  Schema({
    mosque_id   :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    startDate   :   {type : Date, default   :   null},
    startTime   :   {type : String, default   :   null},
    title       :   {type : String, default : null},
    speaker_name :   {type : String, default : null},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


KhutbaSchema.virtual('khutba_id').get(function () {
    return this._id;
});


KhutbaSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

KhutbaSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.khutba_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

KhutbaSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

KhutbaSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.khutba_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    KhutbaModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const KhutbaModel = mongoose.model('Khutba', KhutbaSchema, 'Khutba');


module.exports = {

    KhutbaModel

}