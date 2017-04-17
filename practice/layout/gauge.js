function drawMeter() {
	drawArc("event-meter", "Event", "5", "", "#41940c");
	drawArc("quality-meter", "Quality", "30", "%", "#009688");
	drawArc("risk-meter", "Risk", "1.2", "", "#d45600");
	drawArc("financial-meter", "Financial", "70", "%", "#3f51b5");
}

function drawArc(path, label, value, formatType, color) {
	// var label = "Financial";
	// var value = 50;

	var ratio = value / 100;

	var pie = d3.layout.pie()
		.value(function(d) {
			return d
		})
		.sort(null);

	var w = 230,
		h = 120;

	var outerRadius = 115;
	var innerRadius = 100;

	var color = ['#ececec', color, '#888888'];

	var colorOld = '#F00';
	var colorNew = '#0F0';

	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius)
		.startAngle(0)
		.endAngle(Math.PI);

	var arcLine = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius)
		.startAngle(0);

	var svg = d3.select("#" + path)
		.append("svg")
		.attr({
			width: w,
			height: h,
			class: 'shadow'
		}).append('g')
		.attr({
			transform: 'translate(' + (w / 2) + ',' + (h - 2) + ')'
		});

	var path = svg.append('path')
		.attr({
			d: arc,
			transform: 'rotate(-90)'
		}).attr({
			'stroke-width': "1",
			stroke: "#666666"
		})
		.style({
			fill: color[0]
		});

	var pathForeground = svg.append('path')
		.datum({
			endAngle: 0
		})
		.attr({
			d: arcLine,
			transform: 'rotate(-90)'
		})
		.style({
			fill: function(d, i) {
				return color[1];
			}
		});

	var middleLabel = svg.append('text')
		.datum(label)
		.text(function(d) {
			return d;
		})
		.attr({
			class: 'header',
			'text-anchor': 'middle',
			dy: -60,
			dx: 0
		})
		.style({
			fill: d3.rgb('#000000'),
		});

	var middleCount = svg.append('text')
		.datum(0)
		.text(function(d) {
			return d;
		})
		.attr({
			class: 'content',
			'text-anchor': 'middle',
			dy: -12,
			dx: 5
		})
		.style({
			fill: function(d, i) {
				return color[1];
			}
		});

	var oldValue = 0;
	var arcTween = function(transition, newValue, oldValue) {
		transition.attrTween("d", function(d) {
			var interpolate = d3.interpolate(d.endAngle, ((Math.PI)) * (newValue / 100));

			var interpolateCount = d3.interpolate(oldValue, newValue);

			return function(t) {
				d.endAngle = interpolate(t);
				middleCount.text(Math.floor(interpolateCount(t)) + formatType);

				return arcLine(d);
			};
		});
	};

	pathForeground.transition()
		.duration(750)
		.ease('cubic')
		.call(arcTween, value, oldValue);
}
