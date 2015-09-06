var app = angular.module("main", [
    "exchangeFactory",
    "ngCookies",
    "oitozero.ngSweetAlert"
]);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

app.controller("mainController", ["$scope", "$cookies", "Exchange", "SweetAlert",
        function ($scope, $cookies, Exchange, SweetAlert) {

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
    $scope.historyTotalPrice = 0;
    $scope.historyItem = {
        item : "",
        type : "",
        quantity : 0,
        total : 0
    };

    $scope.exchangeRate = 910

    // get the exchange rate api
    // if(! $cookies.get("exchangeRate")) {
    //     Exchange.get()
    //         .then(function(returnData) {
    //         if(returnData.status == 200){
    //             var startIndex = returnData.data.indexOf('bld>');
    //             var endIndex = returnData.data.indexOf('MMK</span>');
    //             var finalString = returnData.data.substring(startIndex + 4, endIndex);
    //             var finalDouble = parseFloat(finalString) + 15;
    //             $scope.exchangeRate = rounding(finalDouble);
    //         }
    //     });
    // }
    // else {
    //     $scope.exchangeRate = rounding($cookies.get("exchangeRate"));
    // }

    // change event for Item dropdown
    $scope.dataItemChange = function() {
        $scope.model.types = [];
        for(var i =0; i < $scope.model.items.length; i++) {
            var item = $scope.model.items[i];

            $scope.historyItem.item = "";

            if(item.value == $scope.dataItem) {

                $scope.historyItem.item = item.name;

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

            $scope.historyItem.type = ""

            if(type.value == $scope.dataType) {

                $scope.historyItem.type = type.name;

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

            $scope.historyItem.quantity = 0;

            if(qty.q == $scope.dataQuantity) {
                $scope.dataPriceDelivery = qty.p;

                $scope.historyItem.quantity = qty.q;
                calculateTotal();
                return;
            }
            else {
                $scope.dataTotal = 0.0
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

    $scope.saveItem = function() {
        if($scope.itemPrice <= 0) {
            SweetAlert.swal("Item Price cannot be 0."); return;
        }
        else if($scope.historyItem.item == "") {
            SweetAlert.swal("Please select the Item."); return;
        }
        else if($scope.historyItem.type == "") {
            SweetAlert.swal("Please select the Type."); return;
        }
        else if($scope.historyItem.quantity <= 0) {
            SweetAlert.swal("Quantity cannot be 0."); return;
        }

        var local = angular.copy($scope.historyItem);
        $scope.history.push(local);
        calculateTotalHistoryPrice();
    }

    function calculateTotalHistoryPrice() {
        $scope.historyTotalPrice = 0;
        for(var i = 0; i < $scope.history.length; i++) {
            $scope.historyTotalPrice += $scope.history[i].total;
        }
    }

    $scope.clearItem = function() {
        SweetAlert.swal({
           title: "Are you sure?",
           text: "Your will not be able to recover this history list!",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
           cancelButtonText: "No, cancel plx!",
           closeOnConfirm: false,
           closeOnCancel: false },
        function(isConfirm){
           if (isConfirm) {
                $scope.history = [];
                SweetAlert.swal("Deleted!", "Your imaginary file has been deleted.", "success");
           } else {
              SweetAlert.swal("Cancelled", "Your history item is safe :)", "error");
           }
        });

    }

    function calculateTotal(deliveryPrice) {
        var totalItemPrice = $scope.itemPrice * $scope.dataQuantity;

        $scope.dataPriceService = rounding( ($scope.dataPriceDelivery + totalItemPrice) * 0.1 );

        $scope.dataTotal = ($scope.dataPriceService + totalItemPrice + $scope.dataPriceDelivery) * $scope.exchangeRate;
        $scope.dataTotal = rounding($scope.dataTotal);

        $scope.historyItem.total = $scope.dataTotal;
    }

    function rounding(number) {
        return Math.round(number * 100) / 100
    }
}]);