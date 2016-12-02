// ==UserScript==
// @name         Tentlan
// @include      *bg2.tentlan.com*
// @version      0.0.2
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
    var sec = 1e3, notified = false
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
            var startProgressBtn = dialog.find('button.resProductionSelectButton[data-originalduration="600"]:visible')
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
        var resourceBuildings = ['CacaoPlantation', 'ObsidianMine', 'Quarry', 'CornFarm']
        var delay = 0
        $(resourceBuildings).each(function(k, v){
            var delayTimeout = setTimeout(function() {
                var harvest = $('div[data-building="'+v+'"] > div.productionDoneIcon:visible').length
                if (harvest == 1) {
                    var area = $('area[data-building="'+v+'"]')
                    area.trigger('click')

                    setTimeout(function(){
                        harvestAction()
                    }, sec)
                }
            }, delay+4*sec)
            delay+=4*sec
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
        setInterval(checkResourceBuildings, 20*sec)
        //setInterval(checkNotifications, 60*sec)
    })
    
    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
    
    function naturalClick(node)
    {
        //triggerMouseEvent (node, "mouseover");
        triggerMouseEvent (node, "mousedown");
        triggerMouseEvent (node, "click");
        triggerMouseEvent (node, "mouseup");
        
    }
})()
