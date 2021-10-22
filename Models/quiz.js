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

var QuizSchema =   new  Schema({
    quiz_category_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'QuizCategory', required : true, default : null},
    question     :   {type : String, default : null},
    option1     :   {type : String, default : null}, 
    option2     :   {type : String, default : null},
    option3     :   {type : String, default : null},
    option4     :   {type : String, default : null},
    answer     :   {type : String, default : null},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


QuizSchema.virtual('quiz_id').get(function () {
    return this._id;
});


QuizSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

QuizSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.quiz_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

QuizSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

QuizSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.quiz_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    QuizModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const QuizModel = mongoose.model('Quiz', QuizSchema, 'Quiz');


module.exports = {

    QuizModel

}