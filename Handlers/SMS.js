/**
 * Created by rv2016 on 05/06/17.
 */

'use strict';

const plivo = require('plivo');

const appConfig     =   require('../ENV').prefs;


var execute = function(fn){

    console.log('Control is at the start of the Function');

    setTimeout(fn, 1);

    console.log('Control reaches at the end of the Function');
};

var sendErrorReply      =   function(err, message, statusCode, reply){

    return reply({

        success     :   false,
        error       :   err,
        message     :   message
    }).code(statusCode || 404);
}

const k_event_type = {

    ORDER_PLACEMENT    :   0,
    ORDER_CONFIRMATION :   1,
    ORDER_CANCELLATION :   2
}


// -- //'MANJBMMTGWMJC5NTGZMM',
// -- //'MGZiMTFkZmVlYzM3ZGJhYWVhNTk5N2FjMDE2MDdh'

/*

 authId:  'MAZMRJMMJMMWY2ZTBJMT',
 authToken: 'MTUyMjQ0ZjM1NTc3YTBkNWUwYzY2MTgyYTdiMDg5'
*/

 let plivo_gateway   =  plivo.RestAPI({

    authId:  'MANWE1N2E5YJJKNZKWMW',
    authToken: 'MWI1MmY0YzliZjIyYWNjN2FmZGFkZmEwOWY3ODc0'
});


var SMSResponseCallback = function(response){

    console.log("Inside SMSResponseCallback ");

    console.log("SMS Gateway Response : ", response);
}





var sendSMSFor     =   function(locale, event, role ,data, callback){

    var _cb = callback;

    if(callback  == null || callback == undefined){

        _cb = SMSResponseCallback;
    }

    var _content  = "NA";

    if(locale === appConfig._LOCALE.ENGLISH){

        if(event == k_event_type.ORDER_PLACEMENT){

            if(role === appConfig._SCOPES.CONSUMER){

                let content = "Hello "+ data.customer_name +"\n This is to confirm that your order no. "+ data.numID +" has been placed with "+ data.merchant_name + " using YummZ App."
                //return callback(content);

                _content    =   content;
            }
            else if(role === appConfig._SCOPES.ADMIN){

                let content = "Hello "+ data.merchant_name +"\n This is to confirm that you have received a new order with order no. "+ data.numID +" from "+ data.customer_name + " using YummZ App."
                //return callback(content);

                _content    =   content;
            }
        }
        else if(event == k_event_type.ORDER_CONFIRMATION){

            if(role === appConfig._SCOPES.CONSUMER){

                let content= "Hello "+ data.customer_name  +", "+ data.delivery_agent_name +" is going to deliver your order in "+ data.delivery_eta +" Minutes. Thanks for ordering Food with YummZ.";
                //return callback(content);
                _content    =   content;
            }
            else if(role === appConfig._SCOPES.ADMIN){

            }
        }
    }
    else if(locale === appConfig._LOCALE.SPANISH){

        if(event == k_event_type.ORDER_PLACEMENT){

            if(role === appConfig._SCOPES.CONSUMER){

                let content = "Hola "+ data.customer_name +", Esto es para confirmar que su pedido "+ data.numID + " se ha colocado con "+ data.merchant_name +" utilizando la aplicación YummZ";
                //return callback(content);

                _content    =   content;
            }
            else if(role === appConfig._SCOPES.ADMIN){


                let content = "Hola "+ data.merchant_name +"\n, esto es para confirmar que ha recibido una nueva orden con el ID de pedido "+data.numID+" de "+data.customer_name +" utilizando la aplicación YummZ."

                _content    =   content;
            }
        }
        else if(event == k_event_type.ORDER_CONFIRMATION){

            if(role === appConfig._SCOPES.CONSUMER){

                //return callback(content);

                let content  = "Hola "+ data.customer_name +", "+ data.delivery_agent_name +" va a entregar su pedido en "+ data.delivery_eta +" Minutos. Gracias por pedir comida con YummZ";

                _content    =   content;
            }
            else if(role === appConfig._SCOPES.ADMIN){

            }
        }
    }

    let modDestination  = data.destination.replace("+521","+52");

    const smsPayload    =   {

        'src': 'YUMMZ',//'YZ-CHECKIN', // Sender's phone number with country code
        'dst' : modDestination,//data.destination, // Receiver's phone Number with country code
        'text' : _content,
        'url' : "https://yummzapp.com:4010",
        'method' : 'GET'
    }

    console.log("SMS Payload :", smsPayload);

    sendSMS(smsPayload, _cb);
};

var testSMSGateway  =   function(req, reply){

    var asyncFunc = function(){

        let modDestination  = req.params.destination.replace("+521","+52","+91");

        var params  =   {

            'src': 'YUMMZ', // Sender's phone number with country code
            'dst' : modDestination,//req.params.destination, // Receiver's phone Number with country code
            'text' : req.params.locale === 'es' ? "Hola, este es un simple mensaje de prueba de YummZ Food." :  "Hi, This is simple test message from YummZ Food.",// Your SMS Text Message - English
            'url' : "https://yummzapp.com:4001",
            'method' : 'GET'
        }

        console.log("TEST SMS Payload :", params);

        sendSMS(params, function(response){

            reply(response);
        })


    }

    execute(asyncFunc);
}


var sendSMS     =   function(params, callback){

    var asyncFunc = function(){

        if(! plivo_gateway){

            console.error("Plivo Gateway is not initiated. Creating one");
        }
        else{

            plivo_gateway.send_message(params, function(status, response){

                var _success     =   false;

                if(status >= 200 && status < 300){

                    console.log("SMS sent successfully");

                    _success = true;
                }


                callback({

                    success :   _success,
                    status  :   status,
                    data    :   response
                });
            });

        }

    }

    if(appConfig.getEnv() === appConfig._LIVE.toString()){

        execute(asyncFunc);
    }
    else{

        console.error('SMS sending functionality is only allowed in LIVE environment. current environment is ', appConfig.getEnv());
    }

    //execute(asyncFunc);

}

var generatePayload =   function(callback){


    var asyncFunc    =  function() {

        const data = {

            customer_name: null,
            numID:null ,
            merchant_name: null,
            delivery_agent_name: null,
            delivery_eta: null,
            destination_mobile  :   null
        };

        callback(data) ;
    }

    execute(asyncFunc);


}

module.exports.funcs_sms = {

    testSMS     :   testSMSGateway,
    sendSMS     :   sendSMSFor,
    getPayload  :   generatePayload,
    k_sms_events:   k_event_type
}