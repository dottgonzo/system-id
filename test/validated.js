var mocha = require('mocha'),
assert = require('chai').assert,
outputFileSync = require('output-file-sync'),
sysId=require('../index');

var serialpath='/tmp/tokentest/seriaval'+new Date().getTime()+'.json';
var t='kjbklbwefibwfe';
var oldserial=new sysId(serialpath);
oldserial.validate(oldserial.serial,t);
var newserial=oldserial.read();

describe('update', function() {

  describe('check basic existence', function() {

  it('must return something', function() {
    assert.ok(oldserial,'torna il vecchio seriale');
    assert.ok(newserial,'torna il nuovo seriale');

  });
});

describe('check if is an object', function() {

  it('must be an object', function() {

  assert.isObject(oldserial, 'new serial file is an object');
  assert.isObject(newserial, 'new serial file is an object');

  });
});
});
