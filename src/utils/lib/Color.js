const color = {};
color.names = {aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080", green: "#008000", greenyellow: "#adff2f", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#db7093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00", yellowgreen: "#9acd32"};

color.convert_ = {};
color.convert_.prependZeroIfNecessaryHelper = function(a){return 1 == a.length ? "0" + a : a};

color.convert_.hexToRgb = function(a){var b = parseInt(a.substr(1, 2), 16), c = parseInt(a.substr(3, 2), 16); a = parseInt(a.substr(5, 2), 16); return [b, c, a]}

color.convert_.rgbToHex = function(a, b, c){if (isNaN(a) || 0 > a || 255 < a || isNaN(b) || 0 > b || 255 < b || isNaN(c) || 0 > c || 255 < c) return "#000000"; a = this.prependZeroIfNecessaryHelper(a.toString(16)); b = this.prependZeroIfNecessaryHelper(b.toString(16)); c = this.prependZeroIfNecessaryHelper(c.toString(16)); return "#" + a + b + c};

color.convert_.rgbToHsl = function(a, b, c){a /= 255; b /= 255; c /= 255; var d = Math.max(a, b, c), e = Math.min(a, b, c), f = 0, g = 0, h = .5 * (d + e); d != e && (d == a ? f = 60 * (b - c) / (d - e) : d == b ? f = 60 * (c - a) / (d - e) + 120 : d == c && (f = 60 * (a - b) / (d - e) + 240), g = 0 < h && .5 >= h ? (d - e) / (2 * h) : (d - e) / (2 - 2 * h)); return [Math.round(f + 360) % 360, Math.round(g*100), Math.round(h*100)]};

color.convert_.rgbToHsv = function(a, b, c){var f, d = Math.max(Math.max(a, b), c),  e = Math.min(Math.min(a, b), c); if(e == d){ e = a = 0;}else{f = d - e;  e = f / d; a = 60 * (a == d ? (b - c) / f : b == d ? 2 + (c - a) / f : 4 + (a - b) / f); if(0 > a){a += 360}else if(360 < a){a -= 360}} return [Math.round(a), Math.round(e*100), Math.round(d*100/255)]};

color.convert_.rgbToCmyk = function(a, b, c){var d, e, f, g, h, i, j; if((a == 0) && (b == 0) && (c == 0)){d = e = f = 0; g = 1;}else{h = 1-(a / 255); i = 1-(b/255); j = 1-(c/255); g = Math.min(h, Math.min(i, j)); d = (h - g) / (1 - g); e = (i - g) / (1 - g); f = (j - g) / (1 - g);} return [Math.round(d*100), Math.round(e*100), Math.round(f*100), Math.round(g*100)]}

color.convert_.rgbToHwb = function(a, b, c){var d, e, f, g, h, i, j, k, l; h = this.rgbToHsv(a, b, c)[0]; a /= 255; b /= 255; c /= 255; f = Math.min(a, b, c); g = Math.max(a, b, c); c = 1 - g; if(g === f){ /*h = 0;*/  i = Math.round(f*100); j = Math.round(c*100); }else{ d = a === f ? b - c : (b === f ? c - a : a - b);e = a === f ? 3 : (b === f ? 5 : 1); /*h = Math.round(((((e - d / (g - f))/6)*100)*360)/100);*/ if(0 > h){h += 360}else if(360 < h){h -= 360} i = Math.round(f*100); j = Math.round(c*100);} return [Math.round(h), Math.round(i), Math.round(j)];}

color.convert_.hueToRgb_ = function(a, b, c){0 > c ? c += 1 : 1 < c && (c -= 1); return 1 > 6 * c ? a + 6 * (b - a) * c : 1 > 2 * c ? b : 2 > 3 * c ? a + (b - a) * (2 / 3 - c) * 6 : a};

color.convert_.hslToRgb = function(a, b, c){
  var g;
var d = 0, e = 0, f = 0; a /= 360; if(0 == b){d = e = f = 255 * c;}else{g = f = 0; g = .5 > c ? c * (1 + b) : c + b - b * c; f = 2 * c - g, d = 255 * this.hueToRgb_(f, g, a + 1 / 3); e = 255 * this.hueToRgb_(f, g, a); f = 255 * this.hueToRgb_(f, g, a - 1 / 3);} return [Math.round(d), Math.round(e), Math.round(f)]};

color.convert_.hsvToRgb = function(a, b, c){var r, g, d, e, f, h, i, k, l, m; if(b==0){r = g = b = Math.round(c*255);}else{h = ((a*6)==6)? 0 : a*6; i = Math.floor(h); k = c*(1-b); l = c*(1-b*(h- i)); m = c*(1-b*(1-(h-i))); if(i==0){d = c; e = m; f = k;}else if(i==1){d = l; e = c; f = k;}else if(i==2){d = k; e = c; f = m}else if(i==3){d = k; e = l; f = c;}else if(i==4){d = m; e = k; f = c;}else{d = c; e = k; f = l} r=Math.round(d * 255); g=Math.round(e * 255); b=Math.round(f * 255);} return [r, g, b];};

color.convert_.cmykToRgb = function(a, b, c, d){var e = 255 * (1 - a) * (1 - d), f = 255 * (1 - b) * (1 - d), g = 255 * (1 - c) * (1 - d); return [Math.round(e), Math.round(f), Math.round(g)]};

color.convert_.hwbToRgb = function(a, b, c){var d, e, f, g, h, i, j; a = a*6; g = 1 - c; j = a|0; i = a - j; if(j & 1){i = 1 - i} h = b + i * (g - b); g = (g * 255)|0; h = (h * 255)|0; b = (b * 255)|0; if(j == 0){d = g; e = h; f = b;}else if(j == 1){d = h; e = g; f = b;}else if(j == 2){d = b; e = g; f = h;}else if(j == 3){d = b; e = h; f = g;}else if(j == 4){d = h; e = b; f = g;}else if(j == 5){d = g; e = b; f = h;}else{d = e = f = g} return [Math.round(d), Math.round(e), Math.round(f)];};

color.convert_.blend = function(a, b, c){c = c/100; c = Math.min(Math.max(c, 0), 1); return [Math.round(c * a[0] + (1 - c) * b[0]), Math.round(c * a[1] + (1 - c) * b[1]), Math.round(c * a[2] + (1 - c) * b[2])]};
color.convert_.darken = function(a, b){return this.blend([0, 0, 0], a, b)};
color.convert_.lighten = function(a, b){return this.blend([255, 255, 255], a, b)};

color.convert_.grayScale = function(a){var b = Math.round((a[0] + a[1] + a[2])/3); return [b, b, b];}
color.convert_.colorScale = function(a, b, c){a = this.grayScale(a)[0]; b = b==undefined? [255, 255, 255] : b; c = c==undefined? [0, 0, 0] : c; var d = (a*100)/255, e = this.blend(b, c, d);  return e;}
color.convert_.watershed = function(a){var b = this.grayScale(a), c = b[0], e = 255/2; if(c >= e){return [255, 255, 255]}else{return [0, 0, 0]}}
color.convert_.growing = function(a){var b = this.grayScale(a), c = b[0], e = this.hslToRgb(Math.round((c*360)/255), 100/100, 50/100); return e;}

color.convert_.negative = function(a){return [Math.round(255-a[0]), Math.round(255-a[1]), Math.round(255-a[2])];}

color.convert_.hslDistance = function(a, b){a = [a[0], a[1]/100, a[2]/100]; b = [b[0], b[1]/100, b[2]/100]; var c, d; c = .5 >= a[2] ? a[1] * a[2] : a[1] * (1 - a[2]); d = .5 >= b[2] ? b[1] * b[2] : b[1] * (1 - b[2]); return Math.round(((a[2] - b[2]) * (a[2] - b[2]) + c * c + d * d - 2 * c * d * Math.cos(2 * (a[0] / 360 - b[0] / 360) * Math.PI))*100)};

color.convert_.stringToArray = function(a){
var $this = {}, b, c, d, e; 
b = /^((?:rgb|hs[lv]|cmyk|hwb)a?)\s*\(([^\)]*)\)/.exec(String(a));
if(b){c = b[1]; d = c.replace(/a$/, ''); e = d === 'cmyk' ? 4 : 3; b[2] = b[2].replace(/^\s+|\s+$/g, '').split(/\s*,\s*/).map(function(x, i){if(/%$/.test(x) && i === e){return parseFloat(x) / 100;}else if(/%$/.test(x)){return parseFloat(x);}return parseFloat(x);}); $this.type = d; $this.string = a; $this.array = b[2];
}else if(/^#[A-Fa-f0-9]+$/.test(a)){$this.type = 'hex'; $this.string = a; $this.array = [a];
}else{$this.type = undefined; $this.string = undefined; $this.array = undefined;}
return $this;
}

