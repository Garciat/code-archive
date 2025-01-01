$(function(){
	Presentation.init()
})

var Presentation = {
	previous: null,
	current: 1,
	
	steps: (new Array()),
	
	//Slide attributes
	slide: {
		inset: 55
	},
	
	init: function() {
		//These will be used frequently.
		this.$window = $(window);
		this.$body = $('body');
		this.$wrap = $('#wrap');
		this.$containers = $('.container');
		
		//Process each slide's steps
		this.stepLoad();
		
		//Store number of slides
		this.slides = this.$containers.length;
		//Store slide width
		this.slide.width = $('.slide').eq(0).width();
		
		//Keep it nice and centered
		this.$window.bind('resize', function() {
			Presentation.center();
		});
		this.$window.trigger('resize');
		
		//Presentation controls
		this.$window.bind('keydown', function(e) {
			Presentation.key(e);
		});
		
		//URL Hash
		this.$window.bind('hashchange', function() {
			Presentation.hash();
		});
		this.hash(false);
		
		//Add slide numbers
		this.numbers();
		//Add progressive class (s[x])
		this.classes();
	},
	
	/* UI */
	stepLoad: function() {
		
	},
	center: function() {
		this.slide.marginLeft = -1 * (this.slide.inset + (this.$window.width() - this.slide.width)/2); //Negative value
		
		if(Math.abs(this.slide.marginLeft) > (this.$window.width() - this.slide.width) - 50)
			this.slide.marginLeft = -1 * ((this.$window.width() - this.slide.width) - 50)
		
		this.$containers.each(function(i) {
			$(this).css({
				left: (100 * i) + '%',
				marginLeft: (Presentation.slide.marginLeft * i)
			})
		});
	},
	numbers: function() {
		this.$containers.find('.slide').each(function(i) {
			var number = $('<div />').css({
				position: 'absolute',
				zIndex: 2,
				bottom: 0, left: 0,
				width: 60, height: 60,
				lineHeight: '60px',
				fontSize: '20pt',
				textAlign: 'center',
				color: 'rgba(0,0,0,0.6)'
			}).html(i + 1);
			
			$(this).append(number);
		});
	},
	classes: function() {
		this.$containers.find('.slide').each(function(i) {
			$(this).addClass('s' + (i + 1));
			if(i%2==0)
				$(this).parent().addClass('alt');
		});
	},
	
	/* Events */
	key: function(e) {
		//if (/^(input|textarea)$/i.test(e.target.nodeName)) return;
		
		switch(e.keyCode) {
			case 37: //Left arrow
				this.prev();
			break;
			case 32: //Spacebar
			case 13: //Return key
			case 39: //Right arrow
				this.next();
			break;
		}
	},
	hash: function(anim) {
		anim = anim!==false;
		var slide = parseInt(window.location.hash.replace('#slide', ''));
		if(!slide)
			slide = 1;
		this.go(slide, anim);
	},
	
	/* Navigation */
	
	go: function(n, anim) {
		//Slow down cowboy!
		if(n > this.slides || n < 1) return;
		
		speed = (anim!==false) ? null : 0;
		
		left = (n - 1) * (this.$window.width() + this.slide.marginLeft);
		
		this.$body.stop().animate({scrollLeft: left}, speed, function() {
			
		});
		
		this.current = n;
		window.location.hash = 'slide' + n;
	},
	next: function() {
		this.go(this.current + 1);
	},
	prev: function() {
		this.go(this.current - 1);
	}
}
