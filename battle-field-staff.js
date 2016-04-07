// ==UserScript==
// @name         Battle Field Staff
// @include      *www.erepublik.com/*/military/battlefield-new/*
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var LANG = erepublik.settings.culture
var bId = SERVER_DATA.battleId
var currentZoneId = SERVER_DATA.zoneId
var countryId = SERVER_DATA.countryId, invert = SERVER_DATA.mustInvert, fighterDivision = SERVER_DATA.division
var $ = jQuery
var previousDomination = 0

var container = $('div.clock_holder')
container.after('<div class="domination-info" style="color: white; display: block; font-size: 13px;"></div>')

function init()
{
    if (!bId) {
        console.log('Not on a battle page!')
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

function parseBattleInfo(t)
{
    var res = jQuery.parseJSON(t)
    if (res == undefined || res.stats == undefined) {
        console.log('No stats!')
        return false;
    }
    
    var current = res.stats.current
    
    if (!current) {
        console.log('No stats!')
        return false;
    }
    
    updateTop5(current)
    
    var division = res.division
    
    var domination = division.domination
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
        var blue = '#67BEDB'
        var dominationColor = prettyDecimal(leftDomPoints[iii], 0) > 50 ? blue : red
        
        div[iii] = '<strong style="padding: 2px 0 2px 2px; border-right: 1px solid white; text-align: left; width: 33%; display: inline-block; color: '+blue+'">'+division[leftBattleId][iii]['domination'] + 
            '</strong>  <i style="padding: 2px 0; width: 17%; display: inline-block; text-align: center; font-size: 11px; font-weight: 900; color: '+dominationColor+'">' + prettyDecimal(leftDomPoints[iii], 0) + 
            '</i>  <strong style="padding: 2px 2px 2px 0; border-left: 1px solid white; text-align: right; width: 33%; display: inline-block; color: '+red+'">' + division[rightBattleId][iii]['domination'] + '</strong>'
    }
    
    document.title = leftDomPoints[fighterDivision] + ' | ' + getRegion()
    
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
            dominationHtml += '<div class="div_'+dominationInfoIdx+'" style="position: absolute; left: '+left+'px; top: '+elongationVertical+'px; border: 1px solid white; width: '+divWidth+'px;'+backgroundColor+'">' + dominationInfo + '</div>'
        } else if (dominationInfoIdx > 2) {
            right = Math.abs(dominationInfoIdx - 4) * elongationHorizontal
            dominationHtml += '<div class="div_'+dominationInfoIdx+'" style="position: absolute; right: '+right+'px; top: '+elongationVertical+'px; border: 1px solid white; width: '+divWidth+'px;'+backgroundColor+'">' + dominationInfo + '</div>'
        }
        
    })
    dominationHtml += '<div style="clear: both"><!-- need --></div>'
    $('div.domination-info').fadeOut('fast')
    $('div.domination-info').html(dominationHtml)    
    $('div.domination-info').fadeIn('fast')
}

function updateTop5(current)
{
    //console.log(battleStats.getBattleStats())
    //console.log(current[currentZoneId])
    var currDiv = $('#eRS_division').val()
    
}

function prettyDecimal(uglyDecimal, decimals = 2)
{
    //uglyDecimal = Math.round(uglyDecimal)
    return parseFloat(uglyDecimal).toFixed(decimals)
}

function refreshData()
{
    var x = 30  // 5 Seconds
    init()
    // Do your thing here

    setTimeout(refreshData, x*1000)
}

$( document ).ready(function() {
    refreshData()
    //setInterval(init, 30000)
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

