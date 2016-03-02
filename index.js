var fs = require("fs");
var pathExists = require("path-exists");
var jwt = require("jsonwebtoken");
var uuid = require('uuid');
var outputFileSync = require('output-file-sync');
function initsysid(serialPath, seri) {
    var serial;
    if (seri) {
        serial = seri;
    }
    else {
        serial = uuid.v4();
    }
    var secret = uuid.v4() + uuid.v4();
    outputFileSync(serialPath + '/.secret', secret, 'utf-8');
    outputFileSync(serialPath + '/serial', serial, 'utf-8');
    return { serial: serial, secret: secret };
}
function readSerial(serialPath) {
    return fs.readFileSync(serialPath + '/serial', 'utf8');
}
function readSecret(serialPath) {
    return fs.readFileSync(serialPath + '/.secret', 'utf8');
}
function readTracker(serialPath) {
    return fs.readFileSync(serialPath + '/.tracker', 'utf8');
}
function readJson(serialPath) {
    var config = {};
    config.secret = readSecret(serialPath);
    config.serial = readSerial(serialPath);
    if (pathExists.sync(serialPath + '/.tracker')) {
        config.tracker = readTracker(serialPath);
    }
    return config;
}
var SysID = (function () {
    function SysID(dir, options) {
        var config;
        if (dir) {
            this.dir = dir;
        }
        else {
            throw new Error('wrong dir');
        }
        if (!options || !options.tracker) {
            this.tracker = false;
        }
        if (!pathExists.sync(this.dir + '/serial')) {
            config = initsysid(this.dir, options.serial);
        }
        else {
            config = readJson(this.dir);
        }
        for (var c = 0; c < Object.keys(config).length; c++) {
            this[Object.keys(config)[c]] = config[Object.keys(config)[c]];
        }
    }
    SysID.prototype.read = function () {
        return readJson(this.dir);
    };
    ;
    SysID.prototype.decode = function () {
        return jwt.verify(this.tracker, this.secret);
    };
    ;
    SysID.prototype.auth = function () {
        var code = jwt.verify(this.tracker, this.secret);
        code.serial = readSerial(this.dir);
        return code;
    };
    ;
    SysID.prototype.sign = function (json) {
        var token = jwt.sign(json, this.secret);
        return token;
    };
    ;
    SysID.prototype.verify = function (token, maxAge) {
        try {
            if (maxAge) {
                var decoded = jwt.verify(token, this.secret, { maxAge: maxAge });
            }
            else {
                var decoded = jwt.verify(token, this.secret);
            }
            return decoded;
        }
        catch (err) {
            return err;
        }
    };
    ;
    SysID.prototype.validate = function (serial, objectkey) {
        if (this.tracker) {
            var config = {
                secret: this.secret
            };
            if (objectkey.serial) {
                this.serial = objectkey.serial;
                outputFileSync(this.dir + '/serial', this.serial, 'utf-8');
                delete objectkey.serial;
            }
            var token = jwt.sign(objectkey, this.secret, { noTimestamp: true });
            outputFileSync(this.dir + '/.tracker', token, 'utf-8');
            this.tracker = token;
        }
        else {
            throw new Error('wrong serial or just validated');
        }
    };
    ;
    return SysID;
})();
module.exports = SysID;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImluaXRzeXNpZCIsInJlYWRTZXJpYWwiLCJyZWFkU2VjcmV0IiwicmVhZFRyYWNrZXIiLCJyZWFkSnNvbiIsIlN5c0lEIiwiU3lzSUQuY29uc3RydWN0b3IiLCJTeXNJRC5yZWFkIiwiU3lzSUQuZGVjb2RlIiwiU3lzSUQuYXV0aCIsIlN5c0lELnNpZ24iLCJTeXNJRC52ZXJpZnkiLCJTeXNJRC52YWxpZGF0ZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBWSxFQUFFLFdBQU0sSUFBSSxDQUFDLENBQUE7QUFFekIsSUFBWSxVQUFVLFdBQU0sYUFBYSxDQUFDLENBQUE7QUFDMUMsSUFBWSxHQUFHLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFFcEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBR2pELG1CQUFtQixVQUFrQixFQUFDLElBQVk7SUFDOUNBLElBQUlBLE1BQWFBLENBQUNBO0lBQ2xCQSxFQUFFQSxDQUFBQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFBQSxDQUFDQTtRQUNMQSxNQUFNQSxHQUFDQSxJQUFJQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFBQ0EsSUFBSUEsQ0FBQUEsQ0FBQ0E7UUFDSEEsTUFBTUEsR0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7SUFDckJBLENBQUNBO0lBRURBLElBQUlBLE1BQU1BLEdBQVdBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO0lBRTNDQSxjQUFjQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxFQUFFQSxNQUFNQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtJQUN6REEsY0FBY0EsQ0FBQ0EsVUFBVUEsR0FBR0EsU0FBU0EsRUFBRUEsTUFBTUEsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7SUFFeERBLE1BQU1BLENBQUNBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLENBQUFBO0FBQzdDQSxDQUFDQTtBQUVELG9CQUFvQixVQUFrQjtJQUVsQ0MsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsVUFBVUEsR0FBR0EsU0FBU0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQUE7QUFFMURBLENBQUNBO0FBQ0Qsb0JBQW9CLFVBQWtCO0lBRWxDQyxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxZQUFZQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFBQTtBQUUzREEsQ0FBQ0E7QUFDRCxxQkFBcUIsVUFBa0I7SUFFbkNDLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLFlBQVlBLENBQUNBLFVBQVVBLEdBQUdBLFdBQVdBLEVBQUVBLE1BQU1BLENBQUNBLENBQUFBO0FBRTVEQSxDQUFDQTtBQUNELGtCQUFrQixVQUFVO0lBQ3hCQyxJQUFJQSxNQUFNQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUV2QkEsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsVUFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7SUFDdkNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFVBQVVBLENBQUNBLFVBQVVBLENBQUNBLENBQUFBO0lBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM1Q0EsTUFBTUEsQ0FBQ0EsT0FBT0EsR0FBR0EsV0FBV0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQUE7SUFFNUNBLENBQUNBO0lBRURBLE1BQU1BLENBQUNBLE1BQU1BLENBQUFBO0FBRWpCQSxDQUFDQTtBQWlCRDtJQU1JQyxlQUFZQSxHQUFVQSxFQUFDQSxPQUFhQTtRQUVoQ0MsSUFBSUEsTUFBYUEsQ0FBQ0E7UUFFbEJBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQ05BLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1FBRW5CQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNKQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFBQTtRQUVoQ0EsQ0FBQ0E7UUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFN0JBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBO1FBRXpCQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUV6Q0EsTUFBTUEsR0FBR0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsRUFBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDaERBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ0pBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2hDQSxDQUFDQTtRQUVEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNsREEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FB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Q0EsR0FBR0EsR0FBR0EsV0FBV0EsRUFBRUEsS0FBS0EsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDdkRBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUFBO1FBR3hCQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNKQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxnQ0FBZ0NBLENBQUNBLENBQUFBO1FBQ3JEQSxDQUFDQTtJQU1MQSxDQUFDQTs7SUFJTFAsWUFBQ0E7QUFBREEsQ0EvRkEsQUErRkNBLElBQUE7QUFLRCxpQkFBUyxLQUFLLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcblxuaW1wb3J0ICogYXMgcGF0aEV4aXN0cyBmcm9tIFwicGF0aC1leGlzdHNcIjtcbmltcG9ydCAqIGFzIGp3dCBmcm9tIFwianNvbndlYnRva2VuXCI7XG5cbmxldCB1dWlkID0gcmVxdWlyZSgndXVpZCcpO1xubGV0IG91dHB1dEZpbGVTeW5jID0gcmVxdWlyZSgnb3V0cHV0LWZpbGUtc3luYycpO1xuXG5cbmZ1bmN0aW9uIGluaXRzeXNpZChzZXJpYWxQYXRoOiBzdHJpbmcsc2VyaT86c3RyaW5nKTogeyBzZXJpYWw6IHN0cmluZzsgc2VjcmV0OiBzdHJpbmcgfSB7XG4gICAgbGV0IHNlcmlhbDpzdHJpbmc7XG4gICAgaWYoc2VyaSl7XG4gICAgICAgIHNlcmlhbD1zZXJpO1xuICAgIH0gZWxzZXtcbiAgICAgICAgc2VyaWFsPXV1aWQudjQoKTtcbiAgICB9XG5cbiAgICBsZXQgc2VjcmV0OiBzdHJpbmcgPSB1dWlkLnY0KCkgKyB1dWlkLnY0KCk7XG5cbiAgICBvdXRwdXRGaWxlU3luYyhzZXJpYWxQYXRoICsgJy8uc2VjcmV0Jywgc2VjcmV0LCAndXRmLTgnKTtcbiAgICBvdXRwdXRGaWxlU3luYyhzZXJpYWxQYXRoICsgJy9zZXJpYWwnLCBzZXJpYWwsICd1dGYtOCcpO1xuXG4gICAgcmV0dXJuIHsgc2VyaWFsOiBzZXJpYWwsIHNlY3JldDogc2VjcmV0IH1cbn1cblxuZnVuY3Rpb24gcmVhZFNlcmlhbChzZXJpYWxQYXRoOiBzdHJpbmcpIHtcblxuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoc2VyaWFsUGF0aCArICcvc2VyaWFsJywgJ3V0ZjgnKVxuXG59XG5mdW5jdGlvbiByZWFkU2VjcmV0KHNlcmlhbFBhdGg6IHN0cmluZykge1xuXG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhzZXJpYWxQYXRoICsgJy8uc2VjcmV0JywgJ3V0ZjgnKVxuXG59XG5mdW5jdGlvbiByZWFkVHJhY2tlcihzZXJpYWxQYXRoOiBzdHJpbmcpIHtcblxuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoc2VyaWFsUGF0aCArICcvLnRyYWNrZXInLCAndXRmOCcpXG5cbn1cbmZ1bmN0aW9uIHJlYWRKc29uKHNlcmlhbFBhdGgpIHtcbiAgICBsZXQgY29uZmlnID0gPElKc29uPnt9O1xuXG4gICAgY29uZmlnLnNlY3JldCA9IHJlYWRTZWNyZXQoc2VyaWFsUGF0aCk7XG4gICAgY29uZmlnLnNlcmlhbCA9IHJlYWRTZXJpYWwoc2VyaWFsUGF0aClcbiAgICBpZiAocGF0aEV4aXN0cy5zeW5jKHNlcmlhbFBhdGggKyAnLy50cmFja2VyJykpIHtcbiAgICAgICAgY29uZmlnLnRyYWNrZXIgPSByZWFkVHJhY2tlcihzZXJpYWxQYXRoKVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbmZpZ1xuXG59XG5cbmludGVyZmFjZSBJSnNvbiB7XG4gICAgc2VjcmV0OiBzdHJpbmc7XG4gICAgc2VyaWFsOiBzdHJpbmc7XG4gICAgdHJhY2tlcj86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIElpZCB7XG4gICAgZGlyOiBzdHJpbmc7XG4gICAgdHJhY2tlcj86IGJvb2xlYW47XG5cbn1cbmludGVyZmFjZSBJb3B0IHtcbiAgICB0cmFja2VyPzpib29sZWFuO1xuICAgIHNlcmlhbD86c3RyaW5nXG59XG5jbGFzcyBTeXNJRCB7XG4gICAgZGlyOiBzdHJpbmc7XG4gICAgdHJhY2tlcjogYW55O1xuICAgIHNlY3JldDogc3RyaW5nO1xuICAgIHNlcmlhbDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoZGlyOnN0cmluZyxvcHRpb25zPzpJb3B0KSB7XG5cbiAgICAgICAgbGV0IGNvbmZpZzogSUpzb247XG5cbiAgICAgICAgaWYgKGRpcikge1xuICAgICAgICAgICAgdGhpcy5kaXIgPSBkaXI7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgZGlyJylcblxuICAgICAgICB9XG4gICAgICAgIGlmICghb3B0aW9uc3x8IW9wdGlvbnMudHJhY2tlcikge1xuXG4gICAgICAgICAgICB0aGlzLnRyYWNrZXIgPSBmYWxzZTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFwYXRoRXhpc3RzLnN5bmModGhpcy5kaXIgKyAnL3NlcmlhbCcpKSB7XG5cbiAgICAgICAgICAgIGNvbmZpZyA9IGluaXRzeXNpZCh0aGlzLmRpcixvcHRpb25zLnNlcmlhbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcgPSByZWFkSnNvbih0aGlzLmRpcik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IE9iamVjdC5rZXlzKGNvbmZpZykubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgIHRoaXNbT2JqZWN0LmtleXMoY29uZmlnKVtjXV0gPSBjb25maWdbT2JqZWN0LmtleXMoY29uZmlnKVtjXV07XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIHJlYWQoKSB7XG4gICAgICAgIHJldHVybiByZWFkSnNvbih0aGlzLmRpcilcbiAgICB9O1xuICAgIGRlY29kZSgpIHtcbiAgICAgICAgcmV0dXJuIGp3dC52ZXJpZnkodGhpcy50cmFja2VyLCB0aGlzLnNlY3JldCk7XG4gICAgfTtcbiAgICBhdXRoKCkge1xuICAgICAgICB2YXIgY29kZSA9IGp3dC52ZXJpZnkodGhpcy50cmFja2VyLCB0aGlzLnNlY3JldClcbiAgICAgICAgY29kZS5zZXJpYWwgPSByZWFkU2VyaWFsKHRoaXMuZGlyKVxuICAgICAgICByZXR1cm4gY29kZTtcbiAgICB9O1xuICAgIHNpZ24oanNvbikge1xuICAgICAgICB2YXIgdG9rZW4gPSBqd3Quc2lnbihqc29uLCB0aGlzLnNlY3JldCk7XG4gICAgICAgIHJldHVybiB0b2tlblxuICAgIH07XG4gICAgdmVyaWZ5KHRva2VuLCBtYXhBZ2UpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChtYXhBZ2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb2RlZCA9IGp3dC52ZXJpZnkodG9rZW4sIHRoaXMuc2VjcmV0LCB7IG1heEFnZTogbWF4QWdlIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVjb2RlZCA9IGp3dC52ZXJpZnkodG9rZW4sIHRoaXMuc2VjcmV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVkXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGVyclxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhbGlkYXRlKHNlcmlhbCwgb2JqZWN0a2V5KSB7XG5cblxuICAgICAgICBpZiAodGhpcy50cmFja2VyKSB7XG4gICAgICAgICAgICB2YXIgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIHNlY3JldDogdGhpcy5zZWNyZXRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9iamVjdGtleS5zZXJpYWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlcmlhbCA9IG9iamVjdGtleS5zZXJpYWw7XG4gICAgICAgICAgICAgICAgb3V0cHV0RmlsZVN5bmModGhpcy5kaXIgKyAnL3NlcmlhbCcsIHRoaXMuc2VyaWFsLCAndXRmLTgnKTtcblxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3RrZXkuc2VyaWFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRva2VuID0gand0LnNpZ24ob2JqZWN0a2V5LCB0aGlzLnNlY3JldCwgeyBub1RpbWVzdGFtcDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIG91dHB1dEZpbGVTeW5jKHRoaXMuZGlyICsgJy8udHJhY2tlcicsIHRva2VuLCAndXRmLTgnKTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tlciA9IHRva2VuXG4gICAgICAgICAgICAvLyByZXNldCBvYmplY3RcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd3cm9uZyBzZXJpYWwgb3IganVzdCB2YWxpZGF0ZWQnKVxuICAgICAgICB9XG5cblxuXG4gICAgICAgIC8vIHZhciBjb25maWc9cmVhZCBmaWxlIHNlcmlhbFxuXG4gICAgfTtcblxuXG5cbn1cblxuXG5cblxuZXhwb3J0ID0gU3lzSURcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
