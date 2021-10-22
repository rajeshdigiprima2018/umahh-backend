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

var QuizRuleSchema =   new  Schema({
    quiz_category_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'QuizCategory', required : true, default : null},
    title     :   {type : String, default : null},
    rules     :   {type : String, default : null}, 
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


QuizRuleSchema.virtual('quizrule_id').get(function () {
    return this._id;
});


QuizRuleSchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

QuizRuleSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.quizrule_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

QuizRuleSchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

QuizRuleSchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.quizrule_id = ret._id
    delete ret._id;
    //delete ret._id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    QuizRuleModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const QuizRuleModel = mongoose.model('QuizRule', QuizRuleSchema, 'QuizRule');


module.exports = {

    QuizRuleModel

}