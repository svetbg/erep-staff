// ==UserScript==
// @name         Profile Improvements
// @include      *www.erevollution.com/*/profile/*
// @version      0.0.1
// @description  Profile Improvements
// @author       SvetBG
// @grant        none
// ==/UserScript==

function style(t) {
    $("head").append("<style>" + t + "</style>")
}

(function() {
    'use strict';
    style("select {display:table-cell;}");
    var userLang = navigator.language||navigator.userLanguage||'en-US'
    var ranks = ["Recruit","Junior Cadet","Cadet","Cadet Senior","Cadet 1st Class","Soldier","Private Basic","Private 2nd Class","Private","Private 1st Class","Specialist","Gunnery Specialist","Technical Specialist","Specialist 1st Class","Ranger","Lance Corporal","Corporal","Fireteam Leader","Sergeant 3rd Class","Sergeant 2nd Class","Sergeant","Sergeant 1st Class","Staff Sergeant","Gunnery Sergeant","Master Sergeant","First Sergeant","Command Sergeant","Master Gunnery Sergeant","Sergeant Major","Company Sergeant","Warrant Officer Candidate","Warrant Officer","Chief Warrant Officer","Chief Warrant Officer 1st Class","Master Warrant Officer","Quartermaster","Officer Cadet Junior","Officer Cadet Senior","Ensign","Second Lieutenant","First Lieutenant","Lieutenant Captain","Lieutenant","Lieutenant Colonel","Captain Lieutenant","Captain","Captain*","Captain**","Captain***","Colonel","Brigadier","Field Marshal","Commander","High Commander","Supreme Commander","Major General","Lieutenant General","General-Field Marshal","General","SF First Lieutenant","SF Sublieutenant","SF Lieutenant","SF Lieutenant-Colonel","SF Lieutenant-Captain","SF Captain","TSF Captain*","SF Captain**","SF Captain***","SF Colonel","Warface"]
    $( document ).ready(function() {
        var spanStrengthContainer = $('span.vs164-2')
        var strength = parseFloat(spanStrengthContainer.html().replace(',', ''))
        var level = parseInt($('span.vs164-13').html())
        var militaryRank = $('span.vs164-6').html()
        var militaryRankWeight = ranks.indexOf(militaryRank)+1
        var ne = $('input#ne:checked').length?1.1:1
        var weapon = parseFloat($('select#weapon').val())||1
        var dsystem = parseFloat($('select#dsystem').val())||0
        var booster = parseFloat($('select#booster').val())||1
        //Math.ceil(((strenght + (level * 5))*(1+(rank*0.05)))*weapon*naturalEnemy*booster)
        //console.log(strength + ' ' + level + ' ' + militaryRankWeight)
        var oneHit = 0
        var tpContainer = $('small.vs165-5 strong').eq(0)
        var allyContainer = $('small.vs165-5 strong').eq(1)
        
        var tpRemainingHits = 0
        var allyRemainingHits = 0
        
        tpContainer.after('<strong id="tp_in"></strong>')
        allyContainer.after('<strong id="ally_in"></strong>')
        
        var tpInfo = getDmg(tpContainer)
        var allyInfo = getDmg(allyContainer)
        var tpCurrent = tpInfo[0]
        var tpAchievement = tpInfo[1]
        var allyCurrent = allyInfo[0]
        var allyAchievement = allyInfo[1]
        
        calculate()
        
        $('div.vs164-11').after('<h3 style="margin-top: 15px;clear: both;"><span>Calculator</span></h3><div class="vs165"><strong class="vs165-1">NE: <input type="checkbox" id="ne" value="1.1"/></strong><strong class="vs165-1"><select required="required" class="form-control" id="weapon"><option value="1.0">No weapon</option><option value="1.2">Q1 Weapon</option><option value="1.4">Q2 Weapon</option><option value="1.6">Q3 Weapon</option><option value="1.8">Q4 Weapon</option><option value="2.0">Q5 Weapon</option><option value="1.6">Q1 Tank</option><option value="1.8">Q2 Tank</option><option value="2.2">Q3 Tank</option><option value="2.6">Q4 Tank</option><option value="3.0">Q5 Tank</option><option value="2.4">Q1 Helicopter</option><option value="2.6">Q2 Helicopter</option><option value="3.0">Q3 Helicopter</option><option value="3.5">Q4 Helicopter</option><option value="4.0">Q5 Helicopter</option><option value="5.0">RPG</option></select></strong><strong class="vs165-1"><select required="required" class="form-control" id="dsystem"><option value="0.0">No Defense</option><option value="0.05">Q1 Defense</option><option value="0.10">Q2 Defense</option><option value="0.15">Q3 Defense</option><option value="0.20">Q4 Defense</option><option value="0.25">Q5 Defense</option></select></strong><strong class="vs165-1"><select required="required" class="form-control" id="booster"><option value="1.0">No booster</option><option value="1.1">Q1 Booster</option><option value="1.3">Q3 Booster</option><option value="1.5">Q5 Booster</option></select></strong><h4 id="oneHit" class="vs165-2">'+(oneHit).toLocaleString(userLang, {minimumFractionDigits: 2})+' / hit</h4></div>')
        
        
        function calculate()
        {
            oneHit = Math.ceil(((strength + (level * 5))*(1+(militaryRankWeight*0.05)))*weapon*ne*booster)
            oneHit = oneHit-(oneHit*dsystem);
            
            var tpRemaining = tpAchievement - tpCurrent
            tpRemainingHits = Math.ceil(tpRemaining/oneHit)
            
            var allyRemaining = allyAchievement - allyCurrent
            allyRemainingHits = Math.ceil(allyRemaining/oneHit)
            
            updateHit()
        }
        
        function updateHit()
        {
            $('h4#oneHit').html((oneHit).toLocaleString(userLang, {minimumFractionDigits: 2}) + ' / hit')
            $('strong#tp_in').html(' in ' + tpRemainingHits + ' hits')
            $('strong#ally_in').html(' in ' + allyRemainingHits + ' hits')
        }
        
        function getDmg(container)
        {
            var tpVal = container.html().split('/')
            tpCurrent = parseFloat(tpVal[0].replace(',', ''))
            tpAchievement = parseFloat(tpVal[1].replace(',', ''))
            
            return [tpCurrent, tpAchievement]
        }
        
        $('input#ne').click(function(){
            ne = this.checked?1.1:1
            calculate()
        })
        
        $('select#weapon').change(function(){
            weapon = parseFloat($(this).val())
            calculate()
        })
        
        $('select#dsystem').change(function(){
            dsystem = parseFloat($(this).val())
            calculate()
        })
        
        $('select#booster').change(function(){
            booster = parseFloat($(this).val())
            calculate()
        })
    });
})();
