import {resolve} from 'node:path';
import {defineConfig} from 'vite';

const root = process.cwd();

/**
 * webpack 설정 세 개(web / node / playground)를 한 파일로 합쳤다.
 *  - 기본 모드: 라이브러리 빌드. 진입점 하나에서 es / cjs / umd 세 포맷을 낸다.
 *  - playground 모드: 데모 페이지를 일반 앱처럼 빌드하고 dev 서버로 띄운다.
 */
export default defineConfig(({mode}) => {
    if (mode === 'playground') {
        return {
            root: resolve(root, 'src/playground'),
            server: {port: 8361, open: true},
            build: {outDir: resolve(root, 'playground'), emptyOutDir: true}
        };
    }

    return {
        build: {
            lib: {
                entry: resolve(root, 'src/index.js'),
                name: 'SpriteGL',
                formats: ['es', 'cjs', 'umd'],
                fileName: format => ({
                    es: 'web/sprite-gl.mjs',
                    cjs: 'node/sprite-gl.cjs',
                    umd: 'umd/sprite-gl.js'
                })[format]
            },
            rollupOptions: {
                // 의존성은 번들에 넣지 않는다. 소비자의 번들러가 해결한다.
                external: ['twgl.js', 'hull.js'],
                output: {
                    // UMD는 전역 변수로 의존성을 찾는다
                    globals: {'twgl.js': 'twgl', 'hull.js': 'hull'},
                    // webpack의 TerserPlugin drop_console 자리. Vite 8은 esbuild 대신 Rolldown(oxc) minifier를 쓴다.
                    ...(mode === 'production' && {
                        minify: {compress: {dropConsole: true, dropDebugger: true}, mangle: true, codegen: true}
                    })
                }
            },
            // 소스맵은 개발 빌드에만. 배포 파일 옆에 소스가 통째로 붙는 걸 막는다.
            sourcemap: mode !== 'production'
        }
    };
});
