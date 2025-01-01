$(function () {
    tileBkg();
});

function tileBkg(callback) {
    //Set our vars
    var unit = 21, //Multiple of 3
        marg = 3,
        W = Math.ceil(screen.width / unit) + 1,
        H = Math.ceil(screen.height / unit) + 1,
        back = $('#back'),
        max = 3,
        skip = [];
	
    //Create our used squares array
    for (var y = 0; y < H; y++) {
        skip[y] = [];
        for (x = 0; x < W; x++)
            skip[y][x] = false;
    }

    for (var y = 0; y < H; y++) {
        for (var x = 0; x < W; x++) {
            //This square is used
            if (skip[y][x])
                continue;
            //Generate size
            var size = Math.floor(Math.random() * max) + 1;
            //If size is bigger than what's left of the grid, decrease it
            while (size > W - x || size > H - y)
                size--;
            //Do squares overlap?
            for (var a = 0; a < size; a++)
                for (var b = size - 1; b >= 0; b--)
                    if (skip[y + a][x + b] || (size > 1 && !skip[y + a][x + b] && skip[y + a][x + b - 1]))
                        size--;
            //Set used squares
            for (var a = 0; a < size; a++)
                for (var b = 0; b < size; b++)
                    skip[y + a][x + b] = true;
            //Add square to the grid
            var w = size * unit + (size - 1) * marg;
            var h = w;
            var c = ('00' + Math.floor(0x10 + 0x6F * Math.random()).toString(16)).slice(-2);
            var style = {
                opacity: 0,
                width: w + 'px',
                height: h + 'px',
                top: (y * unit + y * marg) + 'px',
                left: (x * unit + x * marg) + 'px',
                'background-color': 'hsl(' + ((720 * x/W) % 360) + ', ' + (100 * y/H) +'%, 60%)',
                'animation-duration': (1 + 3 * Math.random()) + 's',
                'animation-delay': (1 + 5 * Math.random()) + 's'
            };
            var sq = $('<div/>').css(style);
            back.append(sq);
        }
    }
}

(function ($) {
    $.fn.delay = function (time, callback) {
        // Empty function:
        jQuery.fx.step.delay = function () { };
        // Return meaningless animation, (will be added to queue)
        return this.animate({ delay: 1 }, time, callback);
    }
})(jQuery);

