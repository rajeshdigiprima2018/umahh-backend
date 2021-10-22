/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;



var Schema = mongoose.Schema;

var CategorySchema =   new  Schema({
    name            :   {type : String, default : null},
    iconUrl          :   {type : String, default: null},
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},
 

});


CategorySchema.virtual('category_id').get(function () {
    return this._id;
});


CategorySchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

CategorySchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.category_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

CategorySchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

CategorySchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.category_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    CategoryModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const CategoryModel = mongoose.model('Category', CategorySchema, 'Category');


module.exports = {

    CategoryModel

}