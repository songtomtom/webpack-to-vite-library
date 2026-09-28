precision mediump float;

uniform vec4 u_color;
uniform float u_ghost;

varying vec2 v_texCoord;

void main() {
    // 체크무늬로 텍스처 좌표가 살아 있는지 눈으로 확인한다.
    float checker = mod(floor(v_texCoord.x * 8.0) + floor(v_texCoord.y * 8.0), 2.0);
    vec4 base = mix(u_color, u_color * 0.6, checker);
    gl_FragColor = vec4(base.rgb, base.a * (1.0 - u_ghost));
}
