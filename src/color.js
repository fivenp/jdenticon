/**
 * Jdenticon
 * https://github.com/dmester/jdenticon
 * Copyright © Daniel Mester Pirttijärvi
 */
"use strict";

function decToHex(v) {
    v |= 0; // Ensure integer value
    return v < 0 ? "00" :
        v < 16 ? "0" + v.toString(16) :
        v < 256 ? v.toString(16) :
        "ff";
}

function hueToRgb(m1, m2, h) {
    h = h < 0 ? h + 6 : h > 6 ? h - 6 : h;
    return decToHex(255 * (
        h < 1 ? m1 + (m2 - m1) * h :
        h < 3 ? m2 :
        h < 4 ? m1 + (m2 - m1) * (4 - h) :
        m1));
}

/**
 * Functions for converting colors to hex-rgb representations.
 * @private
 */
var color = {
    /**
     * @param {number} r Red channel [0, 255]
     * @param {number} g Green channel [0, 255]
     * @param {number} b Blue channel [0, 255]
     */
    rgb: function (r, g, b) {
        return "#" + decToHex(r) + decToHex(g) + decToHex(b);
    },
    /**
     * @param {any} color  Color value to parse. Curently hexadecimal strings on the format #rgb[a] and #rrggbb[aa] are supported.
     */
    parse: function (color) {
        if (/^#[0-9a-f]{3,8}$/i.test(color)) {
            if (color.length < 6) {
                var r = color[1],
                    g = color[2],
                    b = color[3],
                    a = color[4] || "";
                return "#" + r + r + g + g + b + b + a + a;
            }
            if (color.length == 7 || color.length > 8) {
                return color;
            }
        }
    },
    /**
     * @param {string} hexColor  Color on the format "#RRGGBB" or "#RRGGBBAA"
     */
    toCss3: function (hexColor) {
        var a = parseInt(hexColor.substr(7, 2), 16);
        if (isNaN(a)) {
            return hexColor;
        }
        var r = parseInt(hexColor.substr(1, 2), 16),
            g = parseInt(hexColor.substr(3, 2), 16),
            b = parseInt(hexColor.substr(5, 2), 16);
        return "rgba(" + r + "," + g + "," + b + "," + (a / 255).toFixed(2) + ")";
    },
    /**
     * @param h Hue [0, 1]
     * @param s Saturation [0, 1]
     * @param l Lightness [0, 1]
     */
    hsl: function (h, s, l) {
        // Based on http://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color
        if (s == 0) {
            var partialHex = decToHex(l * 255);
            return "#" + partialHex + partialHex + partialHex;
        }
        else {
            var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s,
                m1 = l * 2 - m2;
            return "#" +
                hueToRgb(m1, m2, h * 6 + 2) +
                hueToRgb(m1, m2, h * 6) +
                hueToRgb(m1, m2, h * 6 - 2);
        }
    },
    // This function will correct the lightness for the "dark" hues
    correctedHsl: function (h, s, l) {
        // The corrector specifies the perceived middle lightnesses for each hue
        var correctors = [ 0.55, 0.5, 0.5, 0.46, 0.6, 0.55, 0.55 ],
            corrector = correctors[(h * 6 + 0.5) | 0];

        // Adjust the input lightness relative to the corrector
        l = l < 0.5 ? l * corrector * 2 : corrector + (l - 0.5) * (1 - corrector) * 2;

        return color.hsl(h, s, l);
    },
    shadeBlendConvert: function (p, from, to) {
        if(typeof(p)!="number"||p<-1||p>1||typeof(from)!="string"||(from[0]!='r'&&from[0]!='#')||(to&&typeof(to)!="string"))return null; //ErrorCheck
        if(!this.sbcRip)this.sbcRip=(d)=>{
            let l=d.length,RGB={};
            if(l>9){
                d=d.split(",");
                if(d.length<3||d.length>4)return null;//ErrorCheck
                RGB[0]=i(d[0].split("(")[1]),RGB[1]=i(d[1]),RGB[2]=i(d[2]),RGB[3]=d[3]?parseFloat(d[3]):-1;
            }else{
                if(l==8||l==6||l<4)return null; //ErrorCheck
                if(l<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(l>4?d[4]+""+d[4]:""); //3 or 4 digit
                d=i(d.slice(1),16),RGB[0]=d>>16&255,RGB[1]=d>>8&255,RGB[2]=d&255,RGB[3]=-1;
                if(l==9||l==5)RGB[3]=r((RGB[2]/255)*10000)/10000,RGB[2]=RGB[1],RGB[1]=RGB[0],RGB[0]=d>>24&255;
            }
        return RGB;}
        var i=parseInt,r=Math.round,h=from.length>9,h=typeof(to)=="string"?to.length>9?true:to=="c"?!h:false:h,b=p<0,p=b?p*-1:p,to=to&&to!="c"?to:b?"#000000":"#FFFFFF",f=this.sbcRip(from),t=this.sbcRip(to);
        if(!f||!t)return null; //ErrorCheck
        if(h)return "rgb"+(f[3]>-1||t[3]>-1?"a(":"(")+r((t[0]-f[0])*p+f[0])+","+r((t[1]-f[1])*p+f[1])+","+r((t[2]-f[2])*p+f[2])+(f[3]<0&&t[3]<0?")":","+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*10000)/10000:t[3]<0?f[3]:t[3])+")");
        else return "#"+(0x100000000+r((t[0]-f[0])*p+f[0])*0x1000000+r((t[1]-f[1])*p+f[1])*0x10000+r((t[2]-f[2])*p+f[2])*0x100+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*255):t[3]>-1?r(t[3]*255):f[3]>-1?r(f[3]*255):255)).toString(16).slice(1,f[3]>-1||t[3]>-1?undefined:-2);
    }
};

module.exports = color;
