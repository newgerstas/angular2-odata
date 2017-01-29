"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var ODataOperation = (function () {
    function ODataOperation(_typeName, config, http) {
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
    }
    ODataOperation.prototype.Expand = function (expand) {
        this._expand = this.parseStringOrStringArray(expand);
        return this;
    };
    ODataOperation.prototype.Select = function (select) {
        this._select = this.parseStringOrStringArray(select);
        return this;
    };
    ODataOperation.prototype.getParams = function () {
        var params = new http_1.URLSearchParams();
        if (this._select && this._select.length > 0)
            params.set(this.config.keys.select, this._select);
        if (this._expand && this._expand.length > 0)
            params.set(this.config.keys.expand, this._expand);
        return params;
    };
    ODataOperation.prototype.handleResponse = function (entity) {
        var _this = this;
        return entity.map(this.extractData)
            .catch(function (err, caught) {
            if (_this.config.handleError)
                _this.config.handleError(err, caught);
            return Observable_1.Observable.throw(err);
        });
    };
    ODataOperation.prototype.getEntityUri = function (entityKey) {
        return this.config.getEntityUri(entityKey, this._typeName);
    };
    ODataOperation.prototype.getRequestOptions = function () {
        var options = this.config.requestOptions;
        options.search = this.getParams();
        return options;
    };
    ODataOperation.prototype.parseStringOrStringArray = function (input) {
        if (input instanceof Array) {
            return input.join(',');
        }
        return input;
    };
    ODataOperation.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        var entity = body;
        return entity || null;
    };
    return ODataOperation;
}());
exports.ODataOperation = ODataOperation;
var OperationWithKey = (function (_super) {
    __extends(OperationWithKey, _super);
    function OperationWithKey(_typeName, config, http, key) {
        _super.call(this, _typeName, config, http);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.key = key;
    }
    return OperationWithKey;
}(ODataOperation));
exports.OperationWithKey = OperationWithKey;
var OperationWithEntity = (function (_super) {
    __extends(OperationWithEntity, _super);
    function OperationWithEntity(_typeName, config, http, entity) {
        _super.call(this, _typeName, config, http);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.entity = entity;
    }
    return OperationWithEntity;
}(ODataOperation));
exports.OperationWithEntity = OperationWithEntity;
var OperationWithKeyAndEntity = (function (_super) {
    __extends(OperationWithKeyAndEntity, _super);
    function OperationWithKeyAndEntity(_typeName, config, http, key, entity) {
        _super.call(this, _typeName, config, http);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.key = key;
        this.entity = entity;
    }
    return OperationWithKeyAndEntity;
}(ODataOperation));
exports.OperationWithKeyAndEntity = OperationWithKeyAndEntity;
var GetOperation = (function (_super) {
    __extends(GetOperation, _super);
    function GetOperation() {
        _super.apply(this, arguments);
    }
    GetOperation.prototype.Exec = function () {
        return _super.prototype.handleResponse.call(this, this.http.get(this.getEntityUri(this.key), this.getRequestOptions()));
    };
    return GetOperation;
}(OperationWithKey));
exports.GetOperation = GetOperation;
// export class PostOperation<T> extends OperationWithEntity<T>{
//     public Exec():Observable<T>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.post(this.config.baseUrl + "/"+this._typeName, body, this.getRequestOptions()));
//     }
// }
// export class PatchOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec():Observable<Response>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.http.patch(this.getEntityUri(this.key),body,this.getRequestOptions());
//     }
// }
// export class PutOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec(){
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.put(this.getEntityUri(this.key),body,this.getRequestOptions()));
//     }
// }
//# sourceMappingURL=operation.js.map