import * as mocha from "mocha";
import * as chai from "chai";
let assert = chai.assert;
let outputFileSync = require('output-file-sync');
import SysId=require('../index');

let serialpath='/tmp/tokentestvalid'+new Date().getTime();
let newserial={auth:'tfpi97fp7i'};
let oldserial:any=new SysId(serialpath,{tracker:true});
oldserial.validate(oldserial.serial,newserial);
newserial=oldserial.read();

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
