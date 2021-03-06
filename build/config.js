"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var query_1 = require('./query');
// import { Location } from '@angular/common';
var KeyConfigs = (function () {
    function KeyConfigs() {
        this.filter = '$filter';
        this.top = '$top';
        this.skip = '$skip';
        this.orderBy = '$orderby';
        this.select = '$select';
        this.expand = '$expand';
    }
    return KeyConfigs;
}());
exports.KeyConfigs = KeyConfigs;
var ODataConfiguration = (function () {
    function ODataConfiguration() {
        this.keys = new KeyConfigs();
        this.baseUrl = 'http://localhost/odata';
    }
    ODataConfiguration.prototype.getEntityUri = function (entityKey, _typeName) {
        // check if string is a GUID (UUID) type
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(entityKey)) {
            return this.baseUrl + '/' + _typeName + "(" + entityKey + ")";
        }
        if (!/^[0-9]*$/.test(entityKey)) {
            return this.baseUrl + '/' + _typeName + "('" + entityKey + "')";
        }
        return this.baseUrl + '/' + _typeName + '(' + entityKey + ')';
    };
    ODataConfiguration.prototype.handleError = function (err, caught) {
        console.warn('OData error: ', err, caught);
    };
    ;
    Object.defineProperty(ODataConfiguration.prototype, "requestOptions", {
        get: function () {
            return new http_1.RequestOptions({ body: '' });
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ODataConfiguration.prototype, "postRequestOptions", {
        get: function () {
            var headers = new http_1.Headers({ 'Content-Type': 'application/json; charset=utf-8' });
            return new http_1.RequestOptions({ headers: headers });
        },
        enumerable: true,
        configurable: true
    });
    ODataConfiguration.prototype.extractQueryResultData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        var entities = body.value;
        return entities;
    };
    ODataConfiguration.prototype.extractQueryResultDataWithCount = function (res) {
        var pagedResult = new query_1.PagedResult();
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        var entities = body.value;
        pagedResult.data = entities;
        try {
            var count = parseInt(body['@odata.count'], 10) || entities.length;
            pagedResult.count = count;
        }
        catch (error) {
            console.warn('Cannot determine OData entities count. Falling back to collection length...');
            pagedResult.count = entities.length;
        }
        return pagedResult;
    };
    ODataConfiguration = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ODataConfiguration);
    return ODataConfiguration;
}());
exports.ODataConfiguration = ODataConfiguration;
//# sourceMappingURL=config.js.map