var uuid=require('uuid'),
pathExists=require('path-exists'),
Promise=require('promise'),
fs = require('fs'),
jwt = require('jsonwebtoken'),
outputFileSync = require('output-file-sync');

function initsysid(serialPath,autosigned){




  var config={
    serial:uuid.v4(),
    secret:uuid.v4()+uuid.v4()
  }

  if(autosigned){
    config.tracker='self'
  }

  outputFileSync(serialPath, JSON.stringify(config), 'utf-8');

  return JSON.parse(fs.readFileSync(serialPath))
}

function readSerial(serialPath){

  return JSON.parse(fs.readFileSync(serialPath))

}


function SysId(serialPath,autosigned){


  if(serialPath && serialPath == true){
    this.serialPath='/etc/nodeid/serial.json';
    this.autosigned=true

  } else if(serialPath){
    this.serialPath=serialPath;
    this.autosigned=false
  } else{
    this.serialPath='/etc/nodeid/serial.json';
    this.autosigned=false

  }

  if (!pathExists.sync(this.serialPath)){



    var conf=initsysid(this.serialPath,this.autosigned);
    for(var c=0;c<Object.keys(conf).length;c++){
      this[Object.keys(conf)[c]]=conf[Object.keys(conf)[c]];
    }

  } else{
    var conf=readSerial(this.serialPath);

    for(var c=0;c<Object.keys(conf).length;c++){
      this[Object.keys(conf)[c]]=conf[Object.keys(conf)[c]];

    }



  }



};
SysId.prototype.read=function(){
  return readSerial(this.serialPath)
};
SysId.prototype.decode=function(){
  return jwt.verify(this.serial, this.secret);
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
  var conf=this;

  if(serial==this.serial&&!this.tracker){
    var config=readSerial(this.serialPath);

    if(objectkey){
      if(objectkey.serial){
        config.serial=objectkey.serial;
delete objectkey.serial;
      }
      var token = jwt.sign(objectkey, this.secret);

      config.tracker=token;
    }



    outputFileSync(this.serialPath, JSON.stringify(config), 'utf-8');

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
