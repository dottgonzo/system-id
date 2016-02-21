import * as fs from "fs";

import * as pathExists from "path-exists";
import * as jwt from "jsonwebtoken";

let uuid = require('uuid');
let outputFileSync = require('output-file-sync');


function initsysid(serialPath: string): { serial: string; secret: string } {
    let serial: string = uuid.v4();
    let secret: string = uuid.v4() + uuid.v4();

    outputFileSync(serialPath + '/.secret', secret, 'utf-8');
    outputFileSync(serialPath + '/serial', serial, 'utf-8');

    return { serial: serial, secret: secret }
}

function readSerial(serialPath: string) {

    return fs.readFileSync(serialPath + '/serial', 'utf8')

}
function readSecret(serialPath: string) {

    return fs.readFileSync(serialPath + '/.secret', 'utf8')

}
function readTracker(serialPath: string) {

    return fs.readFileSync(serialPath + '/.tracker', 'utf8')

}
function readJson(serialPath) {
    let config = <IJson>{};

    config.secret = readSecret(serialPath);
    config.serial = readSerial(serialPath)
    if (pathExists.sync(serialPath + '/.tracker')) {
        config.tracker = readTracker(serialPath)

    }

    return config

}

interface IJson {
    secret: string;
    serial: string;
    tracker?: string;
}

interface Iid {
    dir: string;
    tracker?: boolean;

}

class SysID {
    dir: string;
    tracker: string;
    secret: string;
    serial: string;

    constructor(dir:string,options) {

        let config: IJson;

        if (dir) {
            this.dir = dir;

        } else {
            throw new Error('wrong dir')

        }
        if (options.tracker !== false) {

            this.tracker = 'pending';

        }

        if (!pathExists.sync(this.dir + '/serial')) {

            config = initsysid(this.dir);
        } else {
            config = readJson(this.dir);
        }

        for (var c = 0; c < Object.keys(config).length; c++) {
            this[Object.keys(config)[c]] = config[Object.keys(config)[c]];
        }
    }




    read() {
        return readJson(this.dir)
    };
    decode() {
        return jwt.verify(this.tracker, this.secret);
    };
    auth() {
        var code = jwt.verify(this.tracker, this.secret)
        code.serial = readSerial(this.dir)
        return code;
    };
    sign(json) {
        var token = jwt.sign(json, this.secret);
        return token
    };
    verify(token, maxAge) {
        try {
            if (maxAge) {
                var decoded = jwt.verify(token, this.secret, { maxAge: maxAge });
            } else {
                var decoded = jwt.verify(token, this.secret);
            }
            return decoded
        } catch (err) {
            return err
        }
    };

    validate(serial, objectkey) {


        if (objectkey && serial == this.serial && this.tracker && this.tracker == 'pending') {
            var config = {
                secret: this.secret
            }

            if (objectkey.serial) {
                this.serial = objectkey.serial;
                outputFileSync(this.dir + '/serial', this.serial, 'utf-8');

                delete objectkey.serial;
            }
            var token = jwt.sign(objectkey, this.secret, { noTimestamp: true });
            outputFileSync(this.dir + '/.tracker', token, 'utf-8');
            this.tracker = token
            // reset object

        } else {
            throw new Error('wrong serial or just validated')
        }



        // var config=read file serial

    };



}




export = SysID
