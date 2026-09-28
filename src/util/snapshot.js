import {Buffer} from 'buffer';

/**
 * 픽셀 버퍼를 base64로 직렬화한다.
 * webpack 시절엔 전역 Buffer에 기대고 resolve.fallback으로 폴리필을 끼웠다.
 * Vite는 Node 전역을 흉내 내지 않으므로 필요한 곳에서 명시적으로 가져온다.
 */
export const encodeSnapshot = pixels => Buffer.from(pixels).toString('base64');

export const decodeSnapshot = text => new Uint8Array(Buffer.from(text, 'base64'));
