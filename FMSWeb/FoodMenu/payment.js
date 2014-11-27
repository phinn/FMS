(function () {
    var app = angular.module('Payment', []);
    app.controller('PaymentController', function ($scope) {
        for (var i = 0; i < gem.dishes.length; i++) {
            var dish = gem.dishes[i];
            gem.totalAmount += dish.unitPrice * dish.quantity;
        }
        this.paymentItem = gem;
    });

    var gem = 
        {
            no: 3,
            totalAmount:0,
            dishes: [{
                name: '羊肉',
                quantity: 3,
                unitPrice: 38,
                currency:"CNY",
                remark: ""
            }, {
                name: '牛肉',
                quantity: 1,
                unitPrice: 38,
                currency: "CNY",
                remark: ""
            }, {
                name: '香菇',
                quantity: 1,
                unitPrice: 38,
                currency: "CNY",
                remark: ""
            }, {
                name: '鸡毛菜',
                quantity: 2,
                unitPrice: 38,
                currency: "CNY",
                remark: ""
            }, {
                name: '羊肉',
                quantity: 3,
                unitPrice: 38,
                currency: "CNY",
                remark: ""
            }]
        };
})();