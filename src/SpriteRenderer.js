import * as twgl from 'twgl.js';
import hull from 'hull.js';

import vertexShader from './shaders/sprite.vert?raw';
import fragmentShader from './shaders/sprite.frag?raw';
import Rectangle from './Rectangle';
import {rgbToVec4} from './util/color';
import {encodeSnapshot} from './util/snapshot';

/**
 * 캔버스 하나에 색 사각형 스프라이트를 그리는 최소 렌더러.
 * 셰이더 소스는 별도 파일에서 문자열로 가져온다. 이 지점이 번들러마다 다르다.
 */
class SpriteRenderer {
    constructor (canvas) {
        const gl = canvas.getContext('webgl', {premultipliedAlpha: false});
        if (!gl) throw new Error('WebGL을 쓸 수 없습니다');
        this._gl = gl;
        this._program = twgl.createProgramInfo(gl, [vertexShader, fragmentShader]);
        this._quad = twgl.createBufferInfoFromArrays(gl, {
            a_position: {numComponents: 2, data: [-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]},
            a_texCoord: {numComponents: 2, data: [0, 0, 1, 0, 0, 1, 1, 1]},
            indices: [0, 1, 2, 2, 1, 3]
        });
        this._sprites = [];
    }

    /** @returns {number} 스프라이트 id */
    addSprite ({x = 0, y = 0, size = 100, color = [255, 128, 0], ghost = 0}) {
        this._sprites.push({x, y, size, color: rgbToVec4(...color), ghost});
        return this._sprites.length - 1;
    }

    getBounds (id) {
        const s = this._sprites[id];
        const half = s.size / 2;
        return new Rectangle(s.x - half, s.x + half, s.y - half, s.y + half);
    }

    /**
     * 모든 스프라이트 꼭짓점을 감싸는 볼록 껍질. 드래그 선택 영역 같은 데 쓴다.
     * hull.js는 CommonJS로만 배포되는 패키지다.
     */
    getHull () {
        const points = [];
        for (const s of this._sprites) {
            const half = s.size / 2;
            points.push([s.x - half, s.y - half], [s.x + half, s.y - half],
                [s.x - half, s.y + half], [s.x + half, s.y + half]);
        }
        return hull(points, Infinity);
    }

    draw () {
        const gl = this._gl;
        if (twgl.resizeCanvasToDisplaySize(gl.canvas)) {
            console.debug('canvas resized', gl.canvas.width, gl.canvas.height);
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(this._program.program);
        twgl.setBuffersAndAttributes(gl, this._program, this._quad);

        const sx = 2 / gl.canvas.width;
        const sy = 2 / gl.canvas.height;
        for (const s of this._sprites) {
            // 픽셀 좌표(원점 중앙)를 클립 공간으로 옮기는 3x3 행렬
            const matrix = [
                s.size * sx, 0, 0,
                0, s.size * sy, 0,
                s.x * sx, s.y * sy, 1
            ];
            twgl.setUniforms(this._program, {u_matrix: matrix, u_color: s.color, u_ghost: s.ghost});
            twgl.drawBufferInfo(gl, this._quad);
        }
    }

    /** 현재 프레임을 base64 RGBA로 돌려준다. 회귀 테스트용. */
    snapshot () {
        const gl = this._gl;
        const pixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
        gl.readPixels(0, 0, gl.canvas.width, gl.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        return encodeSnapshot(pixels);
    }
}

export default SpriteRenderer;
