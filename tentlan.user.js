// ==UserScript==
// @name         Tentlan
// @include      *bg*.tentlan.com/overview*
// @version      1.3.1
// @description  Overview Improvements
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @author       Anonymous
// @grant        GM_xmlhttpRequest
// @connect      www.fiong.com
// ==/UserScript==

function style(t) {
    $("head").append("<style>" + t + "</style>")
}

(function() {
    'use strict';
    style("select {display:table-cell;}");
    
    var coordsLookup = ["440440", "460440", "480440", "440460", "460460", "480460", "440480", "460480", "480480", 460500, 460420, 420460, 500460]
    //var coordsLookup = []
    var barbsLvlLookup = 9, autoGetCapitalCoords = true
    var warringCity = {'x': 419, 'y': 558}
    
    var urlParams=[],cityId=0
    var sec=1e3, notified=false,workDuration=[600,3600,14400,28800], workChoice=1, today=new Date(),problemBuildings=[]
    var workChoicePerBld=[],autoCloseNotifications=true
    workChoicePerBld['CornFarm']=1
    //workChoicePerBld['CacaoPlantation']=1
    var wait = 6*sec,notificationCount=0,resourceBldsInterval=false,bkg='#ccc'
    
    var AlarmUrl = 'data:audio/ogg;base64,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MsYYY85BCJ1zjjHnIITQOceYcxBC55xjzDkIoXOMMeacAACgAgcAgAAbRTYnGAkqNGQlABAOAAAYw5hzjDkGnYQKIecgdA5CKqlUCDkHoXMQSkmpeA46KSGUUkoqxXMQSgmhlJRaKy6GUkoopaTUUpExhFJKKSWl1ooxpoSQUkqptVaMMaGEVFJKKbZijI2lpNRaa60VY2wsJZXWWmutGGOMaym1FmOsxRhjXEuppRhrLMYY43tqLcZYYzHGGJ9baimmXAsAMHlwAIBKsHGGlaSzwtHgQkNWAgC5AQAIQkoxxphjzjnnnHPOSaUYc8455yCEEEIIIZRKMeacc85BByGEEEIoGXPOOQchhBBCCCGEUFLqmHMOQgghhBBCCCGl1DnnIIQQQgghhBBCSqlzzkEIIYQQQgghhJRSCCGEEEIIIYQQQggppZRCCCGEEEIIIZQSUkophRBCCCWEEkoIJaSUUgohhBBCKaWEUkJJKaUUQgillFBKKaGUkFJKKaUQQiillFBKKSWllFJKJZRSSikllFBKSimllEoooZRQSimllJRSSimVUkopJZRSSgkppZRSSqmUUkoppZRSUkoppZRSKaWUUkoppaSUUkoppVJKKaWUEkpJKaWUUkqllFBKKaWUUlJKKaWUSgqllFJKKaUAAKADBwCAACMqLcROM648AkcUMkxAhYasBABSAQAAQiillFJKKTWMUUoppZRSihyklFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKAcDdFw6APhM2rI5wUjQWWGjISgAgFQAAMIYxxphyzjmllHPOOQadlEgp5yB0TkopPYQQQgidhJR6ByGEEEIpKfUYQyghlJRS67GGTjoIpbTUaw8hhJRaaqn3HjKoKKWSUu89tVBSainG3ntLJbPSWmu9595LKinG2nrvObeSUkwtFgBgEuEAgLhgw+oIJ0VjgYWGrAIAYgAACEMMQkgppZRSSinGGGOMMcYYY4wxxhhjjDHGGGOMMQEAgAkOAAABVrArs7Rqo7ipk7zog8AndMRmZMilVMzkRNAjNdRiJdihFdzgBWChISsBADIAAMRRrDXGXitiGISSaiwNQYxBibllxijlJObWKaWU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'
    var snd = new Audio(AlarmUrl)
    
    function parseUrl()
    {
        var urlParts = location.pathname.split('/')
        
        return urlParts
    }
    
    function print(msg, color, background, bold)
    {
        var background=background==undefined?'white':background
        var color=color==undefined?'black':color
        var bold=bold==undefined?'normal':bold
        
        console.log(getTime()+' %c'+msg, 'background: '+background+'; color: '+color+'; font-weight: '+bold)
    }
    
    function getTime()
    {
        var now = new Date()
        
        return now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+'.'+now.getMilliseconds()
    }
    
    function allowResourceCheck()
    {
        var urlParts = parseUrl()
        if (urlParts.indexOf('overview') == -1) {
            print('Not on city page, skipping...', 'red', bkg, 'bold')
            return false
        }
        
        if (resourceHarvestInProcess) {
            print('Harvesting in process, skipping...', 'red', bkg, 'bold')
            return false
        }
        
        return !isOpenDialog()
    }
    
    function isOpenDialog()
    {
        var dialog = $('div#dialogContainer')
        if (dialog.html()) {
            print('There is an open dialog already, skipping...', 'red', bkg, 'bold')
        }
        
        return dialog.html()
    }
    
    function getRdyForCollectBlds()
    {
        var bildingsForHarvest = $('div.productionDoneIcon:visible').parent()
        var rdyResourceBuildings = []
        $(bildingsForHarvest).each(function(k1, v1){
            rdyResourceBuildings.push($(v1).attr('data-building'))
        })
        
        return rdyResourceBuildings
    }
    
    var fullCheck = []
    function isFullCheck(cityId)
    {
        var now = new Date().getTime()
        var randomNumber = generateRandomNumber(5,7)
        
        return false
        
        if (fullCheck[cityId] == undefined) {
            fullCheck[cityId] = now
        }
        
        var diff = (now - fullCheck[cityId])
        print('cityId: '+cityId+', diff: '+diff)
        if ( (now - fullCheck[cityId]) > randomNumber*60*sec ) {
            fullCheck[cityId] = now
            return true
        }
        
        return false
    }
    
    function collect(building, dialog)
    {
        var dfd = $.Deferred(), collected=false
        
        setTimeout(function(){
            var harvestBtn = dialog.find('button.resProductionProgressCollectButton:visible')
            print('Building '+building+' ready for collection: ' + harvestBtn.length)
            if (harvestBtn.length) {
                print('Try to harvest production')
                collected = naturalClick(harvestBtn[0])
            }
            
            dfd.resolve()
        }, sec)
        
        return dfd.promise()
    }
    
    function startProduction(building, dialog)
    {
        var dfd = $.Deferred(), progressStarted=false
        var work = 0
        work = workChoicePerBld[building] !== undefined?workChoicePerBld[building]:workChoice
        
        setTimeout(function(){
            var startProgressBtn = dialog.find('button.resProductionSelectButton[data-originalduration="'+workDuration[work]+'"]:visible')
            print('Try to start new production for building: '+building+' - '+startProgressBtn.length)
            if (startProgressBtn.length == 1) {
                progressStarted = naturalClick(startProgressBtn[0])
            }
            
            if ( !(startProgressBtn.length == 1 && progressStarted) && startProgressBtn.length) {
                console.log('=================> Setting problem building: '+building+' for city: '+cityId)
                problemBuildings[cityId]=problemBuildings[cityId]||[]
                problemBuildings[cityId].indexOf(building)==-1&&problemBuildings[cityId].push(building)
            }
            
            dfd.resolve()
        }, 2*sec)

        return dfd.promise()
    }
    
    var resourceBuildings = ['ObsidianMine', 'Quarry', 'CornFarm', 'CacaoPlantation']
    var resourceHarvestInProcess = false
    function harvestAction(building)
    {
        var dfd = $.Deferred()
        var dialog = $('#'+building+'Window').parent().parent()
        
        var async1 = $.when( collect(building, dialog) ).then(function(){ return startProduction(building, dialog); });
        
        $.when(async1).then(function(){
            setTimeout(function(){
                print('Closing modal.', 'green', bkg, 'bold')
                if (building == resourceBuildings[resourceBuildings.length-1]) {
                    resourceHarvestInProcess = false
                    print('Stopping the harvest process.', 'green', bkg, 'bold')
                }
                dialog.find('.wclose').trigger('click')
                dfd.resolve()
            }, 500)
        })
        
        return dfd.promise()
    }
    
    var bIndex = 0
    function checkResourceBuildings()
    {
        cityId=parseInt($('#citySelectorValue').val())
        if (!cityId) {
            return false
        }
        
        if (isOpenDialog()) {
            return false
        }
        
        var forFullCheck = isFullCheck(cityId)
        var onlyForHarvestBlds = getRdyForCollectBlds()
        
        print('Check for harvesting started, fullCheck: '+forFullCheck, 'yellow', bkg, 'bold')
        
        // @TODO: remove below code when obsolete
        resourceBuildings = ['ObsidianMine', 'Quarry', 'CornFarm', 'CacaoPlantation']
        if (forFullCheck) {
            $(resourceBuildings).each(function(k, v){
                if (onlyForHarvestBlds.indexOf(v) == -1) {
                    onlyForHarvestBlds.push(v)
                }
            })
        }
        
        resourceBuildings = onlyForHarvestBlds
        if (problemBuildings[cityId] && problemBuildings[cityId].length > 0) {
            for (var i=0; i<problemBuildings[cityId].length; ++i) {
                if (resourceBuildings.indexOf(problemBuildings[cityId][i]) == -1) {
                    resourceBuildings.push(problemBuildings[cityId][i])
                    problemBuildings[cityId].splice(i, 1)
                }
            }
        }
        
        if (!resourceBuildings.length) {
            resourceHarvestInProcess=false
            print('Harvesting ended (quick)', 'green', bkg, 'bold')
            return false
        }
        
        resourceHarvestInProcess = true
        bIndex=0
        resourceLoop(forFullCheck)
    }
    
    function loadResourceBuilding(forFullCheck)
    {
        var dfd = $.Deferred();
        var v = resourceBuildings[bIndex]
        
        print('Trying to harvest '+v)
        var harvest = $('div[data-building="'+v+'"] > div.productionDoneIcon:visible').length
        print('====== harvest '+harvest)
        if (harvest == 1 || forFullCheck) {
            setTimeout(function() {
                var area = $('area[data-building="'+v+'"]')
                area.trigger('click')
                //naturalClick(area[0])
            }, 0.5*sec)

            setTimeout(function(){
                $.when(harvestAction(v)).then(function(){dfd.resolve()})
            }, sec)
        } else {
            dfd.resolve()
        }
        
        return dfd.promise()
    }
    
    function resourceLoop(forFullCheck)
    {
        if (bIndex<resourceBuildings.length) {
            print('Start resource loop: '+bIndex)
            $.when( loadResourceBuilding(forFullCheck) ).then(function(){
                bIndex++
                setTimeout(function(){resourceLoop(forFullCheck)}, sec)
            });
        } else {
            print('End resource loop: '+bIndex)
            if (resourceHarvestInProcess) {
                resourceHarvestInProcess = false
                print('Stopping the harvest process.', 'green', bkg, 'bold')
            }
        }
    }
    
    function checkNotifications()
    {
        var notifications = $('div#menuLinkNotifications div#unreadNotificationsCounter:visible')
        
        if (notifications.length > 0) {
            var currentNoticationCount = parseInt(notifications[0].innerText)
            print('Checking notifications: '+(currentNoticationCount-notificationCount))

            if (currentNoticationCount > notificationCount) {
                snd.play()
                notificationCount+=currentNoticationCount
            }
        } else {
            print('Setting notificationCount to 0.')
            notificationCount = 0
        }
    }
    
    function checkproductionColoIconsContainer()
    {
        var prodColoCont = $('div#productionColoIconsContainer > div.productionColoIcon:visible')
        
        if (prodColoCont.length) {
            clearInterval(resourceBldsInterval)
            setTimeout(function() {$(prodColoCont[0]).trigger('click')}, 0.5*sec)
            setTimeout(function() {checkResourceBuildings()}, 2*sec)
            resourceBldsInterval = setInterval(function(){
                if (!allowResourceCheck()) {
                    return false
                }
                resourceHarvestInProcess=true
                checkResourceBuildings()
            }, 17*sec)
        } else {
            print('No resources rdy in other cities!', 'green', bkg, 'bold')
        }
    }
    
    function checkForBarbs(level)
    {
        if (level === undefined) level = barbsLvlLookup
        if (coordsLookup.length == 0) coordsLookup = generateRegions()
        
        $.post('/rest/getmapmeta', {'metaTiles[]': coordsLookup}, function () {
            //console.log ('jQuery.post worked');
        } )
            .done ( function (respObj) {
            var res = []
            console.log('warringCity', warringCity, coordsLookup)
            $.each(respObj, function(idx, el){
                $.each(el.npcData, function (idx1, npc){
                    if (npc.tier == level) {
                        var $coordinates = calculateCoordinates(idx, idx1)
                        var distance = calculateDistance(warringCity, $coordinates)
                        res.push({'name': npc.cityName, 'x': $coordinates.x, 'y': $coordinates.y, 'distance': distance, 'tier': npc.tier})
                    }
                })
            })
            res = sortByDist(res)
            var infoText = ''
            $.each(res, function(idx2, barb){
                infoText += barb.y +':'+ barb.x + ' ' + barb.name + ' ('+barb.tier+')' + ' ' + barb.distance.toFixed(2) + "\n"
            })
            console.log(infoText)
        } )
        
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
        var $x = absCoords.substr(0, 3);
        var $y = absCoords.substr(3);

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
    
    var matrixSize = 20
    function generateRegions()
    {
        var root = getRootRegion()
        var leftX = root.x-matrixSize
        var rightX = root.x+matrixSize
        var upperY = root.y-matrixSize
        var lowerY = root.y+matrixSize
        
        return [leftX+''+upperY, root.x+''+upperY, rightX+''+upperY, leftX+''+root.y, root.x+''+root.y, rightX+''+root.y, leftX+''+lowerY, root.x+''+lowerY, rightX+''+lowerY]
    }
    
    function getRootRegion()
    {
        var rootX = Math.floor(warringCity.x/matrixSize) * matrixSize
        var rootY = Math.floor(warringCity.y/matrixSize) * matrixSize
        
        return {'x': rootX, 'y': rootY}
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
    
    function improveSettings()
    {
        $('div#tutorialIconsContainer').after("<div id=\"findBarbs\" class=\"barbCounterSprite barbIcon\" style=\"position:fixed; left: 30px; top: 350px; cursor: pointer; border: 2px solid white;\"></div>")
    }
    
    $( document ).ready(function() {
        
        var random_number = generateRandomNumber(5, 10)
        //print('The page will refresh in '+random_number+' minutes')
        setTimeout(function(){
            //window.location.href='/overview'
        }, random_number*sec*60)
        
        improveSettings()
        
        $('#findBarbs').on('click', function(){
            if (autoGetCapitalCoords) {
                getCapitalCoords()
            }
            checkForBarbs()
        })
        
        
        checkResourceBuildings()
        resourceBldsInterval = setInterval(function(){
            if (!allowResourceCheck()) {
                return false
            }
            resourceHarvestInProcess=true
            checkResourceBuildings()
        }, 17*sec)
        
        setInterval(function(){
            if (!allowResourceCheck()) {
                return false
            }
            checkproductionColoIconsContainer()
        }, 14*sec)
        
        setInterval(checkNotifications, 60*sec)
        
    })
    
    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
    
    function naturalClick(node)
    {
        triggerMouseEvent (node, "mouseover");
        triggerMouseEvent (node, "mousedown");
        triggerMouseEvent (node, "click");
        triggerMouseEvent (node, "mouseup");
        
        return true
    }
    
    function generateRandomNumber(start, end)
    {
        start=start==undefined?0:start
        end=end==undefined?0:end
        
        return Math.floor(Math.random()*(end-start+1)+start)
    }
    var vis = (function(){
        var stateKey, eventKey, keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        };
        for (stateKey in keys) {
            if (stateKey in document) {
                eventKey = keys[stateKey];
                break;
            }
        }
        return function(c) {
            if (c) document.addEventListener(eventKey, c);
            return !document[stateKey];
        }
    })();
    
    var myListener = function () {
        document.removeEventListener('mousemove', myListener, false);
        //print('Mousemove')
    };

    document.addEventListener('mousemove', myListener, false);
})()
