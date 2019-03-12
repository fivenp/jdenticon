/**
 * Jdenticon
 * https://github.com/dmester/jdenticon
 * Copyright © Daniel Mester Pirttijärvi
 */
"use strict";

const color = require("./color");

/**
 * Gets a set of identicon color candidates for a specified hue and config.
 */
function colorTheme(hue, config) {
    return [
        // Dark gray
        config.opaqueGrayscale ? "#000000"+parseInt((config.grayscaleLightness(0)*100)).toString(16) : color.hsl(0, 0, config.grayscaleLightness(0)),
        // Mid color
        config.mainColor ? config.mainColor : color.correctedHsl(hue, config.saturation, config.colorLightness(0.5)),
        // Light gray
        config.opaqueGrayscale ? "#ffffff"+parseInt((config.grayscaleLightness(1)*100)).toString(16) : color.hsl(0, 0, config.grayscaleLightness(1)),
        // Light color
        config.mainColor ? color.shadeBlendConvert(config.colorLightness(1), config.mainColor) : color.correctedHsl(hue, config.saturation, config.colorLightness(1)),
        // Dark color
        config.mainColor ? color.shadeBlendConvert((config.colorLightness(0))*-1, config.mainColor) : color.correctedHsl(hue, config.saturation, config.colorLightness(0))
    ];
}

module.exports = colorTheme;
