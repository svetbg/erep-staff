// ==UserScript==
// @name         slush_impr
// @include      *slushpool.com/dashboard/*
// @version      0.0.1
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

    function getDailyReward(pattern)
    {
        pattern = pattern === undefined ?
            '#dashboard-wrapper > div.editorContextWrapper > div > div:nth-child(1) > div:nth-child(2) > div.panel-addon-component.active > div:nth-child(4) > span > span.value' : pattern

        return parseFloat($(pattern).text())

    }

    function getDailyHashrate(pattern)
    {
        pattern = pattern === undefined ?
            '#dashboard-wrapper > div.editorContextWrapper > div > div:nth-child(1) > div:nth-child(1) > div.panel-addon-component.active > div.panel-addon-row-component.triple.horizontal.center.justified.layout > div > div:nth-child(3) > div.value > span > span.value' : pattern

        return parseFloat($(pattern).text())
    }

    var displayContainer = '<div class="panel-addon-row-component horizontal center justified layout">'+
        '<div class="label-wrapper">Estimated Daily Reward per TH</div>'+
        '<span class="data-format-component btc">'+
        '<span class="value" id="daily_btc_per_th"></span>'+
        '<span>&nbsp;</span><span class="unit">BTC</span></span></div>'

    $( document ).ready(function() {
        var daily_btc_reward_cont = $('#dashboard-wrapper > div.editorContextWrapper > div > div:nth-child(1) > div:nth-child(2) > div.panel-addon-component.active > div:nth-child(4) > span > span.value')
        daily_btc_reward_cont.parent().parent().after(displayContainer);

        setTimeout(function(){
            var precision = 1000000000
            var daily_btc = getDailyReward() || 0.0
            var daily_hashrate = getDailyHashrate() || 1.0
            var daily_hashrate_per_th = Math.round((daily_btc / daily_hashrate)*precision)/precision
            $('#daily_btc_per_th').text(daily_hashrate_per_th)
        }, 1000)
    })
})()
