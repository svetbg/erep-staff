// ==UserScript==
// @name         StarRep HomePage Improvements
// @include      *www.starrepublik.com*
// @version      0.0.8
// @description  StarRep HomePage Improvements
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
    var userLang = navigator.language||navigator.userLanguage||'en-US'
    $( document ).ready(function() {
        var recoverableEnergy = 0
        var randomNumber = 6
        var humanLikeClickTime = 2000  // microsecods
        var pathInfoArr = parseUrl()
        
        //autoVisitPages()        
        
        if (pathInfoArr.length <= 2) {
            var checkEnergyInterval = setInterval(checkEnergy, randomNumber*6e4)
            setTimeout(checkEnergy, humanLikeClickTime)
        }
        
        var exploreTime = 0
        $.cookie.raw = true;
        if (!$.cookie("exploreTimeout")) {
            setTimeout(checkExploration, humanLikeClickTime)
        } else {
            if (pathInfoArr.length <= 2) {
                randomNumber = generateRandomNumber()
                
                //var refreshTimeToExplore = parseInt($.cookie("exploreTimeout"))/4 - randomNumber*60
                
                if (randomNumber < 3) randomNumber = 4
                
                setTimeout(function(){window.location.reload()}, randomNumber*6e4)
            }
        }
        
        var exploreTimeout = ''
        
        function checkExploration()
        {
            var pathInfoArr = parseUrl()
            
            if (pathInfoArr.length <= 2) {
                window.location = '/exploration/'
                return false
            }
            
            setTimeout(function() {
                getExploreTimeout()
                $.cookie('exploreTimeout', null, { path: '/'});
                var date = new Date();
                var m = 30;
                date.setTime(date.getTime() + (m * 60 * 1000));
                if (exploreTimeout) {
                    console.log('Exploration still cooling down: '+exploreTimeout)
                    exploreTime = timeToSeconds(exploreTimeout)
                    //var date = new Date()
                    //console.log(date)
                    //var m = 10;
                    //var newTime = date.getTime() + exploreTime*1000
                    //date.setTime(newTime)
                    //console.log(date)
                    $.cookie("exploreTimeout", exploreTime, { path: '/', expires: date });
                    setTimeout(function(){window.location='/'}, 5e2)
                } else {
                    var exploreBtn = $('div.explore div.explore-cell')
                    if (exploreBtn) {
                        var tokenImg = exploreBtn.find('img.credits-img')
                        if (tokenImg.length) {
                            console.log('Explore wants tokens?!')
                            setTimeout(function(){window.location='/'}, 5e2)
                        } else {
                            console.log('Click should be triggered')
                            //var date = new Date()
                            //exploreTime = timeToSeconds('08:00:00')
                            //var newTime = date.getTime() + exploreTime*1000
                            //date.setTime(newTime)

                            $.cookie("exploreTimeout", exploreTime, { path: '/', expires: date });
                            setTimeout(function(){exploreBtn[generateRandomNumber()].trigger('click');setTimeout(function(){window.location='/'},1e3)}, 5e2)
                        }
                    }
                }
            }, humanLikeClickTime)
        }
        
        function getExploreTimeout()
        {
            var exploreTimer = $('div.exploration > div.timer')
            exploreTimeout = exploreTimer.html()
        }
        
        function parseUrl()
        {
            return location.pathname.split('/')
        }
        
        function improveInventory()
        {
            var pathInfoArr = parseUrl()
            if (pathInfoArr.indexOf('inventory') != (pathInfoArr.length-1))
                return false
                
            var foodItems = $("img.vs112[src$='food.png']")
            var totalNrj = 0
            var foodQualityRegex = /star\-(\d)+$/i
            foodItems.each(function(){
                var spanValue = $(this).parent().next().next()
                var qty = parseInt(spanValue.find('span.timer').text())
                var foodQuality = parseInt(foodQualityRegex.exec(spanValue.find('i').attr('class'))[1])
                totalNrj += (qty*foodQuality*2)
                spanValue.prev().html(spanValue.prev().html()+' ('+(qty*foodQuality*2)+')')
            })
            
            $('header').eq(2).find('h2').after('<h4>Energy: '+totalNrj+'</h4>')
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
            if (pathInfoArr.length > 2)
                return false
            
            var energyCont = $('div.power')
            if (energyCont === undefined)
                return false
            
            var currentEnergy = parseFloat(energyCont.text().split('/')[0])
            var maxEnergy = parseFloat(energyCont.text().split('/')[1])
           
            if (currentEnergy < maxEnergy) {
                getRecoverableEnergy()
                console.log(currentEnergy + ' ' + maxEnergy + ' ' + recoverableEnergy)
                var random = generateRandomNumber()*10
                
                if (recoverableEnergy >= random) {
                    console.log(randomNumber*randomNumber*1.13*1000)
                    if (recoverableEnergy == 50 || recoverableEnergy == 500) {
                        console.log('Refresh time :)')
                        setTimeout(function(){window.location.reload()}, randomNumber*randomNumber*1.13*1000)
                        return false
                    }

                    if (recoverableEnergy % 8 !== 0 && recoverableEnergy < 100) {
                        console.log('Skipping...')
                        return false
                    }

                    setTimeout(function(){$('span.restore-power').trigger('click')}, randomNumber*randomNumber*1.13*1000)
                }
            } else {
                console.log('End: ' + new Date().toUTCString())
                undefined!==checkEnergyInterval&&clearInterval(checkEnergyInterval)
            }
        }
        
        function getRecoverableEnergy()
        {
            recoverableEnergy = parseFloat($('span#power-to-restore').text())
        }
        
        function generateRandomNumber()
        {
            randomNumber = Math.ceil(Math.random()*10)
            return randomNumber
        }
        
        function timeToSeconds(time) {
            time = time.split(/:/)
            
            return parseInt(time[0] * 3600 + time[1] * 60 + time[2]*1)
        }
        
        function autoVisitPages()
        {
            var linkHrefs = getAllMenuLinks('.navbar')
            var randomNumber = generateRandomNumber() 
            if (pathInfoArr.length <= 2) {
                $.cookie("autoPlay", 1, { path: '/'});
                setTimeout(function(){window.location.href=linkHrefs[Math.floor(Math.random()*linkHrefs.length)]}, randomNumber * 6e4)
            }

            // return back
            if (pathInfoArr.length > 2) {
                if ($.cookie("autoPlay")) {
                    $.cookie("autoPlay", null, { path: '/'});
                    setTimeout(function(){window.location.href='/'}, randomNumber * 5e3)
                }
            }
        }
        
        function getAllMenuLinks(menuContainerIdentificator)
        {
            var links = $(menuContainerIdentificator).find('a')
            var hrefArr = []
            if (links.length) {
                links.each(function(){
                    var href = $(this).attr('href')
                    if (href.indexOf('http') != -1 || href.indexOf('#') != -1) {
                        return
                    }
                    hrefArr.push(href)
                })
            }
            
            return hrefArr
        }
    });
})();
