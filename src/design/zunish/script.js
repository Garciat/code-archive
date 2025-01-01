$(function(){
	$('#wrap,#posts').css({'display':'none'});

	$('#wrap').vAlign()
		.fadeIn(1500, function(){
			$(this).animate({marginTop:$('#wrap').css('margin-top').replace('px','')-$('#posts').height()/2},
				function(){
					$('#posts').slideDown()
				});
		});
		
});

(function($){
	// VERTICALLY ALIGN FUNCTION
	$.fn.vAlign = function(){
		return this.each(function(i){
			var ah = $(this).height();
			var ph = $(this).parent().height();
			var mh = (ph - ah) / 2 - 30;
			$(this).css('margin-top', mh);
		});
	}
})(jQuery);