$(function(){
	//Remove non-JS CSS
	$('body').css('background', '#000');
	$('#wrap').css({'position':'absolute','margin':'0'}).vAlign();
	
	$('#title, #menu, #menu ul').css({'display':'none','opacity':'0'});
	$('#menu').css({'width':'250px','height':'290px','margin':'25px'});
	
	tileBkg();
	
	setTimeout(function(){
		$('#title').css('display','block').animate({opacity:1}, 1500, function(){
			$('#menu').css('display','block').animate({opacity:1,width:300,height:340,margin:0}, function(){
				$('#menu ul').css('display','block').animate({opacity:1}, function(){
					$('#menu').append($('<div id="shadow" style="opacity:0" />'));
					$('#shadow').animate({opacity:1}, 1000);
					$('#menu li').each(function(i){
						$(this).mouseover(function(){
							//cicleBkg(i);
							$('#shadow').stop().animate({top:15+(57*i)})
						});
					});
				})
			});
		});
	}, 3000);
	
	$(window).bind('resize', function(){
		$('#wrap').vAlign();
	});
	
	var bkgs = ['1.jpg', '2.jpg', '3.jpg'];
	var ct = 0;
	var cicleBkg = function(count){
		var bkg = bkgs[count];
		var n = $('<div/>').css({
			'z-index': '-'+(1000-ct),
			'background': '#000 url(\'bkg/'+bkg+'\')'
		}).appendTo('#bkg').animate({
			opacity: 1
		}, 1000, function(){
			$('#bkg div:first-child').remove();
		});
		ct++;
	}
	
	var cicleColor = function(){
		
	}
});

var squares = [];

function tileBkg(callback){
	//Set our vars
	var unit = 69, //Multiple of 3
		marg = 0,
		w = Math.ceil(screen.width/unit)+1,
		h = Math.ceil(screen.height/unit)+1,
		back = $('#back'),
		max = 4,
		skip = [];
	
	//Create our used squares array
	for(y=0; y<h; y++){
		skip[y] = [];
		for(x=0; x<w; x++)
			skip[y][x] = false;
	}
	
	for(y=0; y<h; y++){
		for(x=0; x<w; x++){
			//This square is used
			if(skip[y][x])
				continue;
			//Generate size
			size = Math.floor(Math.random()*max)+1;
			//If size is bigger than what's left of the grid, decrease it
			while(size>w-x || size>h-y)
				size--;
			//Do squares overlap?
			for(a=0; a<size; a++)
				for(b=size-1; b>=0; b--)
					if(skip[y+a][x+b] || (size>1 && !skip[y+a][x+b] && skip[y+a][x+b-1]))
						size--;
			//Set used squares
			for(a=0; a<size; a++)
				for(b=0; b<size; b++)
					skip[y+a][x+b] = true;
			//Add square to the grid
			var sq = $('<div/>').css({
				'width': (size*unit+(size-1)*marg)-Math.floor(unit/3)+'px',
				'height': (size*unit+(size-1)*marg)-Math.floor(unit/3)+'px',
				'top': (y*unit+y*marg)-Math.floor(unit/2)+(Math.floor(unit/3)/2)+'px',
				'left': (x*unit+x*marg)-Math.floor(unit/2)+(Math.floor(unit/3)/2)+'px',
				'border-width': marg+'px'
			});
			back.append(sq);
			//Add effect
			$('#back>div:last-child').delay(Math.floor(Math.random()*2500)+200).animate({
				opacity: 1,
				width: (size*unit+(size-1)*marg),
				height: (size*unit+(size-1)*marg),
				top: (y*unit+y*marg)-Math.floor(unit/2),
				left: (x*unit+x*marg)-Math.floor(unit/2)
			}, 500);
			//Add square to list for later manipulation
			squares[squares.length] = $('#back>div:last-child');
		}
	}
}

(function($){
// VERTICALLY ALIGN FUNCTION
$.fn.vAlign = function(){
	return this.each(function(i){
		var ah = $(this).height();
		var ph = $(this).parent().height();
		var aw = $(this).width();
		var pw = $(this).parent().width();
		var mh = (ph - ah) / 2;
		var mw = (pw - aw) / 2;
		$(this).css('top', mh);
		$(this).css('left', mw);
	});
};
$.fn.delay = function(time, callback){
    // Empty function:
    jQuery.fx.step.delay = function(){};
    // Return meaningless animation, (will be added to queue)
    return this.animate({delay:1}, time, callback);
}
})(jQuery);

