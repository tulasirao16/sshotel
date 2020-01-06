/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Jan 2018
 */

'use strict';
var PromiseA = require('bluebird').Promise;
var fs = PromiseA.promisifyAll(require('fs'));
var path = require('path');
var ursa = require('ursa');
var mkdirpAsync = PromiseA.promisify(require('mkdirp'));

module.exports = {

    keypair: function(pathname) {
        var key = ursa.generatePrivateKey(1024, 65537);
        var privpem = key.toPrivatePem();
        var pubpem = key.toPublicPem();
        var privkey = path.join(pathname, 'privkey.pem');
        var pubkey = path.join(pathname, 'pubkey.pem');

        return mkdirpAsync(pathname).then(function () {
            return PromiseA.all([
              fs.writeFileAsync(privkey, privpem, 'ascii'),
              fs.writeFileAsync(pubkey, pubpem, 'ascii')
            ]);
        }).then(function () {
            return key;
        });
    }
}
