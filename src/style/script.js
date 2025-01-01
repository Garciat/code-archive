var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

window.addEventListener('load', function() {
	var items = read_items();
	
	$('table').remove();
	
	var container = document.createElement('div');
	container.id = 'items';
	
	$('body').append(container);
	
	write_items(items);
}, false);

function request_uri()
{
	return window.location.pathname;
}

function location_origin()
{
	if(window.location.hasOwnProperty('origin'))
		return window.location.origin;
	return 'http://' + window.location.hostname;
}

function read_items()
{
	var items = [];
	
	$('tr>td>a').each(function() {
		items.push(this.href.replace(location_origin(), ''));
	});
	
	return items;
}

function write_items(items)
{
	$.ajax({
		url: window.location.href + 'apache_desc.json',
		success: function(data) {
			if(typeof data == 'string')
				data = $.parseJSON(data);
			finished(data);
		},
		error: function() {
			finished({});
		}
	});
	
	var finished = function(info) {
		var list = [], list_info = [], show = [], $container = $('#items');	
		
		for(i in items)
		{
			var item = {path: items[i]}
			
			if(item.path.length < request_uri().length)
			{
				item.parent = true;
				item.title = 'Parent Directory';
				item.prefix = window.location.hostname + item.path;
				
				show.push(item);
			}
			else
			{
				var parts = item.path.split('/');
				item.title = item.path.substr(-1)=='/' ? [parts.pop(),parts.pop()].reverse().join('/') : parts.pop();
				item.prefix = window.location.hostname + parts.concat(['']).join('/');
				
				if(item.title in info)
				{
					item.description = info[item.title]['description'] ? info[item.title]['description'] : undefined;
					item.timestamp = info[item.title]['timestamp'] ? info[item.title]['timestamp'] : undefined;
					
					if(item.timestamp)
					{
						var k = item.timestamp;
						list_info[k] = item;
						continue;
					}
				}
				
				list.push(item);
			}
		}
		
		list_info_keys = array_keys(list_info).sort().reverse();
		for(i in list_info_keys)
		{
			var key = list_info_keys[i];
			show.push(list_info[key]);
		}
		
		show = show.concat(list);
		
		$.each(show, function(i) {
			var item = this;

			var $item = $(document.createElement('a'));
			$item.addClass('item');
			$item.attr('href', item.path);
			$item.html(item.title);
			if(item.parent) {
				$item.html('&nbsp;');
				$item.addClass('parent');
			}
		
			var $prefix = $(document.createElement('span'));
			$prefix.addClass('prefix');
			$prefix.html(item.prefix);
			$item.append($prefix);
			
			var $info = $(document.createElement('span'));
			$info.addClass('info');
		
			if(item.timestamp)
			{
				var date = new Date(Date.parse(item.timestamp));
				var m = months[date.getMonth()];
				var d = date.getDate();
				var y = date.getFullYear();
				
				var $time = $(document.createElement('time'));
				$time.html(m+' '+d+', '+y);
				$info.append($time);
			}
			
			if(item.description)
			{
				var $description = $(document.createElement('span'));
				$description.html(item.description);
				$info.append($description);
			}
			
			if($info.children().length > 0)
				$item.append($info);
		
			$container.append($item);
		});
	}
}

function array_keys(array)
{
	var keys = [];
	for(k in array)
	{
		keys.push(k);
	}
	return keys;
}
