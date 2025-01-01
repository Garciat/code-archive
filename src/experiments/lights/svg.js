SVG = (function() {
	// -- Aliases
	var doc = document;
	
	// -- Helpers
	containers = [SVGSVGElement, SVGGElement, SVGDefsElement, SVGSymbolElement];
	showContainers = [SVGSVGElement, SVGGElement];
	
	function groupProto(group, name, func)
	{
		for (var i in group)
		{
			group[i].prototype[name] = func;
		}
	}
	
	function randomID()
	{
		var d = new Date();
		return 'f' + d.getTime() + '-' + Math.floor(1000*Math.random());
	}
	
	// Constructor
	var SVG = function(width, height)
	{
		if (this == window)
			throw TypeError('Illegal constructor');
		
		var svg = new SVG.element('svg');
		
		svg.attr({xmlns:SVG.xmlns, version:SVG.version});
		
		if (parseInt(width))
			svg.attr('width', parseInt(width));
		
		if (parseInt(height))
			svg.attr('height', parseInt(height));
		
		svg.defs = svg.newChild('defs');
		
		return svg;
	}
	SVG.xmlns = 'http://www.w3.org/2000/svg';
	SVG.version = '1.1';
	SVG.element = function(nodeName, attrs)
	{
		if (this == window)
			throw TypeError('Illegal constructor');
		
		var element = doc.createElementNS(SVG.xmlns, nodeName);
		
		if (typeof attrs == 'object')
		{
			element.attr(attrs);
		}
		
		return element;
	}
	
	// All
	SVGElement.prototype.newChild = function(nodeName, attrs)
	{
		return this.append(new SVG.element(nodeName, attrs));
	}
	SVGElement.prototype.attr = function()
	{
		if (typeof arguments[0] == 'object')
		{
			for (var i in arguments[0])
			{
				this.attr(i, arguments[0][i]);
			}
		}
		else if (arguments.length == 1)
		{
			return this.getAttribute(arguments[0]);
		}
		else if (arguments.length == 2)
		{
			this.setAttribute(arguments[0], arguments[1]);
		}
		
		return this;
	}
	SVGElement.prototype.clear = function()
	{
		while(this.hasChildNodes())
		{
			this.removeChild(this.firstChild);
		}
		return this;
	}
	SVGElement.prototype.append = function(elem)
	{
		return this.appendChild(elem);
	}
	SVGElement.prototype.remove = function()
	{
		this.parentNode.removeChild(this);
	}
	SVGElement.prototype.applyFilter = function(id)
	{
		return this.attr({filter:'url(#'+id+')'});
	}
	SVGElement.prototype.fillFilter = function(id)
	{
		return this.attr({fill:'url(#'+id+')'});
	}
	
	// -- Groups
	// Containers
	
	
	// Showing Containers
	groupProto(showContainers, 'group', function() {
		return this.append(new SVG.element('g'));
	});
	// Basic shapes
	groupProto(showContainers, 'rect', function(x, y, w, h, r) {
		r = parseFloat(r) ? r : 0;
		return this.append(new SVG.element('rect', {x:x, y:y, width:w, height:h, rx:r, ry:r}));
	});
	groupProto(showContainers, 'circle', function(x, y, r) {
		return this.append(new SVG.element('circle', {cx:x, cy:y, r:r}));
	});
	groupProto(showContainers, 'ellipse', function(x, y, rx, ry) {
		return this.append(new SVG.element('ellipse', {cx:x, cy:y, rx:rx, ry:ry}));
	});
	// Text
	groupProto(showContainers, 'text', function(x, y, text) {
		var element = this.append(new SVG.element('text', {x:x, y:y}));
		element.append(doc.createTextNode(text));
		return element;
	});
	// Path
	groupProto(showContainers, 'path', function(pathString) {
		return this.append(new SVG.element('path', {d:pathString}));
	});
	
	// -- Individuals
	// SVG
	SVGSVGElement.prototype.toImage = function()
	{
		var img = new Image();
		var svg_xml = (new XMLSerializer()).serializeToString(this);
		img.src = 'data:image/svg+xml;base64,' + btoa(svg_xml);
		return img;
	}
	SVGSVGElement.prototype.title = function(text)
	{
		var title = this.querySelector('svg>title');
		if (!title)
		{
			title = new SVG.element('title');
			this.insertBefore(title, this.firstChild);
		}
		title.clear().append(doc.createTextNode(text));
		return this;
	}
	SVGSVGElement.prototype.desc = function(text)
	{
		var desc = this.querySelector('svg>desc');
		if (!desc)
		{
			desc = new SVG.element('desc');
			
			var title = this.querySelector('svg>title');
			if (title)
			{
				this.insertBefore(desc, title.nextSibling)
			}
			else
			{
				this.insertBefore(desc, this.firstChild);
			}
		}
		desc.clear().append(doc.createTextNode(text));
		return this;
	}
	SVGSVGElement.prototype.clear = function()
	{
		var elems = this.querySelectorAll('svg>*:not(title):not(desc):not(defs)');
		for (var i=0; i<elems.length; i++)
		{
			elems[i].remove();
		}
		return this;
	}
	
	// -- Defs
	// Filters
	SVGDefsElement.prototype.filter = function(id)
	{
		id = id || randomID();
		return this.append(new SVG.element('filter', {id:id}));
	}
	SVGDefsElement.prototype.blur = function(r)
	{
		if (typeof SVGDefsElement.prototype.blur.storage == 'undefined')
		{
			SVGDefsElement.prototype.blur.storage = {};
		}
		var storage = SVGDefsElement.prototype.blur.storage;
		
		r = parseInt(r) ? parseInt(r) : 0;
		
		if (r in storage)
		{
			return storage[r];
		}
		
		var filter = this.filter();
		var id = filter.attr('id');
		filter.newChild('feGaussianBlur', {'in':'SourceGraphic', stdDeviation:r});
		
		storage[r] = id;
		return id;
	}
	SVGDefsElement.prototype.blend = function(type)
	{
		if (typeof SVGDefsElement.prototype.blend.storage == 'undefined')
		{
			SVGDefsElement.prototype.blend.storage = {};
		}
		var storage = SVGDefsElement.prototype.blend.storage;
		
		if (type in storage)
		{
			return storage[type];
		}
		
		var filter = this.filter();
		var id = filter.attr('id');
		filter.newChild('feBlend', {mode:type, 'in':'SourceGraphic', 'in2':'BackgroundImage'});
		
		storage[r] = id;
		return id;
	}
	// Gradients. usage: linearGrad(90, {0:'rgba(0,0,0,1)', 100:'#FFF'})
	SVGDefsElement.prototype.linearGrad = function(angle, stops)
	{
		var id = id || randomID();
		var grad = this.newChild('linearGradient', {id:id, x1:'0%', y1:'0%', x2:Math.round(100*Math.sin(angle*Math.PI/180))+'%', y2:Math.round(100*Math.sin((90-angle)*Math.PI/180))+'%'});
		
		for(i in stops)
		{
			var color = stops[i];
			var opacity = 1;
			
			var matches = /^rgba\(([^,]*),[\s]*([^,]*),[\s]*([^,]*),[\s]*([^)]*)\)$/i.exec(color);
			if (matches)
			{
				color = 'rgb('+matches[1]+','+matches[2]+','+matches[3]+')';
				opacity = parseFloat(matches[4]);
			}
			
			var stop = grad.newChild('stop', {offset:i+'%', 'stop-color':color, 'stop-opacity':opacity});
		}
		
		return id;
	}
	
	return SVG;
})();
