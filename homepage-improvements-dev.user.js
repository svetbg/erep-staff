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
        
        improveMenu(),improveReferralsPage()
        
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
        
        function improveReferralsPage() {
            if (location.hash.indexOf('#tab-2') < 0) {
                return false
            }
            
            var referralsDonated = JSON.parse(localStorage.getItem('erevRD'))||{};
            referralsDonated['donated'] = referralsDonated['donated']||{}
            
            var infoTable = $('table.table')
            infoTable.find('thead > tr').append('<th class="text-center">Already Collected</th>')
            var playerTr = infoTable.find('tbody tr')
            var form = infoTable.find('tbody tr').last().find('form')
            var userInfo = []
            var len = playerTr.length
            playerTr.each(function(idx, el){
                if (idx == len-1 && form.length > 0)
                    return false
                    
                var row = $(this)
                var userId = getUserIdFromUrl(row.find('td:gt(0) > a').attr('href'))
                userInfo[userId] = parseFloat(row.find('td:eq(3) > strong').html())
                referralsDonated['donated'][userId] = referralsDonated['donated'][userId]||0
            })
            
            if (form.length > 0) {
                for (var uId in userInfo) {
                    if (userInfo.hasOwnProperty(uId)) {
                        referralsDonated['donated'][uId] = referralsDonated['donated'][uId]||0
                        referralsDonated['donated'][uId] += userInfo[uId]
                    }
                }
            }
            
            playerTr.each(function(){
                var row = $(this)
                var userId = getUserIdFromUrl(row.find('td:gt(0) > a').attr('href'))
                row.append('<td class="text-center"><strong>'+referralsDonated['donated'][userId].toLocaleString()+'</strong></td>')
            })
            
            localStorage.setItem('erevRD',JSON.stringify(referralsDonated))
        }
        
        function getUserIdFromUrl(url)
        {
            if (url === undefined)
                return 0
                
            var infoArr = url.split('/')
            return infoArr[infoArr.length-1]
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
