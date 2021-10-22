/**
 * Created by rv2016 on 19/01/17.
 */

'use strict'

const mongoose = require('mongoose');
mongoose.promise = require('bluebird');

const appConfig = require('../ENV').prefs;

const arrFoodChoices = ["Sake maki", "Kani maki", "Dragon maki", "Edamame (frijol de soya)",
    "Baby Squid", "Tacos de lechuga", "Tempura Udón", "Misoshiro", "Sumashi", "Verduras",
    "Camarón", "Yakitori de res", "Yakitori de camarón", "Yakitori de pollo", "Charola 3",
    "Charola 2", "Charola 1", "Camarón y cangrejo", "Camarón", "Tampico", "Mixto"];

var Schema = mongoose.Schema;


var foodChoiceItemSchema =   new  Schema({

    name        :   {type : String, default  : null},
    deleted      :   {type : Boolean, default  : false}

});


var foodChoicesDataSchema =   new  Schema({

    choices : {type : [foodChoiceItemSchema], default  : null},
    lastUpdated :   {type : Date, default : Date.now},
    version :   {type : Number, default : 0.00}
});


foodChoiceItemSchema.set('toObject', { versionKey : false, retainKeyOrder : true});

foodChoiceItemSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.item_id = ret._id
    delete ret._id;
    return ret;
}



foodChoicesDataSchema.set('toObject', { versionKey : false, retainKeyOrder : true});

foodChoicesDataSchema.options.toObject.transform = function (doc, ret, options) {

    delete ret.__v;
    ret.data_id = ret._id
    delete ret._id;

    return ret;
}


const foodChoicesModel = mongoose.model('FoodChoices', foodChoicesDataSchema, 'FoodChoices');


module.exports = {

    foodChoicesModel

}