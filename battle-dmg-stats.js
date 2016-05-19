// ==UserScript==
// @name         BattleDmgStats
// @include      *www.erepublik.com*
// @version      0.1
// @description  BattleDmgStats
// @author       SvetBG
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var battles = {},battle_start_check_interval = '',smart=0,bId=SERVER_DATA.battleId,currentZoneId=SERVER_DATA.zoneId,countryId=SERVER_DATA.countryId,fighterDivision=SERVER_DATA.division,$=jQuery
    
    $( document ).ready(function() {
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
        }
    });
})();
