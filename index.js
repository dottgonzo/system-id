var uuid=require('uuid'),
pathExists=require('path-exists'),
fs = require('fs'),
jwt = require('jsonwebtoken'),
outputFileSync = require('output-file-sync');

function initsysid(serialPath,autosigned){
var serial=uuid.v4();
var secret=uuid.v4()+uuid.v4();

  outputFileSync(serialPath+'/.secret', secret, 'utf-8');
  outputFileSync(serialPath+'/serial', serial, 'utf-8');

  return {serial:serial,secret:secret}
}

function readSerial(serialPath){

  return fs.readFileSync(serialPath+'/serial')

}
function readSecrets(serialPath){

  return fs.readFileSync(serialPath+'/.secret')

}
function readTracker(serialPath){

  return fs.readFileSync(serialPath+'/.tracker')

}
function readJson(serialPath){
  var config={}
  config.secret=readSecrets(serialPath);
  config.serial=readSerial(serialPath)
  if(pathExists.sync(serialPath+'/.tracker')){
    config.tracker=readTracker(serialPath)

  }

  return config

}
function SysId(json){


  if(json.path){
    this.serialPath=json.path;

} else{
  this.serialPath='/etc/nodeid';

}
if(json.tracker){
  this.tracker='pending';

} else{
this.tracker=false;

}

  if (!pathExists.sync(this.serialPath+'/serial')){

    var config=initsysid(this.serialPath,this.tracker);
  } else{
    var config=readJson(this.serialPath);
  }

  for(var c=0;c<Object.keys(config).length;c++){
    this[Object.keys(config)[c]]=config[Object.keys(config)[c]];
  }

};
SysId.prototype.read=function(){
  return readJson(this.serialPath)
};
SysId.prototype.decode=function(){
  return jwt.verify(this.tracker, this.secret);
};
SysId.prototype.sign=function(json){
  var token = jwt.sign(json, this.secret);
  return token
};
SysId.prototype.verify=function(token,maxAge){
  try {
    if(maxAge){
      var decoded = jwt.verify(token, this.secret,{maxAge:maxAge});
    } else{
      var decoded = jwt.verify(token, this.secret);
    }
    return decoded
  } catch(err) {
    return err
  }
};

SysId.prototype.validate=function(serial,objectkey){


  if(serial==this.serial&&this.tracker&&this.tracker=='pending'){
var config={
  secret:this.secret
}
    if(objectkey){
      if(objectkey.serial){
        this.serial=objectkey.serial;
        outputFileSync(this.serialPath+'/serial', this.serial, 'utf-8');

delete objectkey.serial;
      }
      var token = jwt.sign(objectkey, this.secret);
      outputFileSync(this.serialPath+'/.tracker', token, 'utf-8');
    }

    outputFileSync(this.serialPath+'/.secret', JSON.stringify(config), 'utf-8');
    for(var c=0;c<Object.keys(config).length;c++){
      this[Object.keys(config)[c]]=config[Object.keys(config)[c]];
    }
    // reset object

  } else{
    throw new Error('wrong serial or just validated')
  }



  // var config=read file serial

};

module.exports=SysId
