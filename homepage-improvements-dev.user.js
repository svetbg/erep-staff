// ==UserScript==
// @name         Erev HomePage Improvements
// @include      *www.erevollution.com/*/index
// @version      0.0.4
// @description  Erev HomePage Improvements
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
        var recoverableEnergy = 0
        
        var checkEnergyInterval = setInterval(checkEnergy, 6*6e4)
        setTimeout(checkEnergy, 10e2)
        
        function checkEnergy() 
        {
            console.log(new Date)
            var currentEnergy = parseFloat($('div#energyBarT').html().split('/')[0])
            var maxEnergy = parseFloat($('div#energyBarT').html().split('/')[1])
            console.log(currentEnergy +' < '+maxEnergy)
            if (currentEnergy < maxEnergy) {
                
                getRecoverableEnergy()
                var random = generateRandomNumber()
                console.log(recoverableEnergy +' >= '+random)
                if (recoverableEnergy >= random) {
                    $('#energyButton').trigger('click')
                }
            } else {
                console.log(new Date)
                console.log('Done!')
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
