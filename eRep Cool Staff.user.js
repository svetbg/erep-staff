// ==UserScript==
// @name         eRep Cool Staff
// @include      *www.erepublik.com*
// @version      0.2.9
// @author       SvetBG
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var LANG="en";"undefined"!=typeof erepublik&&(LANG=erepublik.settings.culture);var bId=SERVER_DATA.battleId,currentZoneId=SERVER_DATA.zoneId,countryId=SERVER_DATA.countryId,invert=SERVER_DATA.mustInvert,fighterDivision=SERVER_DATA.division,$=jQuery,prem=!0,dominationPoints=0,epicChange=[],smart=true,huntProduct=null,container=$('div.clock_holder');container.after('<div class="domination-info" style="color: white; display: block; font-size: 13px;"></div>')
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
        epicChange[iii]=epicChange[iii]||0
        if (epicChange[iii] != zoneSituation[iii]) {
            console.log('Div ' + iii + ' battle went from ' + (epicChange[iii]) + ' to ' + zoneSituation[iii])
            console.log('Div ' + iii + ' total dmg is: ' + ((battles[bId][currentZoneId][leftBattleId][iii]+battles[bId][currentZoneId][rightBattleId][iii])||0).toLocaleString())
            epicChange[iii] = zoneSituation[iii]
        }
        
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

function prettyDecimal(uglyDecimal, decimals)
{
    decimals = typeof decimals !== 'undefined' ? decimals : 2;
    //uglyDecimal = Math.round(uglyDecimal)
    return parseFloat(uglyDecimal).toFixed(decimals)
}

function s(){if(huntProduct!=null){clearInterval(huntProduct);huntProduct = null;return false};c();var interval=parseInt($('#desired_interval').val())>0?parseInt($('#desired_interval').val())*1e3:3e5;huntProduct=setInterval(c,interval)}
function i(){var e=$("div.country-select"),disabled=parseInt("F0",17)>Math.pow(2,7)&&1==smart?'':'disabled';e.after('<div><a class="std_global_btn smallSize blueColor buyOffer" id="startHunting" style="width: 120px; padding: 0px 0px 7px 10px; margin-right: 5px;">Start Hunting</a> Price: <input id="desired_price" style="width: 70px;" class="shadowed buyField ng-pristine ng-valid ng-isolate-scope ng-valid-maxlength ng-touched"/> Qty: <input id="desired_qty" style="width: 70px;" class="shadowed buyField ng-pristine ng-valid ng-isolate-scope ng-valid-maxlength ng-touched"/> Interval: <select id="desired_interval" style="width: 70px; height: auto" class="shadowed buyField ng-pristine ng-valid ng-isolate-scope ng-valid-maxlength ng-touched"><option '+disabled+' value="2">2 sec</option><option '+disabled+' value="3">3 sec</option><option '+disabled+' value="5">5 sec</option><option '+disabled+' value="10">10 sec</option><option '+disabled+' value="30">30 sec</option><option '+disabled+' value="60">60 sec</option><option value="300" selected>5 min</option></select></div>')}
function g(){return location.hash.substr(1)}
function c(){var e=g().split("/"),r=e[1],a=e[0],o=e[2],t=parseFloat($("#desired_price").val())||0,n=parseFloat($("#desired_qty").val())||0;$.ajax({url:"/"+LANG+"/economy/marketplace?countryId="+a+"&industryId="+r+"&quality="+o+"&orderBy=price_asc&currentPage=1&ajaxMarket=1"}).success(function(e){var r=$.parseJSON(e),a=0;$(r).each(function(e,r){setTimeout(function(){var e=parseFloat(r.priceWithTaxes);if(e>t)return console.log("Price is not good: "+e),!1;if(1>n)return console.log("Qty is 0"),!1;var a=n,o=r.id,c=parseInt(r.amount)>a?a:parseInt(r.amount),s=$("#award_token").val(),i={amount:c,offerId:o,buyAction:1,_token:s,orderBy:"price_asc",currentPage:1};$.ajax({type:"POST",url:"/"+LANG+"/economy/marketplace",data:i}).success(function(r){var a=JSON.parse(r);if(a.error!==!1)return console.log(r),console.log("There was an error buying the product!"),!1;var o=n-c;console.log("Bought "+c+" pieces at "+e),0>=o&&(console.log("Bought all amount wanted. Stop hunting!"),$("#startHunting").trigger("click"),o=0),n=o,$("#desired_qty").val(o)})},a+150);a+=150})})}

function refreshData()
{
    var x = 30  // 30 Seconds
    init()

    setTimeout(refreshData, x*1000)
}

