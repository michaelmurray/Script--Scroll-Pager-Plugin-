// ScrollPagerPlugin.js
(function($){
$.fn.scrollPagerPlugin=function(customOptions){var $0={};$0.pageSize=10;$0.currentPage=1;$0.holder='.listcontainer';$0.viewport='';$0.pageHeight=23;$0.onPageChanged=null;$0.container='#listcontainerdiv';var $1=$.extend({},$0,customOptions);return this.each(function($p1_0,$p1_1){
var $1_0=$(this);var $1_1=1;var $1_2=new PositionInfo();var $1_3=new MouseInfo();var $1_4=0;$1_0.children().each(function($p2_0,$p2_1){
if($p2_0<$1_1*$1.pageSize&&$p2_0>=($1_1-1)*$1.pageSize){$(this).addClass('page'+$1_1);}else{$(this).addClass('page'+($1_1+1));$1_1++;}});var $1_5=$($1.container).height();var $1_6=$1_5;$1_0.children().hide();$('.page'+$1.currentPage).show();if($1_1>1){$1_6=($1_5/$1_1);var $1_12="<UL class=scrollbar sizcache='4' sizset='13'>";for($p1_0=1;$p1_0<=$1_1;$p1_0++){if($p1_0===$1.currentPage){$1_12+="<LI class='currentPage pageItem' sizcache='4' sizset='13'><A class='sliderPage' href='#' rel='"+$p1_0+"'></A>";}else{$1_12+="<LI class='pageNav"+$p1_0+" pageItem' sizcache='4' sizset='14'><A class='sliderPage' href='#' rel='"+$p1_0+"'></A>";}}var $1_13="<LI class='thumb' sizcache='4' sizset='13' style='top:"+($1.currentPage-1)*$1_6+'; height:'+($1_6-3)+"'><A class='sliderThumb' href='#' rel='"+$p1_0+"'></A>";$1_12+=$1_13;$1_12+='</LI></UL>';if(!$1.holder){$1_0.after($1_12);}else{$($1.holder).append($1_12);}$('.pageItem').height($1_6);}var $1_7=$('.scrollbar');var $1_8=$('.thumb');var $1_9=($1_7.height()-$1_8.height());var $1_A=$('.pageItem a');var $1_B=function($p2_0){
var $2_0=$p2_0.attr('rel');$1.onPageChanged($p2_0,new SelectedPageEventArgs(parseInt($2_0)));$1.currentPage=parseInt($2_0);$('li.currentPage').removeClass('currentPage');$p2_0.parent('li').addClass('currentPage');$1_0.children().hide();$1_0.find('.page'+$2_0).show();};var $1_C=function($p2_0){
var $2_0=$($p2_0.currentTarget);$1_B($2_0);};$1_A.live('click',$1_C);var $1_D=function($p2_0){
};var $1_E=function($p2_0){
var $2_0=Math.max(0,($1_2.start+($p2_0.pageY-$1_3.start)));$1_2.now=($2_0>$1_9)?$1_9:$2_0;$1_4=Math.round($1_2.now/$1_8.height());$1_8.css('top',$1_2.now.toString());};var $1_F=null;$1_F=function($p2_0){
$(document).unbind('mousemove',$1_E);$(document).unbind('mouseup',$1_F);$1_8.die('mouseup',$1_F);$1_B($($1_A[$1_4]));};var $1_10=function($p2_0){
$1_3.start=$p2_0.pageY;var $2_0=$1_8.css('top');$1_2.start=($2_0==='auto')?0:parseInt($2_0);$(document).bind('mousemove',$1_E);$(document).bind('mouseup',$1_F);$1_8.live('mouseup',$1_F);};var $1_11=function(){
$1_8.live('mousedown',$1_10);$1_7.live('mouseup',$1_E);};$1_11();});}
window.MouseInfo=function(){}
MouseInfo.prototype={start:0,end:0}
window.PositionInfo=function(){}
PositionInfo.prototype={start:0,now:0}
window.SelectedPageEventArgs=function(selectedPageNumber){SelectedPageEventArgs.initializeBase(this);this.selectedPage=selectedPageNumber;}
SelectedPageEventArgs.prototype={selectedPage:0}
MouseInfo.registerClass('MouseInfo');PositionInfo.registerClass('PositionInfo');SelectedPageEventArgs.registerClass('SelectedPageEventArgs',ss.EventArgs);})(jQuery);// This script was generated using Script# v0.7.0.0
