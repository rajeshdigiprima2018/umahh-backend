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

var groundSchoolSchema = new Schema({ 
    _id        :   String,
    name :   String,
    status       :   String
});
var flightTimeSchema = new Schema({ 
    _id        :   String,
    name :   String,
    time       :   String,
    time_update :  {type : String, default   :   0.00}, 
});

var checklistSchema = new Schema({ 
    _id        :   String,
    name :   String,
    status       :   String
});

var TrainingSchema =   new  Schema({
    user_id            :   {type : String, default : null},
    username            :   {type : String, default : null},
    avtar :   {type : String, default: null},
    teacher   : {type : [], default : []},
    catagories_id  :   {type : String, default : null},
    sub_catagories_id  :   {type : String, default : null},
    groundSchool :   [groundSchoolSchema],
    flightTime :   [flightTimeSchema],
    checklist :   [checklistSchema], 
    todoData   : {type : [],default : []},
    logData   : {type : [],default : []},
    total_spent_money  :   {type : Number, default     :   0.00},

});


TrainingSchema.virtual('training_id').get(function () {
    return this._id;
});


TrainingSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

TrainingSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.training_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

TrainingSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

TrainingSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.training_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    InviteModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}


const TrainingModel = mongoose.model('Training', TrainingSchema, 'Training');


module.exports = {

    TrainingModel

}