/**
 * Created by rv2016 on 22/02/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');
mongoose.plugin(schema => { schema.options.usePushEach = true });

const appConfig = require('../ENV').prefs;



var Schema = mongoose.Schema;

var HajjUmrahCategorySchema =   new  Schema({
    name            :   {type : String, default : null},
    imageUrl          :   {type : String, default: null},
    createdAt      :   {type : Date, default   :   Date.now()},
    deletedAt      :   {type : Date, default   :   null},
    updatedAt      :   {type : Date, default   :   Date.now()},
 

});


HajjUmrahCategorySchema.virtual('hajjumrahCategory_id').get(function () {
    return this._id;
});


HajjUmrahCategorySchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

HajjUmrahCategorySchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.hajjumrahCategory_id = ret._id;
    delete ret._id;
    delete ret.id;
    return ret;
}

HajjUmrahCategorySchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

HajjUmrahCategorySchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.hajjumrahCategory_id = ret._id
    delete ret._id;
    delete ret.id;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    HajjUmrahCategoryModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : orderID},null, cb);
}



const HajjUmrahCategoryModel = mongoose.model('HajjUmrahCategory', HajjUmrahCategorySchema, 'HajjUmrahCategory');


module.exports = {

    HajjUmrahCategoryModel

}