// ==UserScript==
// @name         HomePage Improvements
// @include      *www.erevollution.com/*/index
// @version      0.0.2
// @description  HomePage Improvements
// @author       Anonymous
// @grant        none
// ==/UserScript==

function style(t) {
    $("head").append("<style>" + t + "</style>")
}

(function() {
    'use strict';
    style("select {display:table-cell;}");
    style(".hits {color: #595959;}");
    var userLang = navigator.language||navigator.userLanguage||'en-US'
    $( document ).ready(function() {
        var currentEnergy = parseFloat($('div#energyBarT').html().split('/')[0])
        var maxEnergy = parseFloat($('div#energyBarT').html().split('/')[1])
        var recoverableEnergy = 0
        
        checkEnergy()
        var checkEnergyInterval = setInterval(checkEnergy, 6e5)
        
        function checkEnergy() 
        {
            if (currentEnergy < maxEnergy) {
                getRecoverableEnergy()
                if (recoverableEnergy > generateRandomNumber()) {
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
