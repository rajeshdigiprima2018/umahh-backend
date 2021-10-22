export const appConfig = {
    storage: {
        'USER': 'role',
        'USERNAME': 'username',
        'PROFILE_PIC': 'profilepic',
        'TOKEN': 'token',
        'ID': 'id',
        //'USERFNAME': 'userfname',
        'ISUPDATED': 'isUpdated',
        'All': 'all'
    },
    pattern: { 
        
        'NAME': /^[ A-Za-z0-9_@./#&+-/'/"]*$/,
        "CITY": /^[a-zA-Z . \-\']*$/,
        "EMAIL": /^(([^<>()\[\]\\.,,:\s@"]+(\.[^<>()\[\]\\.,,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "POSTAL_CODE": /(^\d{6}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/,
        "PHONE_NO": /[+]\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/,
        "MOB_NO": /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/,
        "PASSWORD": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/,
        "DESCRIPTION": /^[ !@#$%^&*()~:;{}?'"=<>A-Za-z0-9_@./#&+-,-]*$/,
        "TASK_CODE": /^[0-9999]{1,4}$/,
        "SUB_DOMAIN": /^[/a-z/A-Z][a-zA-Z0-9-]*[^/-/./0-9]$/,
        "PHONE_NO_MASK": ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        "IVR_ACTION_KEY": /^[0-9]*$/,
        "IVR_NUMBER": /^[0-9]*$/,
        "RADIUS": /^[0-9]*(?:.)([0-9])+$/,
        "LATLONG": /^\s*(\-?\d+(\.\d+)?)$/,
        "SSN": /^((\d{3}-?\d{2}-?\d{4})|(X{3}-?X{2}-?X{4}))$/,
        "SSN_MASK": [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        "PRACTICE_PASSWORD": /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
        "USERNAME": /^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}[a-zA-Z0-9]$/,
        "USERNAME_MIN_SIZ": /^[a-zA-Z0-9_](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9_]){4,18}[a-zA-Z0-9_]$/,
        "WICARE_USERNAME": /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{1,}/,
        "YEAR_MASK": /d{4}/,
        "DECIMAL": /\d+(\.\d{1,2})?/,
        "MAXLENGTH": 50,
        "MINLENGTH": 2,
        "CLINICNAMELENGTH" : 120,
        "LAT" : 16,
        "LONG" : 15,
    },
    userType: {
        'USER': "user",
        'STAFF': "mosque",
        'CLINIC': "business",
        'ADMIN': "admin",
    },
    admin: {
        "ID": "5bf2a8a328b76a524bfb0048",

    },
    err: {
        "someThing": "something went wrong"
    },
    paginator: {
        "COUNT": 10,
        "PAGE": 1
    },
     homePageContentsPaginator: {
        "COUNT": 25,
        "PAGE": 1
    },
    contentsPaginator: {
        "COUNT": 24,
        "PAGE": 1
    },
    popUpPaginator: {
        "COUNT": 6,
        "PAGE": 1
    },
    youtube: {
        "EMBED": "https://www.youtube.com/embed/"
    }, limitForTitle: {
        "TO": 20,
    }
    , limitForDescription: {
        "TO": 80,
    }, limitForContentDescription: {
        "TO": 30,
    }, limitForHomeContentDescription: {
        "TO": 18,
    }, limitForHealthTopicDescription: {
        "TO": 10,
    }, limitForContentTitle: {
        "TO": 10,
    }, limitForHomeContentTitle: {
        "TO": 60,
    }, limitForHealthContentTitle: {
        "TO": 45,
    }, limitForDashboardContentTitle: {
        "TO": 25,
    }, limitForNotes: {
        "TO": 30,
    }, limitForViewSurveyResultNotes: {
        "TO": 60,
    }, password: {
        "minLength": 6,
        "maxLength": 30
    },
    url: {
        "survey": "/layout/surveyStart"
    }
    // firebase: {
    //     apiKey: 'AIzaSyBI0uzYtYZKGFoOgXNvWuhu0ngZ-3o7XPg',
    //     projectId: 'mdout-1540979969897',
    //     messagingSenderId: '77385544799'
    // }
};


