// ==UserScript==
// @name         Tentlan
// @include      *bg2.tentlan.com/overview*
// @version      0.0.1
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
    function parseUrl()
    {
        var urlParts = location.pathname.split('/')
        urlParams['category'] = urlParts[urlParts.length-3]
        urlParams['quality'] = urlParts[urlParts.length-2]
    }
    
    function checkResourceBuildings()
    {
        var resourceBuildings = ['Quarry']
        $(resourceBuildings).each(function(k, v){
            
            var harvest = $('div[data-building="'+v+'"] > div.productionDoneIcon:visible').length
            if (harvest == 1) {
                var area = $('area[data-building="'+v+'"]')
                area.trigger('click')
                
                setTimeout(function(){
                    var btnContainerId = v+'BwindowRightAFootContent'
                    var btnContainer = $('#'+btnContainerId+' > button.resProductionProgressCollectButton')
                    console.log(btnContainer)
                }, 2000)
                
            }
        })
        
    }
    
    $( document ).ready(function() {
        parseUrl()
        
        setTimeout(checkResourceBuildings, 2000)
    })
})()
