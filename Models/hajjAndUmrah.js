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

var HajjUmrahSchema =   new  Schema({
    hajjumrahCategory_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'HajjUmrahCategory', required : true, default : null},
    title     :   {type : String, default : null},
    description     :   {type : String, default : null},
    title_aro     :   {type : String, default : null},
    description_aro :   {type : String, default : null},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


HajjUmrahSchema.virtual('hajjumrah_id').get(function () {
    return this._id;
});


HajjUmrahSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

HajjUmrahSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.hajjumrah_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

HajjUmrahSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

HajjUmrahSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.hajjumrah_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    HajjUmrahModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const HajjUmrahModel = mongoose.model('HajjUmrah', HajjUmrahSchema, 'HajjUmrah');


module.exports = {

    HajjUmrahModel

}