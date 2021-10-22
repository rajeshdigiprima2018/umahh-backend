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

var DonationCategorySchema =   new  Schema({
    title          :   {type : String, default : null},
    iconUrl       :   {type : String, default: null},
    status     :   {type : Number, default : 1},
    startDate   :   {type : Date, default   :   Date.now()},
    endDate     :   {type : Date, default   :   Date.now()},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});


DonationCategorySchema.virtual('dona_category_id').get(function () {
    return this.id;
});


DonationCategorySchema.set('toObject', { versionKey : false, virtuals : true, retainKeyOrder : true});

DonationCategorySchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.dona_category_id = ret._id;
    delete ret._id;
    ret.id = ret._id;
    return ret;
}

DonationCategorySchema.set('toJSON', { versionKey : false, retainKeyOrder : true, virtuals : true});

DonationCategorySchema.options.toJSON.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.dona_category_id = ret._id
    delete ret._id;
    ret.id = ret._id;;
    return ret;
}



var _find           =   function(criteria, projection, cb){

    DonationCategoryModel.find(criteria, projection, null, cb);
}


var _details        =   function(orderID, cb){

    _find({_id : countryID},null, cb);
}


const DonationCategoryModel = mongoose.model('DonationCategory', DonationCategorySchema, 'DonationCategory');


module.exports = {

    DonationCategoryModel

}