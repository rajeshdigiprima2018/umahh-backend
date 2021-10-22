/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;



var Schema = mongoose.Schema;

var SuplicationCategorySchema =   new  Schema({
    name            :   {type : String, default : null},
    iconUrl          :   {type : String, default: null},
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},
 

});


SuplicationCategorySchema.virtual('supCategory_id').get(function () {
    return this._id;
});


SuplicationCategorySchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

SuplicationCategorySchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.supCategory_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

SuplicationCategorySchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

SuplicationCategorySchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.supCategory_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    SuplicationCategoryModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const SuplicationCategoryModel = mongoose.model('SuplicationCategory', SuplicationCategorySchema, 'SuplicationCategory');


module.exports = {

    SuplicationCategoryModel

}