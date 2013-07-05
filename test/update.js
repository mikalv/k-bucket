"use strict";

var KBucket = require('../index.js');

var test = module.exports = {};

test['invalid index results in exception'] = function (test) {
    test.expect(1);
    var kBucket = new KBucket();
    var contact = {id: new Buffer("a")};
    kBucket.add(contact);
    try {
        kBucket.update(contact, 1);
    } catch (exception) {
        test.ok(true);
    }
    test.done();
};

test['deprecated vectorClock results in contact drop'] = function (test) {
    test.expect(1);
    var kBucket = new KBucket();
    var contact = {id: new Buffer("a"), vectorClock: 3};
    kBucket.add(contact);
    kBucket.update({id: new Buffer("a"), vectorClock: 2}, 0);
    test.equal(kBucket.bucket[0].vectorClock, 3);
    test.done();
};

test['equal vectorClock results in contact marked as most recent'] = function (test) {
    test.expect(1);
    var kBucket = new KBucket();
    var contact = {id: new Buffer("a"), vectorClock: 3};
    kBucket.add(contact);
    kBucket.add({id: new Buffer("b")});
    kBucket.update(contact, 0);
    test.equal(kBucket.bucket[1], contact);
    test.done();
};

test['more recent vectorClock results in contact update and contact being' +
     ' marked as most recent'] = function (test) {
    test.expect(2);
    var kBucket = new KBucket();
    var contact = {id: new Buffer("a"), vectorClock: 3};
    kBucket.add(contact);
    kBucket.add({id: new Buffer("b")});
    kBucket.update({id: new Buffer("a"), vectorClock: 4}, 0);
    test.ok(kBucket.bucket[1].id.equals(contact.id));
    test.equal(kBucket.bucket[1].vectorClock, 4);
    test.done();
};