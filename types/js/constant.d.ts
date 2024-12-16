export const ANGLE: "deg|g?rad|turn";
export const CS_SRGB: "srgb(?:-linear)?";
export const CS_RGB: "(?:a98|prophoto)-rgb|display-p3|rec2020|srgb(?:-linear)?";
export const CS_XYZ: "xyz(?:-d(?:50|65))?";
export const CS_MIX: "(?:ok)?l(?:ab|ch)|h(?:sl|wb)|srgb(?:-linear)?|xyz(?:-d(?:50|65))?";
export const FUNC_CALC: "calc(";
export const FUNC_CALC_ESC: "^calc\\(|(?<=[\\s*\\/\\(])calc\\(";
export const FUNC_COLOR: "color(";
export const FUNC_MIX: "color-mix(";
export const FUNC_VAR: "var(";
export const FUNC_VAR_ESC: "^var\\(|(?<=[\\s*\\/\\(])var\\(";
export const NONE: "none";
export const NUM: "[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?";
export const PCT: "[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%";
export const VAL_COMP: "computedValue";
export const VAL_SPEC: "specifiedValue";
export const SYN_FUNC_COLOR: "(?:(?:a98|prophoto)-rgb|display-p3|rec2020|srgb(?:-linear)?|xyz(?:-d(?:50|65))?)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){3}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?";
export const SYN_HSL: "(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?";
export const SYN_HSL_LV3: "[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2}(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?";
export const SYN_LAB: "(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?";
export const SYN_LCH: "(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)\\s+){2}(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?";
export const SYN_RGB: "(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?";
export const SYN_RGB_LV3: "(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?){2}|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2})(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?";
export const SYN_COLOR_TYPE: "[a-z]+|#(?:[\\da-f]{3}|[\\da-f]{4}|[\\da-f]{6}|[\\da-f]{8})|hsla?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2}(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|hwb\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|rgba?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?){2}|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2})(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|(?:ok)?lab\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|(?:ok)?lch\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)\\s+){2}(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|color\\(\\s*(?:(?:a98|prophoto)-rgb|display-p3|rec2020|srgb(?:-linear)?|xyz(?:-d(?:50|65))?)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){3}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)";
export const SYN_MIX_PART: "(?:[a-z]+|#(?:[\\da-f]{3}|[\\da-f]{4}|[\\da-f]{6}|[\\da-f]{8})|hsla?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2}(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|hwb\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|rgba?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?){2}|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2})(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|(?:ok)?lab\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|(?:ok)?lch\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)\\s+){2}(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|color\\(\\s*(?:(?:a98|prophoto)-rgb|display-p3|rec2020|srgb(?:-linear)?|xyz(?:-d(?:50|65))?)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){3}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\))(?:\\s+[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%)?";
export const SYN_MIX: "color-mix\\(\\s*in\\s+(?:(?:ok)?l(?:ab|ch)|h(?:sl|wb)|srgb(?:-linear)?|xyz(?:-d(?:50|65))?)\\s*,\\s*(?:[a-z]+|#(?:[\\da-f]{3}|[\\da-f]{4}|[\\da-f]{6}|[\\da-f]{8})|hsla?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2}(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|hwb\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|rgba?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?){2}|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2})(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|(?:ok)?lab\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|(?:ok)?lch\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)\\s+){2}(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|color\\(\\s*(?:(?:a98|prophoto)-rgb|display-p3|rec2020|srgb(?:-linear)?|xyz(?:-d(?:50|65))?)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){3}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\))(?:\\s+[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%)?\\s*,\\s*(?:[a-z]+|#(?:[\\da-f]{3}|[\\da-f]{4}|[\\da-f]{6}|[\\da-f]{8})|hsla?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2}(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|hwb\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|rgba?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?){2}|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2})(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|(?:ok)?lab\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|(?:ok)?lch\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)\\s+){2}(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|color\\(\\s*(?:(?:a98|prophoto)-rgb|display-p3|rec2020|srgb(?:-linear)?|xyz(?:-d(?:50|65))?)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){3}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\))(?:\\s+[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%)?\\s*\\)";
export const SYN_MIX_CAPT: "color-mix\\(\\s*in\\s+((?:ok)?l(?:ab|ch)|h(?:sl|wb)|srgb(?:-linear)?|xyz(?:-d(?:50|65))?)\\s*,\\s*((?:[a-z]+|#(?:[\\da-f]{3}|[\\da-f]{4}|[\\da-f]{6}|[\\da-f]{8})|hsla?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2}(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|hwb\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|rgba?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?){2}|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2})(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|(?:ok)?lab\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|(?:ok)?lch\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)\\s+){2}(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|color\\(\\s*(?:(?:a98|prophoto)-rgb|display-p3|rec2020|srgb(?:-linear)?|xyz(?:-d(?:50|65))?)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){3}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\))(?:\\s+[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%)?)\\s*,\\s*((?:[a-z]+|#(?:[\\da-f]{3}|[\\da-f]{4}|[\\da-f]{6}|[\\da-f]{8})|hsla?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2}(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|hwb\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|rgba?\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?|(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?){2}|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%(?:\\s*,\\s*[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%){2})(?:\\s*,\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%))?)\\s*\\)|(?:ok)?lab\\(\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){2}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|(?:ok)?lch\\(\\s*(?:(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)\\s+){2}(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?(?:deg|g?rad|turn)?|none)(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\)|color\\(\\s*(?:(?:a98|prophoto)-rgb|display-p3|rec2020|srgb(?:-linear)?|xyz(?:-d(?:50|65))?)(?:\\s+(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none)){3}(?:\\s*\\/\\s*(?:[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?|[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%|none))?\\s*\\))(?:\\s+[+-]?(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:e-?(?:0|[1-9]\\d*))?%)?)\\s*\\)";
