// ==UserScript==
// @name         Erev HomePage Improvements
// @include      *www.erevollution.com/*/index
// @version      0.0.5
// @description  Erev HomePage Improvements
// @author       Anonymous
// @grant        none
// ==/UserScript==

function style(a){$("head").append("<style>"+a+"</style>")}!function(){"use strict";style(".hits {color: #595959;}");navigator.language||navigator.userLanguage||"en-US";$(document).ready(function(){function c(){var c=parseFloat($("div#energyBarT").html().split("/")[0]),f=parseFloat($("div#energyBarT").html().split("/")[1]);if(c<f){d();var g=e();a>=g&&$("#energyButton").trigger("click")}else void 0!==b&&clearInterval(b)}function d(){a=parseFloat($("strong#energyButtonT").html())}function e(){return 10*Math.ceil(10*Math.random())}var a=0,b=setInterval(c,36e4);setTimeout(c,1e3)})}();
