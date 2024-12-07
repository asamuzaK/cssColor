/**
 * constant.js
 */

/* syntax */
export const FUNC_CALC = 'calc(';
export const FUNC_VAR = 'var(';
export const NONE = 'none';
export const SYN_ANGLE = 'deg|g?rad|turn';
export const SYN_SRGB = 'srgb(?:-linear)?';
export const SYN_COLOR_SPACE_XYZ = 'xyz(?:-d(?:50|65))?';
export const SYN_COLOR_SPACE_COLOR_MIX =
  `(?:ok)?l(?:ab|ch)|h(?:sl|wb)|${SYN_SRGB}|${SYN_COLOR_SPACE_XYZ}`;
export const SYN_COLOR_SPACE_RGB =
  `(?:a98|prophoto)-rgb|display-p3|rec2020|${SYN_SRGB}`;
export const SYN_NUM =
  '[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?';
export const SYN_PCT = `${SYN_NUM}%`;
export const SYN_HSL = `(?:${SYN_NUM}(?:${SYN_ANGLE})?|${NONE})(?:\\s+(?:${SYN_PCT}|${SYN_NUM}|${NONE})){2}(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
export const SYN_HSL_LV3 = `${SYN_NUM}(?:${SYN_ANGLE})?(?:\\s*,\\s*${SYN_PCT}){2}(?:\\s*,\\s*(?:${SYN_NUM}|${SYN_PCT}))?`;
export const SYN_RGB = `(?:${SYN_NUM}|${SYN_PCT}|${NONE})(?:\\s+(?:${SYN_NUM}|${SYN_PCT}|${NONE})){2}(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
export const SYN_RGB_LV3 = `(?:${SYN_NUM}(?:\\s*,\\s*${SYN_NUM}){2}|${SYN_PCT}(?:\\s*,\\s*${SYN_PCT}){2})(?:\\s*,\\s*(?:${SYN_NUM}|${SYN_PCT}))?`;
export const SYN_LAB = `(?:${SYN_NUM}|${SYN_PCT}|${NONE})(?:\\s+(?:${SYN_NUM}|${SYN_PCT}|${NONE})){2}(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
export const SYN_LCH = `(?:(?:${SYN_NUM}|${SYN_PCT}|${NONE})\\s+){2}(?:${SYN_NUM}(?:${SYN_ANGLE})?|${NONE})(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
export const SYN_COLOR_FUNC = `(?:${SYN_COLOR_SPACE_RGB}|${SYN_COLOR_SPACE_XYZ})(?:\\s+(?:${SYN_NUM}|${SYN_PCT}|${NONE})){3}(?:\\s*\\/\\s*(?:${SYN_NUM}|${SYN_PCT}|${NONE}))?`;
export const SYN_COLOR_TYPE = `[a-z]+|#(?:[\\da-f]{3}|[\\da-f]{4}|[\\da-f]{6}|[\\da-f]{8})|hsla?\\(\\s*(?:${SYN_HSL}|${SYN_HSL_LV3})\\s*\\)|hwb\\(\\s*${SYN_HSL}\\s*\\)|rgba?\\(\\s*(?:${SYN_RGB}|${SYN_RGB_LV3})\\s*\\)|(?:ok)?lab\\(\\s*${SYN_LAB}\\s*\\)|(?:ok)?lch\\(\\s*${SYN_LCH}\\s*\\)|color\\(\\s*${SYN_COLOR_FUNC}\\s*\\)`;
export const SYN_COLOR_MIX_PART = `(?:${SYN_COLOR_TYPE})(?:\\s+${SYN_PCT})?`;
export const SYN_COLOR_MIX = `color-mix\\(\\s*in\\s+(?:${SYN_COLOR_SPACE_COLOR_MIX})\\s*,\\s*${SYN_COLOR_MIX_PART}\\s*,\\s*${SYN_COLOR_MIX_PART}\\s*\\)`;
export const SYN_COLOR_MIX_CAPT = `color-mix\\(\\s*in\\s+(${SYN_COLOR_SPACE_COLOR_MIX})\\s*,\\s*(${SYN_COLOR_MIX_PART})\\s*,\\s*(${SYN_COLOR_MIX_PART})\\s*\\)`;
