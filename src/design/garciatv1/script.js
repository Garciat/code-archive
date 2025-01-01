var items = [''];
var current = '';
var screen = {x:0,y:0};
$(function(){
	$('#menu a').each(function(){
		items.push($(this).attr('href').replace('#',''));
	});
	
	$(window).hashchange(function(){
		var item = location.hash.replace('#','');
		if(in_array(item, items))
			show_item(item);
	});
	$(window).hashchange();
	
	update_screen();
	
	$(window).bind('resize', function(){
		var $item = $('#items>div[class~="'+current+'"]');
		var x = $item.offset().left-screen.x+$(window).width();
		
		update_screen();
		
		$item.css({left:x});
	});
});

function show_item(name) {
	var $link = $('#menu a[href="#'+name+'"]');
	var $item = $('#items>div[class~="'+name+'"]');
	var x = $link.offset().left-$item.outerWidth()-15;
	var y = $link.offset().top+$link.outerHeight()/2-$item.outerHeight()/2;
	
	$('#items>:not([class~="'+name+'"])').stop().animate({opacity:0}, 300, function(){$(this).hide()});
	$item.css({top:y,left:x-100}).show().animate({opacity:1,left:x});
	
	current = name;
}

function update_screen() {
	screen.x = $(window).width();
	screen.y = $(window).height();
}

function in_array(needle, haystack) {
	for(key in haystack)
		if(haystack[key] == needle)
			return true;
	return false;
}