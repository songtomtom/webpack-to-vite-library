/**
 * 픽셀 버퍼를 base64로 직렬화한다.
 * 원본 프로젝트가 Node API인 Buffer를 브라우저 번들에서도 쓰고 있어서
 * webpack 5에서는 resolve.fallback으로 폴리필을 붙여야 했다.
 */
const encodeSnapshot = pixels => Buffer.from(pixels).toString('base64');

const decodeSnapshot = text => new Uint8Array(Buffer.from(text, 'base64'));

module.exports = {encodeSnapshot, decodeSnapshot};
