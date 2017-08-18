// ==UserScript==
// @name         players.lookup
// @include      *.tentlan.com/overview*
// @version      0.0.3
// @description  Looks for players above specified threshold
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @author       Anonymous
// @grant        GM_xmlhttpRequest
// @connect      www.fiong.com
// ==/UserScript==


(function() {
    'use strict';
    
    function interceptAjax (tempWindow) {
        var score = document.currentScript.dataset.score;
        var userThreshold = 0.1
        var userThresholdValue = score * userThreshold;
        var level = 9
        var matrixSize = 20
        //var warringCity = {'x': 419, 'y': 558}
        var warringCity = {}
        getCapitalCoords()
        
        $('body').ajaxSuccess (
            function (event, requestData)
            {
                if (requestData.responseText.indexOf('playerData') !== -1) {
                    processWorldmapData(requestData.responseText)
                }
            }
        );
        
        function processWorldmapData(jsonData)
        {
            var objectsData = JSON.parse(jsonData)
            
            var res = [], res1 = []
            $.each(objectsData, function(idx, el){
                $.each(el.npcData, function (idx1, npc){
                    if (npc.tier == level) {
                        var $coordinates = calculateCoordinates(idx, idx1)
                        var distance = calculateDistance(warringCity, $coordinates)
                        res.push({'name': npc.cityName, 'x': $coordinates.x, 'y': $coordinates.y, 'distance': distance, 'tier': npc.tier})
                    }
                })
                
                $.each(el.playerData, function (idx1, pl){
                    if (pl.score >= userThresholdValue && !pl.flagVacation && !pl.flagInactive && !pl.flagBanned) {
                        var $coordinates = calculateCoordinates(idx, idx1)
                        var distance = calculateDistance(warringCity, $coordinates)
                        res1.push({'name': pl.username, 'cityName': pl.cityName, 'guild': pl.guildTag || '', 'x': $coordinates.x, 'y': $coordinates.y, 'distance': distance, 'score': pl.score})
                    }
                })
            })
            
            res1 = sortByDist(res1)
            var players = ''
            $.each(res1, function(idx2, plr){
                players += plr.y +':'+ plr.x + ' ' + plr.name + ' ('+plr.guild+')' + ' ' + plr.cityName + ' ' + plr.score + ' ' + plr.distance.toFixed(2) + "\n"
            })
            res = sortByDist(res)
            var barbarians = ''
            $.each(res, function(idx2, barb){
                barbarians += '=============> ' + barb.y +':'+ barb.x + ' ' + barb.name + ' ('+barb.tier+')' + ' ' + barb.distance.toFixed(2) + "\n"
            })
            console.log(warringCity)
            //console.log(barbarians)
            if (players)
                console.log(players)
        }
        
        function sortByDist(result)
        {
            if ((result.length)) {
                result.sort(function(a, b){return a.distance > b.distance ? 1 : -1;})
            }

            return result
        }

        function splitAbsoluteCoordinates(absCoords)
        {
            absCoords = String(absCoords)
            var $x = absCoords.substr(0, 3) || 0;
            var $y = absCoords.substr(3) || 0;
            
            return {'x' : parseInt($x), 'y' : parseInt($y)};
        }

        function calculateCoordinates(absoluteCoordinates, position)
        {
            if (!absoluteCoordinates || !position) {
                throw new InvalidArgumentException('Not a valid coordinates');
            }

            var splitAbsoluteCoords = splitAbsoluteCoordinates(absoluteCoordinates);
            var $x = (splitAbsoluteCoords.x) + Math.floor((position)/matrixSize) + 1;
            var $y = (splitAbsoluteCoords.y) + ((position) % matrixSize) + 1;
            return {'y' : $y, 'x' : $x};
        }

        function calculateDistance($cityCoords, $barbCoords)
        {
            return Math.sqrt(Math.pow((($cityCoords.x)-$barbCoords.x), 2) + Math.pow(($cityCoords.y-$barbCoords.y), 2));
        }

        function convertFromAbsToRealCoords(absCoords)
        {
            var splitAbsoluteCoords = splitAbsoluteCoordinates(absCoords)

            return {'x': (splitAbsoluteCoords.x+1), 'y': (splitAbsoluteCoords.y+1)}
        }

        function getCapital()
        {
            return $('.tselectMenu>ul>li')
        }

        function getCapitalCoords()
        {
            var capitalCont = getCapital()

            warringCity = convertFromAbsToRealCoords($(capitalCont[0]).attr('data-position'))

            return warringCity
        }
    }

    function addJS_Node (text, s_URL, funcToRun) {
        var D                                   = document;
        var scriptNode                          = D.createElement ('script');
        scriptNode.type                         = "text/javascript";
        scriptNode.dataset.score                = unsafeWindow.userData.score
        
        if (text)       scriptNode.textContent  = text;
        if (s_URL)      scriptNode.src          = s_URL;
        if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

        var targ    = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
        targ.appendChild (scriptNode);
    }
    
    addJS_Node (null, null, interceptAjax);
})();
