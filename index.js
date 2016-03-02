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
        if (!options)
            options = {};
        this.tracker = false;
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
        if (!this.tracker) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImluaXRzeXNpZCIsInJlYWRTZXJpYWwiLCJyZWFkU2VjcmV0IiwicmVhZFRyYWNrZXIiLCJyZWFkSnNvbiIsIlN5c0lEIiwiU3lzSUQuY29uc3RydWN0b3IiLCJTeXNJRC5yZWFkIiwiU3lzSUQuZGVjb2RlIiwiU3lzSUQuYXV0aCIsIlN5c0lELnNpZ24iLCJTeXNJRC52ZXJpZnkiLCJTeXNJRC52YWxpZGF0ZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBWSxFQUFFLFdBQU0sSUFBSSxDQUFDLENBQUE7QUFFekIsSUFBWSxVQUFVLFdBQU0sYUFBYSxDQUFDLENBQUE7QUFDMUMsSUFBWSxHQUFHLFdBQU0sY0FBYyxDQUFDLENBQUE7QUFFcEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBR2pELG1CQUFtQixVQUFrQixFQUFDLElBQVk7SUFDOUNBLElBQUlBLE1BQWFBLENBQUNBO0lBQ2xCQSxFQUFFQSxDQUFBQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFBQSxDQUFDQTtRQUNMQSxNQUFNQSxHQUFDQSxJQUFJQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFBQ0EsSUFBSUEsQ0FBQUEsQ0FBQ0E7UUFDSEEsTUFBTUEsR0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7SUFDckJBLENBQUNBO0lBRURBLElBQUlBLE1BQU1BLEdBQVdBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO0lBRTNDQSxjQUFjQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxFQUFFQSxNQUFNQSxFQUFFQSxPQUFPQSxDQUFDQSxDQUFDQTtJQUN6REEsY0FBY0EsQ0FBQ0EsVUFBVUEsR0FBR0EsU0FBU0EsRUFBRUEsTUFBTUEsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7SUFFeERBLE1BQU1BLENBQUNBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLEVBQUVBLENBQUFBO0FBQzdDQSxDQUFDQTtBQUVELG9CQUFvQixVQUFrQjtJQUVsQ0MsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsVUFBVUEsR0FBR0EsU0FBU0EsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQUE7QUFFMURBLENBQUNBO0FBQ0Qsb0JBQW9CLFVBQWtCO0lBRWxDQyxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxZQUFZQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFBQTtBQUUzREEsQ0FBQ0E7QUFDRCxxQkFBcUIsVUFBa0I7SUFFbkNDLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLFlBQVlBLENBQUNBLFVBQVVBLEdBQUdBLFdBQVdBLEVBQUVBLE1BQU1BLENBQUNBLENBQUFBO0FBRTVEQSxDQUFDQTtBQUNELGtCQUFrQixVQUFVO0lBQ3hCQyxJQUFJQSxNQUFNQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUV2QkEsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsVUFBVUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7SUFDdkNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFVBQVVBLENBQUNBLFVBQVVBLENBQUNBLENBQUFBO0lBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM1Q0EsTUFBTUEsQ0FBQ0EsT0FBT0EsR0FBR0EsV0FBV0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQUE7SUFFNUNBLENBQUNBO0lBRURBLE1BQU1BLENBQUNBLE1BQU1BLENBQUFBO0FBRWpCQSxDQUFDQTtBQWlCRDtJQU1JQyxlQUFZQSxHQUFVQSxFQUFDQSxPQUFhQTtRQUVoQ0MsSUFBSUEsTUFBYUEsQ0FBQ0E7UUFFbEJBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQ05BLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1FBRW5CQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNKQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFBQTtRQUVoQ0EsQ0FBQ0E7UUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7WUFBQ0EsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQUE7UUFDbENBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBO1FBRWJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRXpDQSxNQUFNQSxHQUFHQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUNoREEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDSkEsTUFBTUEsR0FBR0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDaENBLENBQUNBO1FBRURBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ2xEQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFD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V0EsRUFBRUEsS0FBS0EsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDdkRBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUFBO1FBR3hCQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNKQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxnQ0FBZ0NBLENBQUNBLENBQUFBO1FBQ3JEQSxDQUFDQTtJQU1MQSxDQUFDQTs7SUFJTFAsWUFBQ0E7QUFBREEsQ0EzRkEsQUEyRkNBLElBQUE7QUFLRCxpQkFBUyxLQUFLLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnNcIjtcblxuaW1wb3J0ICogYXMgcGF0aEV4aXN0cyBmcm9tIFwicGF0aC1leGlzdHNcIjtcbmltcG9ydCAqIGFzIGp3dCBmcm9tIFwianNvbndlYnRva2VuXCI7XG5cbmxldCB1dWlkID0gcmVxdWlyZSgndXVpZCcpO1xubGV0IG91dHB1dEZpbGVTeW5jID0gcmVxdWlyZSgnb3V0cHV0LWZpbGUtc3luYycpO1xuXG5cbmZ1bmN0aW9uIGluaXRzeXNpZChzZXJpYWxQYXRoOiBzdHJpbmcsc2VyaT86c3RyaW5nKTogeyBzZXJpYWw6IHN0cmluZzsgc2VjcmV0OiBzdHJpbmcgfSB7XG4gICAgbGV0IHNlcmlhbDpzdHJpbmc7XG4gICAgaWYoc2VyaSl7XG4gICAgICAgIHNlcmlhbD1zZXJpO1xuICAgIH0gZWxzZXtcbiAgICAgICAgc2VyaWFsPXV1aWQudjQoKTtcbiAgICB9XG5cbiAgICBsZXQgc2VjcmV0OiBzdHJpbmcgPSB1dWlkLnY0KCkgKyB1dWlkLnY0KCk7XG5cbiAgICBvdXRwdXRGaWxlU3luYyhzZXJpYWxQYXRoICsgJy8uc2VjcmV0Jywgc2VjcmV0LCAndXRmLTgnKTtcbiAgICBvdXRwdXRGaWxlU3luYyhzZXJpYWxQYXRoICsgJy9zZXJpYWwnLCBzZXJpYWwsICd1dGYtOCcpO1xuXG4gICAgcmV0dXJuIHsgc2VyaWFsOiBzZXJpYWwsIHNlY3JldDogc2VjcmV0IH1cbn1cblxuZnVuY3Rpb24gcmVhZFNlcmlhbChzZXJpYWxQYXRoOiBzdHJpbmcpIHtcblxuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoc2VyaWFsUGF0aCArICcvc2VyaWFsJywgJ3V0ZjgnKVxuXG59XG5mdW5jdGlvbiByZWFkU2VjcmV0KHNlcmlhbFBhdGg6IHN0cmluZykge1xuXG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhzZXJpYWxQYXRoICsgJy8uc2VjcmV0JywgJ3V0ZjgnKVxuXG59XG5mdW5jdGlvbiByZWFkVHJhY2tlcihzZXJpYWxQYXRoOiBzdHJpbmcpIHtcblxuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoc2VyaWFsUGF0aCArICcvLnRyYWNrZXInLCAndXRmOCcpXG5cbn1cbmZ1bmN0aW9uIHJlYWRKc29uKHNlcmlhbFBhdGgpIHtcbiAgICBsZXQgY29uZmlnID0gPElKc29uPnt9O1xuXG4gICAgY29uZmlnLnNlY3JldCA9IHJlYWRTZWNyZXQoc2VyaWFsUGF0aCk7XG4gICAgY29uZmlnLnNlcmlhbCA9IHJlYWRTZXJpYWwoc2VyaWFsUGF0aClcbiAgICBpZiAocGF0aEV4aXN0cy5zeW5jKHNlcmlhbFBhdGggKyAnLy50cmFja2VyJykpIHtcbiAgICAgICAgY29uZmlnLnRyYWNrZXIgPSByZWFkVHJhY2tlcihzZXJpYWxQYXRoKVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbmZpZ1xuXG59XG5cbmludGVyZmFjZSBJSnNvbiB7XG4gICAgc2VjcmV0OiBzdHJpbmc7XG4gICAgc2VyaWFsOiBzdHJpbmc7XG4gICAgdHJhY2tlcj86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIElpZCB7XG4gICAgZGlyOiBzdHJpbmc7XG4gICAgdHJhY2tlcj86IGJvb2xlYW47XG5cbn1cbmludGVyZmFjZSBJb3B0IHtcbiAgICB0cmFja2VyPzpib29sZWFuO1xuICAgIHNlcmlhbD86c3RyaW5nXG59XG5jbGFzcyBTeXNJRCB7XG4gICAgZGlyOiBzdHJpbmc7XG4gICAgdHJhY2tlcjogYW55O1xuICAgIHNlY3JldDogc3RyaW5nO1xuICAgIHNlcmlhbDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoZGlyOnN0cmluZyxvcHRpb25zPzpJb3B0KSB7XG5cbiAgICAgICAgbGV0IGNvbmZpZzogSUpzb247XG5cbiAgICAgICAgaWYgKGRpcikge1xuICAgICAgICAgICAgdGhpcy5kaXIgPSBkaXI7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignd3JvbmcgZGlyJylcblxuICAgICAgICB9XG4gICAgICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9XG50aGlzLnRyYWNrZXIgPSBmYWxzZTtcblxuICAgICAgICBpZiAoIXBhdGhFeGlzdHMuc3luYyh0aGlzLmRpciArICcvc2VyaWFsJykpIHtcblxuICAgICAgICAgICAgY29uZmlnID0gaW5pdHN5c2lkKHRoaXMuZGlyLG9wdGlvbnMuc2VyaWFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZyA9IHJlYWRKc29uKHRoaXMuZGlyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgT2JqZWN0LmtleXMoY29uZmlnKS5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgdGhpc1tPYmplY3Qua2V5cyhjb25maWcpW2NdXSA9IGNvbmZpZ1tPYmplY3Qua2V5cyhjb25maWcpW2NdXTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgcmVhZCgpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRKc29uKHRoaXMuZGlyKVxuICAgIH07XG4gICAgZGVjb2RlKCkge1xuICAgICAgICByZXR1cm4gand0LnZlcmlmeSh0aGlzLnRyYWNrZXIsIHRoaXMuc2VjcmV0KTtcbiAgICB9O1xuICAgIGF1dGgoKSB7XG4gICAgICAgIHZhciBjb2RlID0gand0LnZlcmlmeSh0aGlzLnRyYWNrZXIsIHRoaXMuc2VjcmV0KVxuICAgICAgICBjb2RlLnNlcmlhbCA9IHJlYWRTZXJpYWwodGhpcy5kaXIpXG4gICAgICAgIHJldHVybiBjb2RlO1xuICAgIH07XG4gICAgc2lnbihqc29uKSB7XG4gICAgICAgIHZhciB0b2tlbiA9IGp3dC5zaWduKGpzb24sIHRoaXMuc2VjcmV0KTtcbiAgICAgICAgcmV0dXJuIHRva2VuXG4gICAgfTtcbiAgICB2ZXJpZnkodG9rZW4sIG1heEFnZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKG1heEFnZSkge1xuICAgICAgICAgICAgICAgIHZhciBkZWNvZGVkID0gand0LnZlcmlmeSh0b2tlbiwgdGhpcy5zZWNyZXQsIHsgbWF4QWdlOiBtYXhBZ2UgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBkZWNvZGVkID0gand0LnZlcmlmeSh0b2tlbiwgdGhpcy5zZWNyZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRlY29kZWRcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFsaWRhdGUoc2VyaWFsLCBvYmplY3RrZXkpIHtcblxuICAgICAgICBpZiAoIXRoaXMudHJhY2tlcikge1xuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBzZWNyZXQ6IHRoaXMuc2VjcmV0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvYmplY3RrZXkuc2VyaWFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJpYWwgPSBvYmplY3RrZXkuc2VyaWFsO1xuICAgICAgICAgICAgICAgIG91dHB1dEZpbGVTeW5jKHRoaXMuZGlyICsgJy9zZXJpYWwnLCB0aGlzLnNlcmlhbCwgJ3V0Zi04Jyk7XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgb2JqZWN0a2V5LnNlcmlhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGp3dC5zaWduKG9iamVjdGtleSwgdGhpcy5zZWNyZXQsIHsgbm9UaW1lc3RhbXA6IHRydWUgfSk7XG4gICAgICAgICAgICBvdXRwdXRGaWxlU3luYyh0aGlzLmRpciArICcvLnRyYWNrZXInLCB0b2tlbiwgJ3V0Zi04Jyk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrZXIgPSB0b2tlblxuICAgICAgICAgICAgLy8gcmVzZXQgb2JqZWN0XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignd3Jvbmcgc2VyaWFsIG9yIGp1c3QgdmFsaWRhdGVkJylcbiAgICAgICAgfVxuXG5cblxuICAgICAgICAvLyB2YXIgY29uZmlnPXJlYWQgZmlsZSBzZXJpYWxcblxuICAgIH07XG5cblxuXG59XG5cblxuXG5cbmV4cG9ydCA9IFN5c0lEXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