color.name = function(a){
	a = String(a);
	var $this = {hex:"#000000", rgb:[0, 0, 0, "rgb(0,0,0)"], hsl:[0, 0, 0], hsv:[0, 0, 0], cmyk:[0, 0, 0, 100], hwb:[0, 0, 100], string:"black", isValidColor:false};
	
	try{
		$this.hex = this.names[a] == null | this.names[a] == '' ? "#000000" : this.names[a];
		$this.rgb = this.hex($this.hex).rgb;
		$this.hsl = this.hex($this.hex).hsl;
		$this.hsv = this.hex($this.hex).hsv;
		$this.cmyk = this.hex($this.hex).cmyk;
		$this.hwb = this.hex($this.hex).hwb;
		$this.string = String(this.names[a] == null | this.names[a] == '' ? "black" : a);
		$this.isValidColor = this.names[a] == null | this.names[a] == '' ? false : true;
		return $this;
	}catch(e){return $this;}
}

color.hex = function(a){
	a = String(a);
	a = "#" == a.charAt(0) ? a : "#" + a;
	var $this = {}, b = a,
		hexTripletRe_ = /#(.)(.)(.)/,
		validHexColorRe_ = /^#(?:[0-9a-f]{3}){1,2}$/i,

		isValidHexColor_ = function(a){return validHexColorRe_.test(a)},
		normalizeHex = function(a){if (!isValidHexColor_(a)) a = '#000000'; 4 == a.length && (a = a.replace(hexTripletRe_, "#$1$1$2$2$3$3")); return a.toLowerCase()};
	
	a = normalizeHex(a);
	$this.hex = a;
	$this.rgb = this.convert_.hexToRgb(a);
	$this.hsl = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hsl;
	$this.hsv = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hsv;
	$this.cmyk = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).cmyk;
	$this.hwb = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hwb;
	$this.string = String(a);
	$this.isValidColor = isValidHexColor_(b);
	
	return $this;
}

