/**
 * 0~255 RGB를 셰이더가 받는 0~1 vec4로 바꾼다.
 * 브라우저와 Node 양쪽에서 쓰이는 순수 함수.
 */
const rgbToVec4 = (r, g, b, a = 255) => [r / 255, g / 255, b / 255, a / 255];

/** 0~1 vec4를 CSS 색 문자열로 되돌린다. 디버그 오버레이에 쓴다. */
const vec4ToCss = ([r, g, b, a]) =>
    `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;

module.exports = {rgbToVec4, vec4ToCss};
