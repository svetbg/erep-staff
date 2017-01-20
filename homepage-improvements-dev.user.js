// ==UserScript==
// @name         Erev HomePage Improvements
// @include      *www.erevollution.com*
// @version      0.1.1
// @description  Erev HomePage Improvements
// @author       Anonymous
// @grant        none
// ==/UserScript==

function style(t) {
    $("head").append("<style>" + t + "</style>")
}

(function() {
    'use strict';
    style(".hits {color: #595959;}")
    style(".dropdown:hover .dropdown-menu {display: block;}")
    var userLang = navigator.language||navigator.userLanguage||'en-US',goldBonusDataTarget='#tab-2',specialItemsPath='special-items'
    $( document ).ready(function() {
        var recoverableEnergy = 0
        var randomNumber = 6
        
        var checkEnergyInterval = setInterval(checkEnergy, randomNumber*6e4)
        setTimeout(checkEnergy, 3e3)
        
        improveMenu()
        improveInventory()
        
        function parseUrl()
        {
            var arr = location.pathname.split('/')
            var res = []
            for (var i=0; i<arr.length; ++i) {
                if (arr[i])
                    res.push(arr[i])
            }
            
            return res
        }
        
        function improveInventory()
        {
            var pathInfoArr = parseUrl()
            if (pathInfoArr.indexOf('inventory') != (pathInfoArr.length-1))
                return false
                
            var foodItems = $("img.vs303-1[src$='food.png']")
            var totalNrj = 0
            var foodQualityRegex = /q(\d)+$/i
            foodItems.each(function(){
                var spanValue = $(this).parent().next().next()
                var qty = parseInt($(this).parent().next().next().next().text())
                var foodQuality = parseInt(foodQualityRegex.exec(spanValue.text())[1])
                totalNrj += (qty*foodQuality*2)
                spanValue.prev().html(spanValue.prev().html()+' ('+(qty*foodQuality*2)+')')
            })
            
            $('div.vsPanel-title').text($('div.vsPanel-title').text() + ', Energy ['+totalNrj+']')
        }
        
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
            
            if (tabTarget == goldBonusDataTarget && location.pathname.indexOf(specialItemsPath) >= 0) {
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
            console.log(new Date().toUTCString())
            var pathInfoArr = parseUrl()
            
            // allow energy consuption only on the home page
            if (pathInfoArr.length > 1 && pathInfoArr.indexOf('index') == -1)
                return false
                
            var energyCont = $('div#energyBarT')
            if (energyCont === undefined)
                return False
                
            var currentEnergy = parseFloat(energyCont.html().split('/')[0])
            var maxEnergy = parseFloat(energyCont.html().split('/')[1])
            if (currentEnergy < maxEnergy) {
                getRecoverableEnergy()
                console.log(currentEnergy + ' ' + maxEnergy + ' ' + recoverableEnergy)
                var random = generateRandomNumber()*10
                if (recoverableEnergy >= random) {
                    console.log(randomNumber*randomNumber*1.13*1000)
                    setTimeout(function(){$('#energyButton').trigger('click')}, randomNumber*randomNumber*1.13*1000)
                }
            } else {
                console.log('End: ' + new Date().toUTCString())
                undefined!==checkEnergyInterval&&clearInterval(checkEnergyInterval)
            }
        }
        
        function getRecoverableEnergy()
        {
            recoverableEnergy = parseFloat($('strong#energyButtonT').html())
        }
        
        function generateRandomNumber()
        {
            randomNumber = Math.ceil(Math.random()*10)
            return randomNumber
        }
    });
})();
