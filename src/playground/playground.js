import {SpriteRenderer, vec4ToCss} from '../index';

const canvas = document.getElementById('stage');
const log = document.getElementById('log');
const renderer = new SpriteRenderer(canvas);

const a = renderer.addSprite({x: -60, y: 0, size: 160, color: [255, 128, 0]});
const b = renderer.addSprite({x: 60, y: 30, size: 120, color: [0, 120, 255], ghost: 0.3});
renderer.draw();

const hit = renderer.getBounds(a).intersects(renderer.getBounds(b));
log.textContent = [
    `sprite a color: ${vec4ToCss(renderer._sprites[a].color)}`,
    `a ∩ b: ${hit}`,
    `snapshot bytes(base64): ${renderer.snapshot().length}`
].join('\n');

const outline = renderer.getHull();
log.textContent += `\nhull: ${outline.length - 1}개 꼭짓점`;
