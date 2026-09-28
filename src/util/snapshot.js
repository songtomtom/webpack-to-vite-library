/**
 * 픽셀 버퍼를 base64로 직렬화한다.
 * 예전에는 Node 전역 Buffer를 썼고, 브라우저 번들에는 폴리필이 딸려 들어갔다.
 * btoa/atob는 Node 16+ 와 모든 브라우저에 있으므로 어느 쪽에도 폴리필이 필요 없다.
 * 긴 배열을 String.fromCharCode(...arr)로 펼치면 인자 개수 한도에 걸리므로 조각내서 이어 붙인다.
 */
const CHUNK = 0x8000;

export const encodeSnapshot = pixels => {
    const bytes = pixels instanceof Uint8Array ? pixels : new Uint8Array(pixels);
    let binary = '';
    for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    return btoa(binary);
};

export const decodeSnapshot = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
