// ScrollPagerPlugin.cs
//

using System;
using System.Html;
using System.Runtime.CompilerServices;
using jQueryApi;

[Mixin("$.fn")]
public static class ScrollPagerPluginPlugin
{
	public static jQueryObject ScrollPagerPlugin(ScrollPagerPluginOptions customOptions)
	{
		ScrollPagerPluginOptions defaultOptions =new ScrollPagerPluginOptions();
		defaultOptions.pageSize = 10;
		defaultOptions.currentPage = 1;
		defaultOptions.holder = ".listcontainer";
		defaultOptions.viewport = "";
		defaultOptions.pageHeight = 23;
		defaultOptions.onPageChanged = null;
		defaultOptions.container = "#listcontainerdiv";

		ScrollPagerPluginOptions options =jQuery.ExtendObject<ScrollPagerPluginOptions>(new ScrollPagerPluginOptions(), defaultOptions, customOptions);

		return jQuery.Current.Each(delegate(int i, Element element)
		                           	{
		                           		jQueryObject selector = jQuery.This;
										int pageCounter = 1;
										PositionInfo iPosition = new PositionInfo();
										MouseInfo iMouse = new MouseInfo();
		                           		Number candidatePageIndex = 0;

										//this goes through every item in the 
		                           		selector
											.Children()
											.Each(delegate(int ic, Element elc)
		                           		                         	{
																		if (ic < pageCounter * options.pageSize && ic >= (pageCounter - 1) * options.pageSize)
																		{
																			jQuery.This.AddClass("page" + pageCounter);
																		}
																		else
																		{
																			jQuery.This.AddClass("page" + (pageCounter+1));
																			pageCounter++; 
																		}
		                           		                         	});

										//set and default the slider item height
										int contHeight = jQuery.Select(options.container).GetHeight();
										int sliderItemHeight = contHeight;

										//show/hide the appropriate regions 
										selector.Children().Hide();
										jQuery.Select(".page" + options.currentPage).Show();

										//more than one page? 
										if (pageCounter > 1)
										{
											//calculate the slider item height
											sliderItemHeight = (contHeight / pageCounter);

											//Build pager navigation
											string pageNav = "<UL class=scrollbar sizcache='4' sizset='13'>";
											for (i = 1; i <= pageCounter; i++)
											{
												if (i == options.currentPage)
												{
													pageNav += "<LI class='currentPage pageItem' sizcache='4' sizset='13'><A class='sliderPage' href='#' rel='" + i + "'></A>";
												}
												else
												{
													pageNav += "<LI class='pageNav" + i + " pageItem' sizcache='4' sizset='14'><A class='sliderPage' href='#' rel='" + i + "'></A>";
												}

											}

											//Create slider item 
											string sliderItem = "<LI class='thumb' sizcache='4' sizset='13' style='top:" + (options.currentPage - 1) * sliderItemHeight + "; height:" + (sliderItemHeight - 3) + "'><A class='sliderThumb' href='#' rel='" + i + "'></A>";
											pageNav += sliderItem;
											pageNav += "</LI></UL>";

											if (options.holder == "")
											{
												selector.After(pageNav);
											}
											else
											{
												jQuery.Select(options.holder).Append(pageNav);
											}

											//Apply the slider item height 
											jQuery.Select(".pageItem").Height(sliderItemHeight);

										}

										jQueryObject oTrack = jQuery.Select(".scrollbar");
										jQueryObject oThumb = jQuery.Select(".thumb");
										//jQueryObject oViewPort = jQuery.Select(options.viewport);
										Number maxPos = (oTrack.GetHeight() - oThumb.GetHeight());
										jQueryObject pageItemCollection = jQuery.Select(".pageItem a");

		                           		Action<jQueryObject> selectPageItem = delegate(jQueryObject pageItem)
		                           		                                      	{
																					string clickedLink = pageItem.GetAttribute("rel");
																					options.onPageChanged.Invoke(pageItem, new SelectedPageEventArgs(int.Parse(clickedLink)));

																					options.currentPage = int.Parse(clickedLink);
																					//remove current current (!) page
																					jQuery.Select("li.currentPage").RemoveClass("currentPage");
																					//Add current page highlighting
																					pageItem.Parent("li").AddClass("currentPage");
																					//hide and show relevant links				
																					selector.Children().Hide();
																					selector.Find(".page" + clickedLink).Show();
		                           		                                      	};

										//Action<jQueryObject> selectPageItem = delegate(jQueryObject pageItem)
										jQueryEventHandler selectPageItemHandler = delegate(jQueryEvent pageItemClickedEvent)
										{
											//grab the REL attribute 
											jQueryObject pageItem = jQuery.FromElement(pageItemClickedEvent.CurrentTarget);
											selectPageItem(pageItem);
										};

										
										//pager navigation behaviour
		                           		pageItemCollection.Live("click", selectPageItemHandler);

										jQueryEventHandler wheel = delegate(jQueryEvent oEvent)
		                           		                           	{
		                           		                           	};

										jQueryEventHandler drag = delegate(jQueryEvent oEvent)
										{
											Number candidatePos = Math.Max(0, (iPosition.Start + ((oEvent.PageY) - iMouse.Start)));
											iPosition.Now = (candidatePos > maxPos) ? maxPos : candidatePos;
											candidatePageIndex = Math.Round(iPosition.Now / oThumb.GetHeight());
											oThumb.CSS("top", iPosition.Now.ToString()); ;
										};

										jQueryEventHandler end = null; 
										end = delegate(jQueryEvent oEvent)
										{
											jQuery.Document.Unbind("mousemove", drag);
											jQuery.Document.Unbind("mouseup", end);
											oThumb.Die("mouseup", end);
											selectPageItem(jQuery.FromElement(pageItemCollection[candidatePageIndex]));
										};

										jQueryEventHandler start = delegate(jQueryEvent oEvent)
										{
											iMouse.Start = oEvent.PageY;
											string oThumbDir = oThumb.GetCSS("top");
											iPosition.Start = (oThumbDir == "auto") ? 0 : int.Parse(oThumbDir);
											jQuery.Document.Bind("mousemove", drag);
											jQuery.Document.Bind("mouseup", end);
											oThumb.Live("mouseup", end);
										};

										Action setEvents = delegate()
										{
											oThumb.Live("mousedown", start);
											oTrack.Live("mouseup", drag);
											//if (options.scroll != null)
											//{
											//    oViewPort[0].AddEventListener("DOMMouseScroll", wheel, false);
											//    oViewPort[0].AddEventListener("mousewheel", wheel, false);
											//}
											//else if (options.scroll != null)
											//{
											//    oViewPort[0].OnMouseWheel = wheel;
											//}
										};

										setEvents.Invoke();

		                           	});
	}
}

