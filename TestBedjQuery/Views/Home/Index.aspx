<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="StylesContent" runat="server">
    	<style type="text/css">
		.ThumbnailItem
		{
			float:left;
			padding:5px;
		}

		.ThumbnailItem>div
		{
			border-radius: 4px;
			padding:3px;
			width:89px;
		}

		.ThumbnailItem>div:hover
		{
			background-color:#dddddd;
		}

		.ThumbnailItem>div>img
		{
			border:1px solid #999999;
			border-radius: 3px;
			padding:1px;
			background-color:White;
			width:85px;
		}

		.ThumbnailItem>label
		{
			float:left;
			clear:both;
			font-size:11px;
			font-family:Arial;
			text-align:center;
			width:87px;
			overflow:hidden;
			margin:0px 0px 0px 4px;
		}

		.Selected>div
		{
			background-image: -webkit-gradient(
				linear,
				left bottom,
				left top,
				color-stop(0, rgb(244,149,55)),
				color-stop(1, rgb(249,206,55))
			);
			background-image: -moz-linear-gradient(
				center bottom,
				rgb(177,87,241) 36%,
				rgb(213,114,255) 68%,
				rgb(36,74,171) 84%
			);
		}

		#ThumbnailListContainer
		{
			position:absolute;
			left:0px;
			right:0px;
			bottom:0px;
			top:40px;
		}


		#CommandBar>div
		{
			float:left;
			text-decoration:underline;
			color:Blue;
			margin-right:5px;
			cursor:pointer;
		}

		#CommandBar>div[disabled]
		{
			color:Gray;
			cursor:default;
		}

		.scrollbar
		{
			float:right;
			border-left:1px solid black;
			background-color:Ivory;
			width:30px;
			height:100%;
			position:relative;
		}

		.pageMe
		{
			float: left; 
			margin-right: 30px; /*same as the pageNav width*/
		}

		.currentPage
		{
			border-bottom:1px solid #999999;
			width:100%;
			clear:both; 
			background-color:Blue;
			z-index:0;

		}

		.pageItem
		{
			border-bottom:1px solid #999999;
			width:100%;
			clear:both; 
			z-index:0;
		}

		.thumb
		{
			width:100%;
			position:absolute;
			top:0px;
			z-index:10;
			background-color:Red;
		}
	</style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h2><%: ViewBag.Message %></h2>
    <p>
        To learn more about ASP.NET MVC visit <a href="http://asp.net/mvc" title="ASP.NET MVC Website">http://asp.net/mvc</a>.
    </p>
	 <div id="listcontainerdiv" class="listcontainer" style="width:100%; height:200px; border:1px solid black;">   
		<ul class="pageMe">
			<li>item1</li><li>item2</li><li>item3</li><li>item4</li><li>item5</li><li>item6</li><li>item7</li><li>item8</li><li>item9</li><li>item10</li><li>item11</li><li>item12</li><li>item13</li><li>item14</li><li>item15</li><li>item16</li><li>item17</li><li>item18</li><li>item19</li><li>item20</li><li>item21</li><li>item22</li><li>item23</li>
		</ul>
		<div class="scrollContainer"></div>
    </div>
		<script type="text/javascript">
			$(document).ready(function ()
			{
				$.fn.scrollPager = function scrollPager(options)
				{

					var defaults = {
						pageSize: 10,
						currentPage: 1,
						holder: "",
						viewport: "",
						pageHeight: 0, 
						onPageChanged: null
					};
					var options = $.extend(defaults, options);

					var selector = $(this);
					var totalRecords = $(this).children().length;
					var pageCounter = 1;
					var iScroll, iPosition = { start: 0, now: 0 }, iMouse = {};
					var candidatePageIndex;

					selector.children().each(function (i)
					{
						if (i < pageCounter * options.pageSize && i >= (pageCounter - 1) * options.pageSize)
						{
							$(this).addClass("page" + pageCounter);
						}
						else
						{
							$(this).addClass("page" + (pageCounter + 1));
							pageCounter++;
						}
					});

					//set and default the slider item height
					var containerHeight = $(options.container).height();
					var sliderItemHeight = containerHeight;

					//show/hide the appropriate regions 
					selector.children().hide();
					$(".page" + options.currentPage).show();

					//first check if there is more than one page. If so, build nav
					if (pageCounter > 1)
					{
						//calculate the slider item height 
						sliderItemHeight = (containerHeight / pageCounter);

						//Build pager navigation
						var pageNav = "<UL class=scrollbar sizcache='4' sizset='13'>";
						for (i = 1; i <= pageCounter; i++)
						{
							if (i == options.currentPage)
							{
								pageNav += "<LI class='currentPage pageItem' sizcache='4' sizset='13'><A href='#' rel='" + i + "'>" + i + "</A>";
							}
							else
							{
								pageNav += "<LI class='pageNav" + i + " pageItem' sizcache='4' sizset='14'><A href='#' rel='" + i + "'>" + i + "</A>";
							}

						}

						//Create slider item 
						var sliderItem = "<LI class='thumb' sizcache='4' sizset='13' style='top:" + (options.currentPage - 1) * sliderItemHeight + "; height:" + sliderItemHeight + "'><A href='#' rel='" + i + "'>" + i + "</A>";
						pageNav += sliderItem;
						pageNav += "</LI></UL>";

						if (options.holder == "")
						{
							selector.after(pageNav);
						}
						else
						{
							$(options.holder).append(pageNav);
						}

						//Apply the slider item height 
						$(".pageItem").height(sliderItemHeight);
					}

					var oTrack = $('.scrollbar');
					var oThumb = $('.thumb');
					var oViewPort = $(options.viewport);
					var maxPos = (oTrack.height() - oThumb.height());
					var pageItemCollection = $(".pageItem a");

					//pager navigation behaviour
					pageItemCollection.live("click", function ()
					{
						selectPageItem(this);
						return false;
					});

					setEvents();

					function selectPageItem(pageItem)
					{
						//grab the REL attribute 
						var clickedLink = $(pageItem).attr("rel");
						options.currentPage = clickedLink;
						//remove current current (!) page
						$("li.currentPage").removeClass("currentPage");
						//Add current page highlighting
						$(pageItem).parent("li").addClass("currentPage");
						//hide and show relevant links				
						selector.children().hide();
						selector.find(".page" + clickedLink).show();
						return false;
					};

					function setEvents()
					{
						oThumb.live('mousedown', start);
						oThumb[0].ontouchstart = function (oEvent)
						{
							oEvent.preventDefault();
							oThumb.die('mousedown');
							start(oEvent.touches[0]);
							return false;
						}
						oTrack.live('mouseup', drag);
						if (options.scroll && this.addEventListener)
						{
							oViewPort[0].addEventListener('DOMMouseScroll', wheel, false);
							oViewPort[0].addEventListener('mousewheel', wheel, false);
						}
						else if (options.scroll) { oViewPort[0].onmousewheel = wheel; }
					};
					function start(oEvent)
					{
						iMouse.start = oEvent.pageY;
						var oThumbDir = parseInt(oThumb.css('top'));
						iPosition.start = oThumbDir == 'auto' ? 0 : oThumbDir;
						$(document).bind('mousemove', drag);
						document.ontouchmove = function (oEvent)
						{
							$(document).unbind('mousemove');
							drag(oEvent.touches[0]);
						};
						$(document).bind('mouseup', end);
						oThumb.live('mouseup', end);
						oThumb[0].ontouchend = document.ontouchend = function (oEvent)
						{
							$(document).unbind('mouseup');
							oThumb.die('mouseup');
							end(oEvent.touches[0]);
						}
						return false;
					};
					function drag(oEvent)
					{
						var candidatePos = Math.max(0, (iPosition.start + ((oEvent.pageY) - iMouse.start)));
						iPosition.now = (candidatePos > maxPos) ? maxPos : candidatePos;
						candidatePageIndex = Math.round(iPosition.now / oThumb.height());
						oThumb.css('top', iPosition.now); ;
						return false;
					};
					function end(oEvent)
					{
						$(document).unbind('mousemove', drag);
						$(document).unbind('mouseup', end);
						oThumb.die('mouseup', end);
						document.ontouchmove = oThumb[0].ontouchend = document.ontouchend = null;
						selectPageItem(pageItemCollection[candidatePageIndex]);
						return false;
					};
				}


				$("ul.pageMe").scrollPager({
					pageSize: 5,
					currentPage: 1,
					holder: ".listcontainer",
					container: "#listcontainerdiv"
				});
			});
	</script>
</asp:Content>
