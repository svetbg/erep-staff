// ==UserScript==
// @name         Tentlan
// @include      *bg2.tentlan.com/overview*
// @version      0.0.3
// @description  Overview Improvements
// @author       Anonymous
// @grant        none
// ==/UserScript==

function style(t) {
    $("head").append("<style>" + t + "</style>")
}

(function() {
    'use strict';
    style("select {display:table-cell;}");
    
    var urlParams = []
    var sec = 1e3, notified = false, workDuration = [600,3600,14400,28800], workChoice = 0
    var wait = 3*sec
    function parseUrl()
    {
        var urlParts = location.pathname.split('/')
        urlParams['category'] = urlParts[urlParts.length-3]
        urlParams['quality'] = urlParts[urlParts.length-2]
    }
    
    function harvestAction()
    {
        var dialog = $('#dialogContainer')
        var harvestBtn = dialog.find('button.resProductionProgressCollectButton:visible')
        
        if (harvestBtn.length) {
            console.log('Try to harvest production')
            naturalClick(harvestBtn[0])
        }
        
        setTimeout(function(){
            var startProgressBtn = dialog.find('button.resProductionSelectButton[data-originalduration="'+workDuration[workChoice]+'"]:visible')
            if (startProgressBtn.length == 1) {
                console.log('Try to start new production')
                naturalClick(startProgressBtn[0])
            }
        }, sec)
        
        setTimeout(function(){
            console.log('Closing modal.')
            dialog.find('.wclose').trigger('click')
        }, 2*sec)
    }
    
    function checkResourceBuildings()
    {
        // Quarry, CornFarm, CacaoPlantation, ObsidianMine
        var resourceBuildings = ['ObsidianMine', 'Quarry', 'CornFarm', 'CacaoPlantation']
        var delay=0
        console.log(new Date().toUTCString())
        $(resourceBuildings).each(function(k, v){
            
            setTimeout(function(){
                
                var harvest = $('div[data-building="'+v+'"] > div.productionDoneIcon:visible').length
                if (harvest == 1) {
                    console.log(new Date().toUTCString())
                    var area = $('area[data-building="'+v+'"]')
                    area.trigger('click')

                    setTimeout(function(){
                        harvestAction()
                    }, sec)
                }
            }, delay+wait)
            delay+=wait
        })
        
    }
    
    function checkNotifications()
    {
        var notifications = $('div#menuLinkNotifications div#unreadNotificationsCounter:visible')
        
        if (notifications.length > 0) {
           // alert('You have ' + notifications.length + ' notifications!')
        }
    }
    
    $( document ).ready(function() {
        parseUrl()
        checkResourceBuildings(), checkNotifications()
        setInterval(checkResourceBuildings, 30*sec)
        //setInterval(checkNotifications, 60*sec)
    })
    
    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
    
    function naturalClick(node)
    {
        console.log(node)
        //triggerMouseEvent (node, "mouseover");
        triggerMouseEvent (node, "mousedown");
        triggerMouseEvent (node, "click");
        triggerMouseEvent (node, "mouseup");
        
    }
})()
