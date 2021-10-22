/**
 * Created by rv2016 on 28/10/16.
 */


'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');

var SuggestionsSchema = new mongoose.Schema({ 
    user_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    mosque_id      :   {type : mongoose.Schema.Types.ObjectId, ref: 'User', required : true, default : null},
    text_suggestion :   {type : String, default   :  null},
    status :  {type : String, default   :  "NS"},
    createdAt   :   {type : Date, default   :   Date.now()},
    deletedAt   :   {type : Date, default   :   null},
    updatedAt   :   {type : Date, default   :   Date.now()}
});



//const menuItemModel = mongoose.model('MenuItem', menuitemschema, 'MenuItem');

//const menuItemModel = mongoose.model('MenuItem', categoryschema, 'MenuItem');

const SuggestionsModel = mongoose.model('Suggestions', SuggestionsSchema, 'Suggestions');

module.exports = {
    SuggestionsModel
}