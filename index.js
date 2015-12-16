var uuid=require('uuid'),
pathExists=require('path-exists'),
Promise=require('promise'),
fs = require('fs'),
outputFileSync = require('output-file-sync');

function initsysid(serialPath,autosigned){
  var config={
    serial:uuid.v4()
  }

  if(autosigned){
    config.token=uuid.v4();
    config.validated=true
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
  console.log(this.serialPath);
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
  // if (!pathExists.sync(this.serialPath)){
return readSerial(this.serialPath)
// } else{
//   throw new Error('wrong serial or token or no validate')
//
// }
};
SysId.prototype.update=function(serial,oldtoken,newtoken){

  if(serial==this.serial&&oldtoken==this.token&&this.validated){
    var config={
      serial:serial,
      token:newtoken,
      validated:this.validated
    }

    outputFileSync(this.serialPath, JSON.stringify(config), 'utf-8');
    for(var c=0;c<Object.keys(config).length;c++){
          this[Object.keys(config)[c]]=config[Object.keys(config)[c]];

    }


  } else{
    throw new Error('wrong serial or token or no validate')
  }

},

SysId.prototype.validate=function(serial,token,newserial){
  var conf=this;

    if(serial==conf.serial&&!conf.validated){
      if(newserial){
        serial=newserial
      }
      var config={
        serial:serial,
        token:token,
        validated:true
      }
      outputFileSync(this.serialPath, JSON.stringify(config), 'utf-8');


      // reset object

    } else{
      throw new Error('wrong serial or token or no validate')
    }



  // var config=read file serial

};

module.exports=SysId
