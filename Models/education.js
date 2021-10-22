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

var EducationSchema =   new  Schema({
    mosque_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    title     :   {type : String, default   :   null},
    startDate   :   {type : Date, default   :   null},
    endDate     :   {type : Date, default   :   null},
    startTime   :   {type : String, default   :   null},
    endTime     :   {type : String, default   :   null},
    course_objective     :   {type : String, default : null},
    methodology     :   {type : String, default : null},
    duration     :   {type : String, default : null},
    registration_fee     :   {type : String, default : null},
    pre_requisites     :   {type : String, default : null},
    about_instructor     :   {type : String, default : null},
    address     :   {type : String, default : null},
    mobile     :   {type : String, default : null},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


EducationSchema.virtual('education_id').get(function () {
    return this._id;
});


EducationSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

EducationSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.education_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

EducationSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

EducationSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.education_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    EducationModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const EducationModel = mongoose.model('Education', EducationSchema, 'Education');


module.exports = {

    EducationModel

}