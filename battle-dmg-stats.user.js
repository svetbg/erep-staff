// ==UserScript==
// @name         BattleDmgStats
// @include      *www.erepublik.com*
// @version      0.5.1
// @description  BattleDmgStats
// @author       SvetBG
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var battles = {},battle_start_check_interval = '',smart=1,bId=SERVER_DATA.battleId,currentZoneId=SERVER_DATA.zoneId,countryId=SERVER_DATA.countryId,fighterDivision=SERVER_DATA.division,$=jQuery
    var leftBattleId=SERVER_DATA.leftBattleId,rightBattleId=SERVER_DATA.rightBattleId,players={}
    
    $( document ).ready(function() {
        //battleId = 75945
        //pomelo.disconnect()

        //connectBattleSocket()
        if("undefined"!=typeof pomelo) {
            battles = JSON.parse(localStorage.getItem('eS_BATTLE'+bId))||{};
            battles[bId]=battles[bId]||{};
            battles[bId][currentZoneId]=battles[bId][currentZoneId]||{}
            players = JSON.parse(localStorage.getItem('eS_BATLEPLAYERS'+bId))||{};
            players[bId]=players[bId]||{}
            players[bId][currentZoneId]=players[bId][currentZoneId]||{}

            pomelo.on('onMessage', function(data) {
                var pDiv = parseInt(data.division)==11?1:parseInt(data.division)
                var pSide = parseInt(data.side)
                var pDmg = parseInt(data.msg.damage)
                var playerId = parseInt(data.msg.citizenId)
                battles[bId][currentZoneId][pSide]=battles[bId][currentZoneId][pSide]||{},battles[bId][currentZoneId][pSide][pDiv]=battles[bId][currentZoneId][pSide][pDiv]||0;
                players[bId][currentZoneId][pSide]=players[bId][currentZoneId][pSide]||{},players[bId][currentZoneId][pSide][pDiv]=players[bId][currentZoneId][pSide][pDiv]||{},players[bId][currentZoneId][pSide][pDiv][playerId]=players[bId][currentZoneId][pSide][pDiv][playerId]||0;
                battles[bId][currentZoneId][pSide][pDiv]+=pDmg
                players[bId][currentZoneId][pSide][pDiv][playerId]+=pDmg
                
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

            var divDmgInfoCont=$('div#pvp').after('<div class="div_dmg_stats" style="width:100%;position:relative;top:0px;left:0px;z-index:350;color:black;"></div>')
            divDmgInfoCont.after('<div class="div_dmg_right" style="float: right;"></div>')
            divDmgInfoCont.after('<div class="div_dmg_left" style="float: left"></div>')
            
            
            setInterval(function(){
                var leftI='',rightI='';
                var total_left_players=0,total_right_players=0;
                for (var i=1;i<5;i++) {
                    total_left_players+=parseInt((players[bId][currentZoneId][leftBattleId]&&players[bId][currentZoneId][leftBattleId][i]&&Object.keys(players[bId][currentZoneId][leftBattleId][i]).length)||0)
                    total_right_players+=parseInt((players[bId][currentZoneId][rightBattleId]&&players[bId][currentZoneId][rightBattleId][i]&&Object.keys(players[bId][currentZoneId][rightBattleId][i]).length)||0)
                    leftI+='Div'+i+': '+((battles[bId][currentZoneId][leftBattleId]&&battles[bId][currentZoneId][leftBattleId][i])||0).toLocaleString()+' ('+((players[bId][currentZoneId][leftBattleId]&&players[bId][currentZoneId][leftBattleId][i]&&Object.keys(players[bId][currentZoneId][leftBattleId][i]).length)||0)+')<br />'
                    rightI+='Div'+i+': '+((battles[bId][currentZoneId][rightBattleId]&&battles[bId][currentZoneId][rightBattleId][i])||0).toLocaleString()+' ('+((players[bId][currentZoneId][rightBattleId]&&players[bId][currentZoneId][rightBattleId][i]&&Object.keys(players[bId][currentZoneId][rightBattleId][i]).length)||0)+')<br />'
                }
                leftI+=total_left_players;rightI+=total_right_players;              
                $('.div_dmg_left').html(leftI);$('.div_dmg_right').html(rightI)
                1==smart&&parseInt("F0",17)<=Math.pow(2,8)&&(localStorage.setItem("eS_BATTLE"+bId,JSON.stringify(battles)))
                1==smart&&parseInt("F0",17)<=Math.pow(2,8)&&(localStorage.setItem("eS_BATLEPLAYERS"+bId,JSON.stringify(players)))
            }, 1e3)
        }
    });
})();
