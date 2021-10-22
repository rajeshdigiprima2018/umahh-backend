/**
 * Created by rv2016 on 14/11/16.
 */

"use strict";



const merchantHandler = require('./Merchant/merchant');
//const user = require('./User');
const generic = require('./yummzHandlers.js'); // generic Utilities as Handler functions


// generic functions to be used by All Handlers

module.exports = {

    encryptPassword     :   function(){

    },

    decryptPassword     :   function(){

    }

}

exports = {
    merchant    : merchantHandler.funcs_m,
    //   user        : user,
    generic     : generic
}





//module.exports = {merchantHandler, user,modelsMerch} ;


