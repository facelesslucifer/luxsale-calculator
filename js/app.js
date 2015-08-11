var app = angular.module("main", [
    "exchangeFactory",
    "ngCookies"
]);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.controller("mainController", ["$scope", "$cookies", "Exchange", function ($scope, $cookies, Exchange) {

    $scope.model = [];
    $scope.model.items = itemType;
    $scope.model.types = [];
    $scope.model.quantity = [];

    $scope.dataItem = "0";
    $scope.dataType = "0";
    $scope.dataQuantity = "0";
    $scope.dataTotal = 0;
    $scope.dataPriceDelivery = 0;
    $scope.itemPrice = 0.0;
    $scope.dataPriceService = 0;
    $scope.invalid = false;

    $scope.history = [];

    if(! $cookies.get("exchangeRate")) {
        Exchange.get()
            .then(function(returnData) {
            if(returnData.status == 200){
                var startIndex = returnData.data.indexOf('bld>');
                var endIndex = returnData.data.indexOf('MMK</span>');
                var finalString = returnData.data.substring(startIndex + 4, endIndex);
                var finalDouble = parseFloat(finalString) + 15;
                $scope.exchangeRate = rounding(finalDouble);
            }
        });
    }
    else {
        $scope.exchangeRate = rounding($cookies.get("exchangeRate"));
    }


    // change event for Item dropdown
    $scope.dataItemChange = function() {
        $scope.model.types = [];
        for(var i =0; i < $scope.model.items.length; i++) {
            var item = $scope.model.items[i];
            if(item.value == $scope.dataItem) {
                $scope.model.types = item.type;
                $scope.dataType = "0";
                return;
            }
        }
    }

    // change event for Type dropdown
    $scope.dataTypeChange = function() {
        $scope.model.dataQuantity = [];
        for(var i =0; i < $scope.model.types.length; i++) {
            var type = $scope.model.types[i];
            if(type.value == $scope.dataType) {
                $scope.model.quantity = type.price;
                $scope.dataQuantity = "0";
                return;
            }
        }
    }

    // change event for Type dropdown
    $scope.dataQuantityChange = function() {
        for(var i = 0; i < $scope.model.quantity.length; i++) {
            var qty = $scope.model.quantity[i];
            if(qty.q == $scope.dataQuantity) {
                $scope.dataPriceDelivery = qty.p;
                calculateTotal();
                return;
            }
        }
    }

    $scope.dataPriceChange = function() {
        if(!$scope.itemPrice) {
            $scope.invalid = true;
            return;
        }
        $scope.invalid = false;
        $scope.dataQuantityChange();
    }

    function calculateTotal(deliveryPrice) {
        var totalItemPrice = $scope.itemPrice * $scope.dataQuantity;
        console.log('total item price : ' + totalItemPrice);
        $scope.dataPriceService = rounding( ($scope.dataPriceDelivery + totalItemPrice) * 0.1 );

        $scope.dataTotal = ($scope.dataPriceService + totalItemPrice + $scope.dataPriceDelivery) * $scope.exchangeRate;
        $scope.dataTotal = rounding($scope.dataTotal);
    }

    function rounding(number) {
        return Math.round(number * 100) / 100
    }
}]);