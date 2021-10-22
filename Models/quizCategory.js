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

var QuizCategorySchema =   new  Schema({
    title          :   {type : String, default : null},
    status     :   {type : Number, default : 1},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


QuizCategorySchema.virtual('quiz_category_id').get(function () {
    return this.id;
});


QuizCategorySchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

QuizCategorySchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.quiz_category_id = ret._id;
    delete ret._id;
    ret.id = ret._id;
    return ret;
}

QuizCategorySchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

QuizCategorySchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.quiz_category_id = ret._id
    delete ret._id;
    ret.id = ret._id;;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    QuizCategoryModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const QuizCategoryModel = mongoose.model('QuizCategory', QuizCategorySchema, 'QuizCategory');


module.exports = {

    QuizCategoryModel

}