/* Node 번들이 GPU 없이 import되고 순수 함수가 도는지 확인한다. */
const assert = require('node:assert/strict');
const lib = require('../dist/node/sprite-gl.js');

assert.deepEqual(lib.rgbToVec4(255, 0, 0), [1, 0, 0, 1]);
assert.equal(lib.vec4ToCss([1, 0.5, 0, 1]), 'rgba(255, 128, 0, 1)');

const r = new lib.Rectangle(0, 10, 0, 10);
assert.ok(r.intersects(new lib.Rectangle(5, 15, 5, 15)));
assert.ok(!r.intersects(new lib.Rectangle(11, 20, 0, 10)));

const pixels = new Uint8Array([1, 2, 3, 255]);
assert.deepEqual(lib.decodeSnapshot(lib.encodeSnapshot(pixels)), pixels);

assert.equal(typeof lib.SpriteRenderer, 'function');
console.log('node smoke ok');
