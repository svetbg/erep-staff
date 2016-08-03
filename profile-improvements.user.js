// ==UserScript==
// @name         Profile Improvements
// @include      *www.erevollution.com/*/profile/*
// @version      0.0.2
// @description  Profile Improvements
// @author       SvetBG
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var userLang = navigator.language||navigator.userLanguage||'en-US'
    var ranks = ["Recruit","Junior Cadet","Cadet","Cadet Senior","Cadet 1st Class","Soldier","Private Basic","Private 2nd Class","Private","Private 1st Class","Specialist","Gunnery Specialist","Technical Specialist","Specialist 1st Class","Ranger","Lance Corporal","Corporal","Fireteam Leader","Sergeant 3rd Class","Sergeant 2nd Class","Sergeant","Sergeant 1st Class","Staff Sergeant","Gunnery Sergeant","Master Sergeant","First Sergeant","Command Sergeant","Master Gunnery Sergeant","Sergeant Major","Company Sergeant","Warrant Officer Candidate","Warrant Officer","Chief Warrant Officer","Chief Warrant Officer 1st Class","Master Warrant Officer","Quartermaster","Officer Cadet Junior","Officer Cadet Senior","Ensign","Second Lieutenant","First Lieutenant","Lieutenant Captain","Lieutenant","Lieutenant Colonel","Captain Lieutenant","Captain","Captain*","Captain**","Captain***","Colonel","Brigadier","Field Marshal","Commander","High Commander","Supreme Commander","Major General","Lieutenant General","General-Field Marshal","General","SF First Lieutenant","SF Sublieutenant","SF Lieutenant","SF Lieutenant-Colonel","SF Lieutenant-Captain","SF Captain","TSF Captain*","SF Captain**","SF Captain***","SF Colonel","Warface"]
    $( document ).ready(function() {
        var spanStrengthContainer = $('span.vs164-2')
        var strength = parseFloat(spanStrengthContainer.html().replace(',', ''))
        var level = parseInt($('span.vs164-13').html())
        var militaryRank = $('span.vs164-6').html()
        var militaryRankWeight = ranks.indexOf(militaryRank)+1
        //Math.ceil(((strenght + (level * 5))*(1+(rank*0.05)))*weapon*naturalEnemy*booster)
        //console.log(strength + ' ' + level + ' ' + militaryRankWeight)
        var oneHit = Math.ceil(((strength + (level * 5))*(1+(militaryRankWeight*0.05)))*4)
        spanStrengthContainer.after('<span class="vs164-2" style="bottom: 0;">'+(oneHit).toLocaleString(userLang, {minimumFractionDigits: 2})+'</span>')
    });
})();