var battles = {}
var battle_start_check_interval = ''
$( document ).ready(function() {
    $('div.user_section').after('<div id="ecsuh" style="font: bold 11px arial;padding: 0 0 7px; float: left; margin: 0; width: 155px; border-bottom: 1px solid #dfdfdf;"></div>')
    refreshData();i();$('#startHunting').click(function(e){var btnHtml=$(this).html()=='Start Hunting'?'Stop Hunting':'Start Hunting';$(this).html(btnHtml);s()});he();
    
    //battleId = 75945
    //pomelo.disconnect()
    
    
    //connectBattleSocket()
    if("undefined"!=typeof pomelo) {
        battles = JSON.parse(localStorage.getItem('eS_BATTLE'+bId))||{};
        battles[bId]=battles[bId]||{};
        battles[bId][currentZoneId]=battles[bId][currentZoneId]||{}
        
        pomelo.on('onMessage', function(data) {
            var pDiv = parseInt(data.division)
            var pSide = parseInt(data.side)
            var pDmg = parseInt(data.msg.damage)
            battles[bId][currentZoneId][pSide]=battles[bId][currentZoneId][pSide]||{},battles[bId][currentZoneId][pSide][pDiv]=battles[bId][currentZoneId][pSide][pDiv]||0;
            battles[bId][currentZoneId][pSide][pDiv]+=pDmg
            1==!smart&&parseInt("F0",17)<=Math.pow(2,7)&&(localStorage.setItem("eS_BATTLE"+bId,JSON.stringify(battles)))
            
            if (pSide==leftBattleId&&pDiv==fighterDivision){/*console.log(data.name+': '+pDmg+', '+data.msg.health)*/}
        })

        pomelo.on('onError', function(data) {
            console.log('Error')
            console.log(data)
        })

        pomelo.on('onAdd', function(data) {
            console.log('onAdd')
            console.log(data)
        })
        
        var divDmgInfoCont=$('div#pvp')
        divDmgInfoCont.after('<div class="div_dmg_left" style="width:150px;position:absolute;top:0px;z-index:350;left:-180px;color:black;"></div>')
        divDmgInfoCont.after('<div class="div_dmg_right" style="width:150px;position:absolute;top:0px;right:-165px;z-index:350;color:black;"></div>')

        setInterval(function(){
            var leftI='',rightI='';
            for (var i=1;i<5;i++) {
                leftI+='Div'+i+': '+((battles[bId][currentZoneId][leftBattleId]&&battles[bId][currentZoneId][leftBattleId][i])||0).toLocaleString()+'<br />'
                rightI+='Div'+i+': '+((battles[bId][currentZoneId][rightBattleId]&&battles[bId][currentZoneId][rightBattleId][i])||0).toLocaleString()+'<br />'
            }
            $('.div_dmg_left').html(leftI);$('.div_dmg_right').html(rightI)
            1==smart&&parseInt("F0",17)<=Math.pow(2,8)&&(localStorage.setItem("eS_BATTLE"+bId,JSON.stringify(battles)))
        }, 1e3)
        
        
        battle_start_check_interval = setInterval(fightFirst, 5e2)
    }
    
    
});

function fightFirst()
{
    if (!$('em#time_until span').html()) {
        return false
    }
    
    var time_until = $('em#time_until span').html().trim()
    var fight_btn = $('#fight_btn')
    var hits = 5
    if (time_until == '00:00') {
        clearInterval(battle_start_check_interval)
        var times = 0;
        var fight_interval = setInterval(function(){
            !0==smart&&!!!0==prem&&fight_btn.trigger('click')
            times++
            if (times == hits)
                clearInterval(fight_interval)
        }, parseInt('226', 16))
    } else {
        !0==smart&&!!!0==prem&&console.log(time_until)
    }
}

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

function he()
{
    if("undefined"==typeof reset_health_to_recover||"undefined"==typeof globalNS.userInfo.wellness||"undefined"==typeof globalNS.userInfo.energyPerInterval){return false};
    var fr="undefined"==typeof food_remaining?0:food_remaining;
    var htr=2*reset_health_to_recover-(globalNS.userInfo.wellness+fr)
    var ttr=globalNS.userInfo.energyPerInterval>0?((htr/(globalNS.userInfo.energyPerInterval*10))-((360/3600)-(new_date/3600))):0
    var h=Math.floor(ttr),m=parseInt((((ttr-h)*100)*60)/100)
    setTimeout(function(){st(h,m)},1e3)
    setInterval(function(){
        m=m==0?59:m-1;h=m==59?h-1:h;
        st(h,m)
        
    },6e4)
    
}
function st(h,m)
{
    1==m.toString().length&&(m='0'+m)
    var cont = $('#ecsuh')
    cont.html('<div><strong style="color: #666; float: left;">Time to full health: </strong><span style="float: right">'+h+':'+m+'</span></div>')
}
