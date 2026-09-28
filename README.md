# webpack-to-vite-library

작은 WebGL 스프라이트 렌더러 `sprite-gl`을 webpack 설정 세 개(web / node / playground)에서 Vite 라이브러리 모드 하나로 옮긴 예제입니다.

- `webpack` 태그: 전환 전. `webpack.config.js`가 UMD·CommonJS·playground 세 결과물을 만든다.
- `main`: 전환 후. `vite.config.js` 하나가 es / cjs / umd 세 포맷과 playground 모드를 담당한다.

## 구조

```
src/
  index.js            공개 API
  SpriteRenderer.js   WebGL 렌더러 (셰이더를 문자열로 import)
  Rectangle.js        GPU 없이 도는 경계 상자
  shaders/*.vert|frag GLSL 소스
  util/               색 변환, Buffer를 쓰는 스냅샷 직렬화
  playground/         데모 페이지
test/
  node-smoke.cjs      CommonJS 번들을 require
  node-smoke.mjs      ES 번들을 import
```

## 실행

```bash
npm install
npm run build            # dist/{web,node,umd}
npm run build:playground # playground/
npm run dev              # playground dev 서버 (http://localhost:8361)
npm test
```

전환 전 상태를 보려면:

```bash
git checkout webpack && npm install && npm run build
```

## 글

- [webpack 설정 세 개를 Vite 라이브러리 모드 하나로](https://songtomtom.github.io/blog/webpack-to-vite-library-mode)
- 2편: 셰이더, Buffer, CommonJS: Vite로 옮기며 걸린 것들 (작성 예정)
