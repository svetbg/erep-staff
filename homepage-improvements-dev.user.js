// ==UserScript==
// @name         Erev HomePage Improvements
// @include      *www.erevollution.com*
// @version      0.0.6
// @description  Erev HomePage Improvements
// @author       Anonymous
// @grant        none
// ==/UserScript==

function style(t) {
    $("head").append("<style>" + t + "</style>")
}

(function() {
    'use strict';
    style(".hits {color: #595959;}");
    var userLang = navigator.language||navigator.userLanguage||'en-US'
    $( document ).ready(function() {
        var recoverableEnergy = 0
        
        var checkEnergyInterval = setInterval(checkEnergy, 6*6e4)
        setTimeout(checkEnergy, 10e2)
        
        improveMenu()
        
        function improveMenu()
        {
            var storeMenuItem = $('ul.nav-pills > li').eq(6)
            if (storeMenuItem === undefined)
                return False
                
            var storeMenuA = storeMenuItem.find('a')
            storeMenuA.addClass('dropdown-toggle').append('<i class="fa fa-angle-right drop-icon"></i>')
            storeMenuItem.append('<ul class="submenu"><li><a href="'+storeMenuA.attr('href')+'">'+storeMenuA.find('span').html()+'</a></li><li><a href="'+storeMenuA.attr('href')+'#tab-2">Referrals</a></li></ul>')
            $('.nav-tabs a[href="' + location.hash + '"]').tab('show');
        }
        
        function checkEnergy() 
        {
            var energyCont = $('div#energyBarT')
            if (energyCont === undefined)
                return False
                
            var currentEnergy = parseFloat(energyCont.html().split('/')[0])
            var maxEnergy = parseFloat(energyCont.html().split('/')[1])
            if (currentEnergy < maxEnergy) {
                getRecoverableEnergy()
                var random = generateRandomNumber()
                if (recoverableEnergy >= random) {
                    $('#energyButton').trigger('click')
                }
            } else {
                undefined!==checkEnergyInterval&&clearInterval(checkEnergyInterval)
            }
        }
        
        function getRecoverableEnergy()
        {
            recoverableEnergy = parseFloat($('strong#energyButtonT').html())
        }
        
        function generateRandomNumber()
        {
            return Math.ceil(Math.random()*10)*10
        }
    });
})();
