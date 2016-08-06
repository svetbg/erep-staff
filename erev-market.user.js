// ==UserScript==
// @name         Erev Market Improvements
// @include      *www.erevollution.com/*/market/*/4/*
// @version      0.0.2
// @description  Erev Market Improvements
// @author       Anonymous
// @grant        none
// ==/UserScript==

function style(t) {
    $("head").append("<style>" + t + "</style>")
}

(function() {
    'use strict';
    style("select {display:table-cell;}");
    var userLang = navigator.language||navigator.userLanguage||'en-US'
    
    $( document ).ready(function() {
        $('div.main-box-body tr:gt(0)').each(function(){
            var priceTD = $(this).find('td.vs129')
            var price = parseFloat(priceTD.find('strong').html().replace(' ',''))||0
            var usage = parseInt($(this).find('span.defense strong').html())||0
            var usagePerOneNrg = parseFloat(price/usage).toFixed(4)
            priceTD.html(priceTD.html()+'<br />'+usagePerOneNrg+' / nrg')
        })
    })
})()
