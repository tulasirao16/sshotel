
var config = require('config');

module.exports = {

    googleAuth: {
        clientID: '642284916472-hp9avsmnpqj7r2l6fnfej9dts09tqqrt.apps.googleusercontent.com',
        clientSecret: '3FT2eug4AH4z5Sl2MxBNApQn',
        callbackURL: config.apiDomain + 'api/v1/eu/user/social/auth/google/callback',
        passReqToCallback: true
    },

    facebookAuth: {
        clientID: '412790119340799',
        clientSecret: '87d4e75f2f1abbd83e53381f2003513a',
        callbackURL: config.apiDomain + 'api/v1/eu/user/social/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'picture.type(large)', 'email', 'birthday', 'first_name', 'middle_name', 'last_name', 'gender', 'link'],
        passReqToCallback: true
    },

    twitterAuth: {
        consumerKey: '', // 'xeAHXeS12LvWbsIoMjJYOEvCC',
        consumerSecret: '', // 'VWBEDGIQZ9x5bDSTuD50YI4iwyvj04YUXt2v0kMd8QP5UfNuSN',
        callbackURL: '', // config.apiDomain + '/auth/twitter/callback'
    },

    linkedinAuth: {
        consumerKey: '', // '81rbhe02dtciav',
        consumerSecret: '', // '7YEwLzShsk0tBpgU',
        callbackURL: '', // config.apiDomain + '/auth/linkedin/callback',
        profileFields: '', // ['id', 'first-name', 'last-name', 'email-address', 'picture-urls::(original)', 'picture-url']
    }

};
