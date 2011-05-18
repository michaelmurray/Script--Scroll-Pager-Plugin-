//! ScrollPagerPlugin.debug.js
//

(function($) {

////////////////////////////////////////////////////////////////////////////////
// ScrollPagerPluginPlugin

$.fn.scrollPagerPlugin = function ScrollPagerPluginPlugin$scrollPagerPlugin(customOptions) {
    /// <param name="customOptions" type="Object">
    /// </param>
    /// <returns type="jQueryObject"></returns>
    var defaultOptions = {};
    defaultOptions.pageSize = 10;
    defaultOptions.currentPage = 1;
    defaultOptions.holder = '.listcontainer';
    defaultOptions.viewport = '';
    defaultOptions.pageHeight = 23;
    defaultOptions.onPageChanged = null;
    defaultOptions.container = '#listcontainerdiv';
    var options = $.extend({}, defaultOptions, customOptions);
    return this.each(function(i, element) {
        var selector = $(this);
        var pageCounter = 1;
        var iPosition = new PositionInfo();
        var iMouse = new MouseInfo();
        var candidatePageIndex = 0;
        selector.children().each(function(ic, elc) {
            if (ic < pageCounter * options.pageSize && ic >= (pageCounter - 1) * options.pageSize) {
                $(this).addClass('page' + pageCounter);
            }
            else {
                $(this).addClass('page' + (pageCounter + 1));
                pageCounter++;
            }
        });
        var contHeight = $(options.container).height();
        var sliderItemHeight = contHeight;
        selector.children().hide();
        $('.page' + options.currentPage).show();
        if (pageCounter > 1) {
            sliderItemHeight = (contHeight / pageCounter);
            var pageNav = "<UL class=scrollbar sizcache='4' sizset='13'>";
            for (i = 1; i <= pageCounter; i++) {
                if (i === options.currentPage) {
                    pageNav += "<LI class='currentPage pageItem' sizcache='4' sizset='13'><A class='sliderPage' href='#' rel='" + i + "'></A>";
                }
                else {
                    pageNav += "<LI class='pageNav" + i + " pageItem' sizcache='4' sizset='14'><A class='sliderPage' href='#' rel='" + i + "'></A>";
                }
            }
            var sliderItem = "<LI class='thumb' sizcache='4' sizset='13' style='top:" + (options.currentPage - 1) * sliderItemHeight + '; height:' + (sliderItemHeight - 3) + "'><A class='sliderThumb' href='#' rel='" + i + "'></A>";
            pageNav += sliderItem;
            pageNav += '</LI></UL>';
            if (!options.holder) {
                selector.after(pageNav);
            }
            else {
                $(options.holder).append(pageNav);
            }
            $('.pageItem').height(sliderItemHeight);
        }
        var oTrack = $('.scrollbar');
        var oThumb = $('.thumb');
        var maxPos = (oTrack.height() - oThumb.height());
        var pageItemCollection = $('.pageItem a');
        var selectPageItem = function(pageItem) {
            var clickedLink = pageItem.attr('rel');
            options.onPageChanged(pageItem, new SelectedPageEventArgs(parseInt(clickedLink)));
            options.currentPage = parseInt(clickedLink);
            $('li.currentPage').removeClass('currentPage');
            pageItem.parent('li').addClass('currentPage');
            selector.children().hide();
            selector.find('.page' + clickedLink).show();
        };
        var selectPageItemHandler = function(pageItemClickedEvent) {
            var pageItem = $(pageItemClickedEvent.currentTarget);
            selectPageItem(pageItem);
        };
        pageItemCollection.live('click', selectPageItemHandler);
        var wheel = function(oEvent) {
        };
        var drag = function(oEvent) {
            var candidatePos = Math.max(0, (iPosition.start + (oEvent.pageY - iMouse.start)));
            iPosition.now = (candidatePos > maxPos) ? maxPos : candidatePos;
            candidatePageIndex = Math.round(iPosition.now / oThumb.height());
            oThumb.css('top', iPosition.now.toString());
        };
        var end = null;
        end = function(oEvent) {
            $(document).unbind('mousemove', drag);
            $(document).unbind('mouseup', end);
            oThumb.die('mouseup', end);
            selectPageItem($(pageItemCollection[candidatePageIndex]));
        };
        var start = function(oEvent) {
            iMouse.start = oEvent.pageY;
            var oThumbDir = oThumb.css('top');
            iPosition.start = (oThumbDir === 'auto') ? 0 : parseInt(oThumbDir);
            $(document).bind('mousemove', drag);
            $(document).bind('mouseup', end);
            oThumb.live('mouseup', end);
        };
        var setEvents = function() {
            oThumb.live('mousedown', start);
            oTrack.live('mouseup', drag);
        };
        setEvents();
    });
}


////////////////////////////////////////////////////////////////////////////////
// MouseInfo

window.MouseInfo = function MouseInfo() {
    /// <field name="start" type="Number">
    /// </field>
    /// <field name="end" type="Number">
    /// </field>
}
MouseInfo.prototype = {
    start: 0,
    end: 0
}


////////////////////////////////////////////////////////////////////////////////
// PositionInfo

window.PositionInfo = function PositionInfo() {
    /// <field name="start" type="Number">
    /// </field>
    /// <field name="now" type="Number">
    /// </field>
}
PositionInfo.prototype = {
    start: 0,
    now: 0
}


////////////////////////////////////////////////////////////////////////////////
// SelectedPageEventArgs

window.SelectedPageEventArgs = function SelectedPageEventArgs(selectedPageNumber) {
    /// <param name="selectedPageNumber" type="Number" integer="true">
    /// </param>
    /// <field name="selectedPage" type="Number" integer="true">
    /// </field>
    SelectedPageEventArgs.initializeBase(this);
    this.selectedPage = selectedPageNumber;
}
SelectedPageEventArgs.prototype = {
    selectedPage: 0
}


MouseInfo.registerClass('MouseInfo');
PositionInfo.registerClass('PositionInfo');
SelectedPageEventArgs.registerClass('SelectedPageEventArgs', ss.EventArgs);
})(jQuery);

//! This script was generated using Script# v0.7.0.0
