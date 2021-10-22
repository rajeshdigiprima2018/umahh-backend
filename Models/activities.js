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

var ActivitiesSchema =   new  Schema({
    mosque_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    likeactivity_id :   {type : mongoose.Schema.Types.ObjectId, ref: 'LikeActivity', default : null},
    startDate   :   {type : Date, default   :   null},
    startTime   :   {type : String, default   :   null},
    title     :   {type : String, default : null},
    phone     :   {type : Number, default : null},
    textarea    :   {type : String, default : null},
    avtar          :   {type : String, default: null},
    pictures    : [{
        url: {type : String, default : null}

    }], 
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


ActivitiesSchema.virtual('activity_id').get(function () {
    return this._id;
});


ActivitiesSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

ActivitiesSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.activity_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

ActivitiesSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

ActivitiesSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.activity_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    ActivitiesModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const ActivitiesModel = mongoose.model('Activities', ActivitiesSchema, 'Activities');


module.exports = {

    ActivitiesModel

}