public class MouseInfo
{
	public Number Start = 0;
	public Number End = 0;
}


public class PositionInfo
{
	public Number Start = 0;
	public Number Now = 0;
}

public class SelectedPageEventArgs : EventArgs
{
	public int selectedPage = 0;
	public SelectedPageEventArgs(int selectedPageNumber)
	{
		selectedPage = selectedPageNumber;
	}
}

[Imported]
[ScriptName("Object")]
public sealed class ScrollPagerPluginOptions
{
	// TODO: Replace with fields corresponding to options for the plugin
	public int pageSize = 10;
	public int currentPage = 1;
	public int totalRecords = 100; 
	public string holder = "";
	public string viewport = "";
	public string container = "#listcontainerdiv";
	public int pageHeight = 0;
	public EventHandler<SelectedPageEventArgs> onPageChanged; //delegate(object o, SelectedPageEventArgs e)
	                                                          //  	{
																//		Window.Top.Status = "Selected Page: " + e.selectedPage.ToString();
	                                                           // 	};
	public object scroll; 
	


	public ScrollPagerPluginOptions()
	{
	}

	public ScrollPagerPluginOptions(params object[] nameValuePairs)
	{
	}
}

#region Script# Support
[Imported]
public sealed class ScrollPagerPluginObject : jQueryObject
{
	public jQueryObject ScrollPagerPlugin()
	{
		return null;
	}

	public jQueryObject ScrollPagerPlugin(ScrollPagerPluginOptions options)
	{
		return null;
	}
}
#endregion
