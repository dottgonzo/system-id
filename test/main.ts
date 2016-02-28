var mocha = require('mocha'),
assert = require('chai').assert;
import SysId=require('../index');
var serialpath='/tmp/tokentest';
var serial=new SysId(serialpath);

describe('configuration', function() {
  describe('check basic existence', function() {

  it('must return something', function() {
    assert.ok(serial,'torna');
  });
});

describe('check if is an object', function() {

  it('must be an object', function() {

  assert.isObject(serial, 'serial file is an object');
  });
});
});
