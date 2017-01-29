"use strict";
var Observable_1 = require('rxjs/Observable');
var query_1 = require('./query');
var operation_1 = require('./operation');
var ODataService = (function () {
    function ODataService(_typeName, http, config) {
        this._typeName = _typeName;
        this.http = http;
        this.config = config;
    }
    Object.defineProperty(ODataService.prototype, "TypeName", {
        get: function () {
            return this._typeName;
        },
        enumerable: true,
        configurable: true
    });
    ODataService.prototype.Get = function (key) {
        return new operation_1.GetOperation(this._typeName, this.config, this.http, key);
    };
    ODataService.prototype.Post = function (entity) {
        var body = JSON.stringify(entity);
        return this.handleResponse(this.http.post(this.config.baseUrl + '/' + this.TypeName, body, this.config.postRequestOptions));
    };
    ODataService.prototype.CustomAction = function (key, actionName, postdata) {
        var body = JSON.stringify(postdata);
        return this.http.post(this.getEntityUri(key) + '/' + actionName, body, this.config.requestOptions).map(function (resp) { return resp.json(); });
    };
    ODataService.prototype.CustomFunction = function (key, actionName) {
        return this.http.get(this.getEntityUri(key) + '/' + actionName, this.config.requestOptions).map(function (resp) { return resp.json(); });
    };
    ODataService.prototype.Patch = function (entity, key) {
        var body = JSON.stringify(entity);
        return this.http.patch(this.getEntityUri(key), body, this.config.postRequestOptions);
    };
    ODataService.prototype.Put = function (entity, key) {
        var body = JSON.stringify(entity);
        return this.handleResponse(this.http.put(this.getEntityUri(key), body, this.config.postRequestOptions));
    };
    ODataService.prototype.Delete = function (key) {
        return this.http.delete(this.getEntityUri(key), this.config.requestOptions);
    };
    ODataService.prototype.Query = function () {
        return new query_1.ODataQuery(this.TypeName, this.config, this.http);
    };
    ODataService.prototype.getEntityUri = function (entityKey) {
        return this.config.getEntityUri(entityKey, this._typeName);
    };
    ODataService.prototype.handleResponse = function (entity) {
        var _this = this;
        return entity.map(this.extractData)
            .catch(function (err, caught) {
            if (_this.config.handleError)
                _this.config.handleError(err, caught);
            return Observable_1.Observable.throw(err);
        });
    };
    ODataService.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        var entity = body;
        return entity || null;
    };
    ODataService.prototype.escapeKey = function () {
    };
    return ODataService;
}());
exports.ODataService = ODataService;
//# sourceMappingURL=odata.js.map