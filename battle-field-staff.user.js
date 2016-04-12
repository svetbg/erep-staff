// ==UserScript==
// @name         Battle Field Staff
// @include      *www.erepublik.com*
// @version      0.1.7
// @author       SvetBG
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var LANG = 'en'
if (typeof erepublik != "undefined") {
    LANG = erepublik.settings.culture
}
var bId = SERVER_DATA.battleId
var currentZoneId = SERVER_DATA.zoneId
var countryId = SERVER_DATA.countryId, invert = SERVER_DATA.mustInvert, fighterDivision = SERVER_DATA.division
var $ = jQuery
var dominationPoints = 0
var huntProduct = null

var container = $('div.clock_holder')
container.after('<div class="domination-info" style="color: white; display: block; font-size: 13px;"></div>')

function init()
{    
    if (!bId) {
        //console.log('Not on a battle page!')
        return false
    }
    
    $.ajax({
            url: "/" + LANG + "/military/nbp-stats/" + bId + "/2",
        })
        .success(function(t) {
            parseBattleInfo(t)
        })
}

function getRegion()
{
    return $('a#region_name_link').html()
}

function setTitle(currDomination)
{
    document.title = currDomination + ' | ' + getRegion()
}

function getDominationPoints()
{
    return dominationPoints
}

function setDominationPoints(domPoints)
{
    dominationPoints = domPoints
}

function parseBattleInfo(t)
{
    var res = jQuery.parseJSON(t)
    if (res === undefined || res.stats === undefined) {
        console.log('No stats!')
        return false;
    }
    
    var current = res.stats.current
    
    if (!current) {
        console.log('No stats!')
        return false;
    }
    
    var division = res.division
    
    var domination = division.domination
    var zoneSituation = res.battle_zone_situation
    
    var leftDomPoints = [], rightDomPoints = [], div = [], color = []
    
    // prepare each division domination and each side current points
    for (var iii = 1; iii < 5; iii++) {
        var dominationInfo = parseFloat(domination[iii]).toFixed(2)
        
        if (!invert) {
            leftDomPoints[iii] = dominationInfo
            rightDomPoints[iii] = prettyDecimal(100 - dominationInfo)
        } else {
            leftDomPoints[iii] = prettyDecimal(100 - dominationInfo)
            rightDomPoints[iii] = dominationInfo
        }
        
        var red = '#FC4444'
        var blue = '#5178ED'
        var dominationColor = prettyDecimal(leftDomPoints[iii], 2) > 50 ? blue : red
        var epic = zoneSituation[iii] == 2 ? '#EEC164' : (zoneSituation[iii] == 1 ? '#90744F' : '')
        
        div[iii] = '<strong style="padding: 2px 0 2px 2px; border-right: 1px solid white; text-align: left; width: 33%; display: inline-block; color: '+blue+'">'+division[leftBattleId][iii]['domination'] + 
            '</strong>  <i style="padding: 2px 0; width: 17%; display: inline-block; text-align: center; font-size: 11px; font-weight: 900; color: '+dominationColor+'; background-color: ' + epic + '">' + prettyDecimal(leftDomPoints[iii], 0) + 
            '</i>  <strong style="padding: 2px 2px 2px 0; border-left: 1px solid white; text-align: right; width: 33%; display: inline-block; color: '+red+'">' + division[rightBattleId][iii]['domination'] + '</strong>'
    }
    
    //setDominationPoints(leftDomPoints[fighterDivision])
    $(document).prop('title', leftDomPoints[fighterDivision] + ' | ' + getRegion())
    //document.title = leftDomPoints[fighterDivision] + ' | ' + getRegion()
    
    // build the html to be appended to the battle field view
    var dominationHtml = ''
    var left = 0
    var right = 0
    var elongationHorizontal = 115
    var elongationVertical = 30
    var divWidth = 110
    $(div).each(function(dominationInfoIdx, dominationInfo){
        if (dominationInfoIdx < 1) return true
        
        var backgroundColor = 
            (parseInt(division[leftBattleId][dominationInfoIdx]['domination']) >= 1800 || parseInt(division[rightBattleId][dominationInfoIdx]['domination']) >= 1800) ? ' background-color: #979EA1; ' : ''
        
        if (dominationInfoIdx < 3) {
            left = (dominationInfoIdx-1) * elongationHorizontal
            dominationHtml += '<div class="div_'+dominationInfoIdx+'" style="position: absolute; left: '+left+'px; top: '+elongationVertical+'px; border: 1px solid white; width: '+divWidth+'px;'+backgroundColor+'; border-radius: 3px;">' + dominationInfo + '</div>'
        } else if (dominationInfoIdx > 2) {
            right = Math.abs(dominationInfoIdx - 4) * elongationHorizontal
            dominationHtml += '<div class="div_'+dominationInfoIdx+'" style="position: absolute; right: '+right+'px; top: '+elongationVertical+'px; border: 1px solid white; width: '+divWidth+'px;'+backgroundColor+'; border-radius: 3px;">' + dominationInfo + '</div>'
        }
        
    })
    dominationHtml += '<div style="clear: both"><!-- need --></div>'
    $('div.domination-info').fadeOut('fast')
    $('div.domination-info').html(dominationHtml)    
    $('div.domination-info').fadeIn('fast')
}

function prettyDecimal(uglyDecimal, decimals = 2)
{
    //uglyDecimal = Math.round(uglyDecimal)
    return parseFloat(uglyDecimal).toFixed(decimals)
}

