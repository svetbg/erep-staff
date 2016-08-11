// ==UserScript==
// @name         Erev Market Improvements
// @include      *www.erevollution.com/*/market*
// @version      0.0.3
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
    
    var urlParams = []
    function parseUrl()
    {
        var urlParts = location.pathname.split('/')
        urlParams['category'] = urlParts[urlParts.length-3]
        urlParams['quality'] = urlParts[urlParts.length-2]
    }
    
    $( document ).ready(function() {
        parseUrl()
        show('panel', urlParams['category'])
        if (urlParams['category'] == 4) {
            $('div.main-box-body tr:gt(0)').each(function(){
                var priceTD = $(this).find('td.vs129')
                var price = parseFloat(priceTD.find('strong').html().replace(' ',''))||0
                var usage = parseInt($(this).find('span.defense strong').html())||0
                var usagePerOneNrg = parseFloat(price/usage).toFixed(4)
                priceTD.html(priceTD.html()+'<br />'+usagePerOneNrg+' / nrg')
            })
        }
    })
})()
