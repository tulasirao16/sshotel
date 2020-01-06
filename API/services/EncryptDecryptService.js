/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

'use strict';
var fs = require('fs');
var ursa = require('ursa');
var msg;
var sig;
var enc;
var rcv;

// Bob has his private and Alice's public key
var privkeyBob = ursa.createPrivateKey(fs.readFileSync('./assets/bob/privkey.pem'));
var pubkeyAlice = ursa.createPublicKey(fs.readFileSync('./assets/alice/pubkey.pem'));

// Alice has her private and Bob's public key
var privkeyAlice = ursa.createPrivateKey(fs.readFileSync('./assets/alice/privkey.pem'));
var pubkeyBob = ursa.createPublicKey(fs.readFileSync('./assets/bob/pubkey.pem'));

msg = "IT’S A SECRET TO EVERYBODY.";

console.log('Encrypt with Alice Public; Sign with Bob Private');
enc = pubkeyAlice.encrypt(msg, 'utf8', 'base64');
sig = privkeyBob.hashAndSign('sha256', msg, 'utf8', 'base64');
console.log('encrypted', enc, '\n');
console.log('signed', sig, '\n');

var x = 'auGqAiw4WQkadyEJspnsTLZB9F/IFl05gd+x0yxwVWm8C6OBkRW3/s7Hn224PL8F5z2s+ytyqXK2ESj/rcZ//YVvl3UBsydYn/G5IXgw5LhwJsa4BOF6HY7NsUahMjvhL4Xb+xzGOOm/kMyjxnNGcrMxWJgB/ICYJmSGSKzDMwk=';

console.log('Decrypt with Alice Private; Verify with Bob Public');
rcv = privkeyAlice.decrypt('uIIi3f/tmEmjEwl+QN56EsaMI1ObYdCUG2+CCctM0vZ0B4YmJD7+pZfHvjmI8nrLWF7QJLh97QQVnRuGK1cj75tiQCM5uLN5ZVXMj/KO6u+NKZL1ljqABHnNCQmxQ7n2NWCkyYu0Wspi6otybJrc131lLg5shi6CufK916+bgoM=', 'base64', 'utf8');
console.log('rcv:', rcv, '\n');
// if (msg !== rcv) {
//   throw new Error("invalid decrypt");
// }
// rcv = new Buffer(rcv).toString('base64');
// console.log('rcv:', pubkeyBob.hashAndVerify('sha256', rcv, x, 'base64'), '\n');
// if (!pubkeyBob.hashAndVerify('sha256', rcv, sig, 'base64')) {
//   throw new Error("invalid signature");
// }
// console.log('decrypted: ', msg, '\n');
