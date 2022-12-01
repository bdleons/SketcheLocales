precision mediump float;

// uniforms are defined and sent by the sketch
uniform sampler2D texture;
// see emitResolution: https://github.com/VisualComputing/p5.treegl#macros
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution; // normalized pixel coordinates. gl_FragCoord (Screen Space), u_resolution (Screen Space)
  gl_FragColor = texture2D(texture, vec2(uv.x, 1.0 - uv.y)); // Mapping texels to screen pixels. Flip Y axis.
}