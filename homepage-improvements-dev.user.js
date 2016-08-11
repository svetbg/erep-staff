// ==UserScript==
// @name         Erev HomePage Improvements
// @include      *www.erevollution.com*
// @version      0.0.8
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
        setTimeout(checkEnergy, 3e3)
        
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
        
        var tabTarget = '', collectRefGoldform
        var referralsDonated = JSON.parse(localStorage.getItem('erevRD'))||{};
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            tabTarget = $(e.target).attr("href") // activated tab
            
            if (tabTarget == '#tab-2' && location.pathname.indexOf('special-items') >= 0) {
                collectRefGoldform = $('table.table').find('tbody tr').last().find('form')
                if (collectRefGoldform.length > 0) {
                    collectRefGoldform.submit(function(e){
                        getReferralsInfo()
                    })
                }
                
                improveReferralsPage()
            }
            
            
        })
        
        function getReferralsInfo()
        {
            var infoTable = $('table.table')
            var playerTr = infoTable.find('tbody tr')
            var userInfo = []
            var len = playerTr.length
            playerTr.each(function(idx, el){
                if (idx == len-1 && collectRefGoldform.length > 0)
                    return false

                    var row = $(this)
                    var userId = getUserIdFromUrl(row.find('td:gt(0) > a').attr('href'))
                    referralsDonated['donated'][userId] = referralsDonated['donated'][userId]||0
                    referralsDonated['donated'][userId] += parseFloat(row.find('td:eq(3) > strong').html())
            })

            localStorage.setItem('erevRD',JSON.stringify(referralsDonated))
        }
        
        function improveReferralsPage() 
        {
            var infoTable = $('table.table')
            infoTable.find('thead > tr').append('<th class="text-center">Already Collected</th>')
            var playerTr = infoTable.find('tbody tr')
            var len = playerTr.length
            playerTr.each(function(idx, el){
                var row = $(this)
                if (idx == len-1 && collectRefGoldform.length > 0) {
                    row.find('td:eq(0)').attr('colspan', 4)
                    return false
                }
                
                var userId = getUserIdFromUrl(row.find('td:gt(0) > a').attr('href'))
                row.append('<td class="text-center"><strong>'+(referralsDonated['donated'][userId]&&referralsDonated['donated'][userId].toLocaleString())+'</strong></td>')
            })
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