function startHuntingProduct()
{
    if (huntProduct != null) {
        clearInterval(huntProduct)
        huntProduct = null
        return false
    }
    
    checkWRM()
    var interval = parseInt($('#desired_interval').val()) > 0 ? parseInt($('#desired_interval').val()) * 1e3 : 1e4 
    huntProduct = setInterval(checkWRM, interval)
}

function improveMarket()
{
    var countrySelect = $('div.country-select')
    countrySelect.after('<div><a class="std_global_btn smallSize blueColor buyOffer" id="startHunting" style="width: 120px; padding: 0px 0px 7px 10px; margin-right: 5px;">Start Hunting</a> '
                        +'Price: <input id="desired_price" style="width: 70px;" class="shadowed buyField ng-pristine ng-valid ng-isolate-scope ng-valid-maxlength ng-touched"/> '
                        +'Qty: <input id="desired_qty" style="width: 70px;" class="shadowed buyField ng-pristine ng-valid ng-isolate-scope ng-valid-maxlength ng-touched"/> '
                        +'Interval: <select id="desired_interval" style="width: 70px; height: auto" class="shadowed buyField ng-pristine ng-valid ng-isolate-scope ng-valid-maxlength ng-touched">'
                        +'<option value="3">3 sec</option><option value="5">5 sec</option><option value="10">10 sec</option><option value="30">30 sec</option></select></div>')
}

function getHashInfo()
{
    return location.hash.substr(1)
}
    

function checkWRM()
{
    var hashInfo = getHashInfo().split('/')
    var currentIndustryId = hashInfo[1]
    var currentCountryId = hashInfo[0]
    var qualityId = hashInfo[2]
    
    $.ajax({
            url: "/" + LANG + "/economy/marketplace?countryId="+currentCountryId+"&industryId="+currentIndustryId+"&quality="+qualityId+"&orderBy=price_asc&currentPage=1&ajaxMarket=1",
        })
        .success(function(p) {
            var offers = jQuery.parseJSON(p)
            var timeout = 0
            $(offers).each(function(id, offer) {
                var timer = setTimeout(function() {
                    var pricer = parseFloat(offer.priceWithTaxes)
                    var desired_price = parseFloat($('#desired_price').val()) || 0
                    var desired_qty = parseFloat($('#desired_qty').val()) || 0

                    // Stop loop if the price is not good
                    if (pricer > desired_price) {
                        console.log('Price is not good: ' + pricer)
                        return false
                    }

                    if (desired_qty < 1) {
                        console.log('Qty is 0')
                        return false
                    }

                    var allowedAmount = desired_qty
                    var offerId = offer.id
                    var amount = parseInt(offer.amount) > allowedAmount ? allowedAmount : parseInt(offer.amount)
                    var buyAction = 1
                    var token = $('#award_token').val()
                    var data = {'amount': amount, 'offerId': offerId, 'buyAction': 1, '_token': token, 'orderBy': 'price_asc', 'currentPage': 1}

                    $.ajax({
                        type: "POST",
                        url: "/" + LANG + "/economy/marketplace",
                        data: data
                    })
                        .success(function(r) {
                        var updateQty = desired_qty - amount
                        console.log('Bought ' + amount + ' pieces at ' + pricer)
                        if (updateQty <= 0) {
                            console.log('Bought all amount wanted. Stop hunting!')
                            $('#startHunting').trigger('click')
                            updateQty = 0
                        }
                        $('#desired_qty').val(updateQty)
                    })
                }, timeout + 200)
                timeout += 200
            })
        })
    
}

function refreshData()
{
    var x = 30  // 30 Seconds
    init()

    setTimeout(refreshData, x*1000)
}

$( document ).ready(function() {
    refreshData()
    improveMarket()
    
    $('#startHunting').click(function(e){
        var btnHtml = $(this).html() == 'Start Hunting' ? 'Stop Hunting' : 'Start Hunting'        
        $(this).html(btnHtml)
        
        startHuntingProduct()
    })
    
    //battleId = 75945
    //pomelo.disconnect()
    var battles = {};battles[bId]=battles[bId]||{};battles[bId][currentZoneId]=battles[bId][currentZoneId]||{}
    setTimeout(function() {
        //connectBattleSocket()
        if("undefined"!=typeof pomelo) {
            pomelo.on('onMessage', function(data) {
                var pDiv = parseInt(data.division)
                var pSide = parseInt(data.side)
                var pDmg = parseInt(data.msg.damage)
                battles[bId][currentZoneId][pSide]=battles[bId][currentZoneId][pSide]||{},battles[bId][currentZoneId][pSide][pDiv]=battles[bId][currentZoneId][pSide][pDiv]||0;
                battles[bId][currentZoneId][pSide][pDiv]+=pDmg
                
                if (pSide==leftBattleId&&pDiv==fighterDivision){console.log(data.name+': '+pDmg)}
            })

            pomelo.on('onError', function(data) {
                console.log('Error')
                console.log(data)
            })

            pomelo.on('onAdd', function(data) {
                console.log('onAdd')
                console.log(data)
            })
        }
    }, 1)
});

/*
var target = document.querySelector('head > title');
var observer = new window.WebKitMutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log('new title:', mutation.target.textContent);
        console.log(mutation)
    });
});
observer.observe(target, { subtree: true, characterData: true, childList: true });
*/
function getBlueDomination()
{
    return $('#blue_domination').val()
}