color.rgb = function(a, b, c){
	a =  Math.round(Number(a)); b =  Math.round(Number(b)); c =  Math.round(Number(c));
	
	var $this = {}, isValidRgbColor_ = function(){var a = $this.string, b = a.match(/^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i), c; if(b){a = Number(b[1]); c = Number(b[2]); b = Number(b[3]); if(0 <= a && 255 >= a && 0 <= c && 255 >= c && 0 <= b && 255 >= b){return true}} return false};
	
	$this.hex = this.convert_.rgbToHex(a, b, c);
	$this.rgb = [a, b, c];
	$this.hsl = this.convert_.rgbToHsl(a, b, c);
	$this.hsv = this.convert_.rgbToHsv(a, b, c);
	$this.cmyk = this.convert_.rgbToCmyk(a, b, c);
	$this.hwb = this.convert_.rgbToHwb(a, b, c);
	$this.string = "rgb(" + $this.rgb.join(",") + ")";
	$this.isValidColor = isValidRgbColor_();
	
	return $this;
}

color.hsl = function(a, b, c){
	a =  Math.round(Number(a)); b =  Number(b)/100; c = Number(c)/100;
	
	var $this = {}, isValidHslColor_ = function(){if(a<=360 & a>=0 & b<=1 & b>=0 & c<=1 & c>=0){return true}else{return false}};
	
	$this.rgb = this.convert_.hslToRgb(a, b, c);
	$this.hex = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hex;
	$this.hsl = [Math.round(a),  Math.round(b*100),  Math.round(c*100)];
	$this.hsv = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hsv;
	$this.cmyk = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).cmyk;
	$this.hwb = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hwb;
	$this.string = "hsl(" + $this.hsl.join(", ") + ")";
	$this.isValidColor = isValidHslColor_();
	
	return $this;
}

color.hsv = function(a, b, c){
	a =  Math.round(Number(a)); b = Number(b)/100; c = Number(c)/100;
	
	var $this = {}, isValidHsvColor_ = function(){if(a<=360 & a>=0 & b<=1 & b>=0 & c<=1 & c>=0){return true}else{return false}};
	
	$this.rgb = this.convert_.hsvToRgb(a, b, c);
	$this.hex = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hex;
	$this.hsl = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hsl;
	$this.hsv = [ Math.round(a),  Math.round(b*100),  Math.round(c*100)];
	$this.cmyk = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).cmyk;
	$this.hwb = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hwb;
	$this.string = "hsv(" + $this.hsv.join(",") + ")";
	$this.isValidColor = isValidHsvColor_();
	
	return $this;
}

