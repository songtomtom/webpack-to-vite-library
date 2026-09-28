/* ES 번들이 Node에서 import되고 external(twgl.js)이 해석되는지 확인한다. */
import assert from 'node:assert/strict';
import * as lib from '../dist/web/sprite-gl.mjs';

assert.deepEqual(lib.rgbToVec4(0, 255, 0), [0, 1, 0, 1]);
assert.ok(new lib.Rectangle(0, 1, 0, 1).intersects(new lib.Rectangle(1, 2, 1, 2)));
assert.equal(typeof lib.SpriteRenderer, 'function');
console.log('esm smoke ok');
