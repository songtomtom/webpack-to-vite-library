const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

/**
 * 세 가지 결과물을 하나의 설정 파일에서 만든다.
 *  1. web:        브라우저용 UMD (dist/web)
 *  2. node:       Node용 CommonJS, 의존성은 external (dist/node)
 *  3. playground: 눈으로 확인하는 데모 페이지 (playground/)
 * 공통 부분을 base로 두고 각 타깃이 덮어쓴다.
 */
const base = {
    module: {
        rules: [
            {
                // 셰이더 파일을 문자열로 가져온다
                test: /\.(vert|frag|glsl)$/,
                use: 'raw-loader'
            }
        ]
    },
    resolve: {
        fallback: {
            // src/util/snapshot.js가 Buffer를 쓴다. webpack 5는 Node 폴리필을 자동으로 넣지 않는다.
            buffer: require.resolve('buffer/')
        }
    },
    optimization: {
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: {drop_console: true},
                format: {comments: false}
            },
            extractComments: false
        })]
    },
    devtool: 'source-map'
};

const webConfig = {
    ...base,
    name: 'web',
    target: 'browserslist',
    entry: {
        'sprite-gl': path.join(__dirname, 'src/index.js'),
        'sprite-gl.min': path.join(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist/web'),
        filename: '[name].js',
        library: {name: 'SpriteGL', type: 'umd'},
        globalObject: 'this'
    },
    optimization: {
        ...base.optimization,
        minimizer: [new TerserPlugin({include: /\.min\.js$/, extractComments: false})]
    }
};

const nodeConfig = {
    ...base,
    name: 'node',
    target: 'node',
    entry: {'sprite-gl': path.join(__dirname, 'src/index.js')},
    output: {
        path: path.resolve(__dirname, 'dist/node'),
        filename: '[name].js',
        library: {type: 'commonjs2'}
    },
    externals: {
        'twgl.js': 'commonjs2 twgl.js'
    }
};

const playgroundConfig = {
    ...base,
    name: 'playground',
    target: 'browserslist',
    entry: {playground: path.join(__dirname, 'src/playground/playground.js')},
    output: {
        path: path.resolve(__dirname, 'playground'),
        filename: '[name].js'
    },
    plugins: [
        new CopyWebpackPlugin({patterns: [{context: 'src/playground', from: '*.html'}]})
    ],
    devServer: {
        static: {directory: path.resolve(__dirname, 'playground')},
        port: 8361,
        open: true
    }
};

module.exports = [webConfig, nodeConfig, playgroundConfig];
