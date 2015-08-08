'use strict';

angular.module('exchangeFactory', [])
    .factory('Exchange', function($http) {
        var exchangeFactory = {};

        exchangeFactory.get = function() {
        return $http.get('http://query.yahooapis.com/v1/public/yql?q=select%20%2a%20from%20yahoo.finance.xchange%20where%20pair%20in%20%28%22SGDMMK%22%29&format=json&env=store://datatables.org/alltableswithkeys');
    };
    return exchangeFactory;
});
