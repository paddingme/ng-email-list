(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Copyright 2015 ERAS/Educational Research and Services
//Reproduction of this material strictly prohibited.
//Written by Ryan Lee

'use strict';
/*jslint node:true, indent:2, nomen:true*/
/*globals angular*/

module.exports = angular
  .module('ng-email-list', [])
  .directive('ngEmailList', require('./emailList.js'));

},{"./emailList.js":2}],2:[function(require,module,exports){
//Copyright 2014 ERAS/Educational Research and Services
//See License File
//Written by Ryan Lee

'use strict';
/*jslint node:true, indent:2, nomen:true*/
/*globals angular*/

var EMAIL_REX = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

module.exports = [function () {
  return {
    'restrict' : 'E',
    'require' : '?ngModel',
    'scope' : {
      'rejected' : '=rejected',
      'repeat' : '=repeat'
    },
    'replace' : true,
    'template' : '<textarea></textarea>',
    'link' : function ($scope, elem, attrs, model) {

      model.$validators.email = function (modelValue) {
        if (model.$isEmpty(modelValue)) {
          modelValue = [];
        }
        if (!angular.isArray(modelValue)) {
          throw new Error('ng-email-list expects model to be an array.');
        }
        if (modelValue === undefined) {
          return true;
        }
        $scope.rejected = [];
        angular.forEach(modelValue, function (email) {
          if (!EMAIL_REX.test(email)) {
            $scope.rejected.push(email);
          }
        });
        return $scope.rejected.length === 0;
      };

      if (attrs.repeat || angular.isDefined(attrs.norepeat)) {
        model.$validators.repeat = function (modelValue) {
          if (model.$isEmpty(modelValue)) {
            modelValue = [];
          }
          if (!angular.isArray(modelValue)) {
            throw new Error('ng-email-list expects model to be an array.');
          }
          $scope.repeat = [];
          if (modelValue === undefined) {
            return true;
          }
          //TODO make this <IE9 compatable
          $scope.repeat = modelValue.filter(function (value, index, self) {
            return self.indexOf(value) !== index;
          });
          return $scope.repeat.length === 0;
        };
      }

      if (angular.isDefined(attrs.brackets)) {
        model.$parsers.push(function (value) {
          //@TODO make this a REGEX
          var cleaned = value.split('<').join('');
          cleaned = cleaned.split('>').join('');
          return cleaned;
        });
      }

      model.$parsers.push(function (value) {
        if (value === '') {
          return [];
        }
        var parsed = value.split(',');
        angular.forEach(parsed, function (val, i) {
          parsed[i] = val.trim();
        });
        return parsed;
      });

      model.$formatters.push(function (value) {
        if (value) {
          return value.join(',\n');
        }
      });
    }
  };
}];

},{}]},{},[1]);
