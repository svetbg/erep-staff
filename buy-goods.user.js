// ==UserScript==
// @name         BuyGoods
// @include      *www.erepublik.com*
// @version      0.2
// @description  BuyGoods
// @author       SvetBG
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    var $ = jQuery,
        smart = 1,
        huntProduct = null,
        LANG = "en"
    "undefined" != typeof erepublik && (LANG = erepublik.settings.culture)

    function s() {
        if (huntProduct != null) {
            clearInterval(huntProduct);
            huntProduct = null;
            return false
        };
        c();
        var interval = parseInt($('#desired_interval').val()) > 0 ? parseInt($('#desired_interval').val()) * 1e3 : 3e5;
        huntProduct = setInterval(c, interval)
    }

    function i() {
        var e = $("div.country-select"),
            disabled = parseInt("F0", 17) > Math.pow(2, 7) && 1 == smart ? '' : 'disabled';
        e.after('<div><a class="std_global_btn smallSize blueColor buyOffer" id="startHunting" style="width: 120px; padding: 0px 0px 7px 10px; margin-right: 5px;">Start Hunting</a> Price: <input id="desired_price" style="width: 70px;" class="shadowed buyField ng-pristine ng-valid ng-isolate-scope ng-valid-maxlength ng-touched"/> Qty: <input id="desired_qty" style="width: 70px;" class="shadowed buyField ng-pristine ng-valid ng-isolate-scope ng-valid-maxlength ng-touched"/> Interval: <select id="desired_interval" style="width: 70px; height: auto" class="shadowed buyField ng-pristine ng-valid ng-isolate-scope ng-valid-maxlength ng-touched"><option ' + disabled + ' value="2">2 sec</option><option ' + disabled + ' value="3">3 sec</option><option ' + disabled + ' value="5">5 sec</option><option ' + disabled + ' value="10">10 sec</option><option ' + disabled + ' value="30">30 sec</option><option ' + disabled + ' value="60">60 sec</option><option value="300" selected>5 min</option></select></div>')
    }

    function g() {
        return location.hash.substr(1)
    }

    function c() {
        var e = g().split("/"),
            r = e[1],
            a = e[0],
            o = e[2],
            t = parseFloat($("#desired_price").val()) || 0,
            n = parseFloat($("#desired_qty").val()) || 0;
        $.ajax({
            url: "/" + LANG + "/economy/marketplace?countryId=" + a + "&industryId=" + r + "&quality=" + o + "&orderBy=price_asc&currentPage=1&ajaxMarket=1"
        }).success(function(e) {
            var r = $.parseJSON(e),
                a = 0;
            $(r).each(function(e, r) {
                //var itemsIterationTimeout = setTimeout(function() {
                    var e = parseFloat(r.priceWithTaxes);
                    if (e > t) return console.log("Price is not good: " + e), !1;
                    if (1 > n) return console.log("Qty is 0"), !1;
                    var a = n,
                        o = r.id,
                        c = parseInt(r.amount) > a ? a : parseInt(r.amount),
                        s = $("#award_token").val(),
                        i = {
                            amount: c,
                            offerId: o,
                            buyAction: 1,
                            _token: s,
                            orderBy: "price_asc",
                            currentPage: 1
                        };
                    $.ajax({
                        type: "POST",
                        url: "/" + LANG + "/economy/marketplace",
                        data: i,
                        async:false
                    }).success(function(r) {
                        var a = JSON.parse(r);
                        if (a.error !== !1) return console.log(r), console.log("There was an error buying the product!"), !1;
                        var o = n - c;
                        console.log("Bought " + c + " pieces at " + e), 0 >= o && (console.log("Bought all amount wanted. Stop hunting!"), $("#startHunting").trigger("click"), o = 0), n = o, $("#desired_qty").val(o)
                    })
                //}, a + 250);
                a += 250
            })
        })
    }

    $(document).ready(function() {
        i();
        $('#startHunting').click(function(e) {
            var btnHtml = $(this).html() == 'Start Hunting' ? 'Stop Hunting' : 'Start Hunting';
            $(this).html(btnHtml);
            s()
        })
    })
})();