color.cmyk = function(a, b, c, d){
	a = Number(a)/100; b = Number(b)/100; c = Number(c)/100; d = Number(d)/100;
	
	var $this = {}, isValidCmykColor_ = function(){if(a<=1 & a>=0 & b<=1 & b>=0 & c<=1 & c>=0){return true}else{return false}};
	
	$this.rgb = this.convert_.cmykToRgb(a, b, c, d);
	$this.hex = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hex;
	$this.hsl = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hsl;
	$this.hsv = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hsv;
	$this.cmyk = [ Math.round(a*100),  Math.round(b*100),  Math.round(c*100),  Math.round(d*100)];
	$this.hwb = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hwb;
	$this.string = "cmyk(" + $this.cmyk.join(", ") + ")";
	$this.isValidColor = isValidCmykColor_();
	
	return $this;
}

color.hwb = function(a, b, c){
	a = Number(a)/360; b = Number(b)/100; c = Number(c)/100;
	
	var $this = {}, isValidHwbColor_ = function(){if(a<=1 & a>=0 & b<=1 & b>=0 & c<=1 & c>=0){return true}else{return false}};
	
	$this.rgb = this.convert_.hwbToRgb(a, b, c);
	$this.hex = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hex;
	$this.hsl = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hsl;
	$this.hsv = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).hsv;
	$this.cmyk = this.rgb($this.rgb[0], $this.rgb[1], $this.rgb[2]).cmyk;
	$this.hwb = [ Math.round(a*360),  Math.round(b*100),  Math.round(c*100)];
	$this.string = "hwb(" + $this.hwb.join(", ") + ")";
	$this.isValidColor = isValidHwbColor_();
	
	return $this;
}

color.parse = function(a){
  var $this = {};
  try{
    var b = this.convert_.stringToArray(a), c, d, e;
  if(b.type != undefined){
    c = b.array; d = b.type; e = b.string;
    if(d == 'rgb'){$this = this.rgb(c[0], c[1], c[2])}else
    if(d == 'hsl'){$this = this.hsl(c[0], c[1], c[2])}else
    if(d == 'hsv'){$this = this.hsv(c[0], c[1], c[2])}else
    if(d == 'cmyk'){$this = this.hsv(c[0], c[1], c[2], c[3])}else
    if(d == 'hwb'){$this = this.hwb(c[0], c[1], c[2])}else
    if(d == 'hex'){$this = this.hex(e)}
  }else{$this = this.name(a)}
  }catch(e){$this = this.name(a);}

  $this.distance = function(a){a = color.parse(a).hsl; return color.convert_.hslDistance($this.hsl, [a[0], a[1], a[2]])};

  $this.blend = function(a, b){b = color.convert_.blend($this.rgb, color.parse(a).rgb, b); b.string = 'rgb('+b[0]+','+b[1]+','+b[2]+')'; return b};
  $this.darken = function(a){var b = color.convert_.darken($this.rgb, a); b.string = 'rgb('+b[0]+','+b[1]+','+b[2]+')'; return b};
  $this.lighten = function(a){var b = color.convert_.lighten($this.rgb, a); b.string = 'rgb('+b[0]+','+b[1]+','+b[2]+')'; return b};

  $this.grayScale = function(){var b = color.convert_.grayScale($this.rgb); b.string = 'rgb('+b[0]+','+b[1]+','+b[2]+')'; return b};
  $this.colorScale = function(a, b){b = color.convert_.colorScale($this.rgb, color.parse(a==undefined? '#ffffff' : a).rgb, color.parse(b==undefined? '#000000' : b).rgb); b.string = 'rgb('+b[0]+','+b[1]+','+b[2]+')'; return b};
  $this.watershed = function(){var b = color.convert_.watershed($this.rgb); b.string = 'rgb('+b[0]+','+b[1]+','+b[2]+')'; return b};
  $this.growing = function(){var b = color.convert_.growing($this.rgb); b.string = 'rgb('+b[0]+','+b[1]+','+b[2]+')'; return b};

  $this.negative = function(){var b = color.convert_.negative($this.rgb); b.string = 'rgb('+b[0]+','+b[1]+','+b[2]+')'; return b};

  $this.rgb.string = 'rgb('+$this.rgb[0]+', '+$this.rgb[1]+', '+$this.rgb[2]+')';
  $this.hsl.string = 'hsl('+$this.hsl[0]+', '+$this.hsl[1]+'%, '+$this.hsl[2]+'%)';
  $this.hsv.string = 'hsv('+$this.hsv[0]+', '+$this.hsv[1]+'%, '+$this.hsv[2]+'%)';
  $this.cmyk.string = 'cmyk('+$this.cmyk[0]+'%, '+$this.cmyk[1]+'%, '+$this.cmyk[2]+'%, '+$this.cmyk[3]+'%)';
  $this.hwb.string = 'hwb('+$this.hwb[0]+', '+$this.hwb[1]+'%, '+$this.hwb[2]+'%)';

  return $this;
};

export default (a)=>{
  return color.parse(a);
}