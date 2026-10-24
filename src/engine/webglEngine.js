/**
 * FantasticFractals - Hardware-Accelerated WebGL 2.0 Fractal Engine
 * Compiles custom fragment shaders to compute millions of fractal points in parallel on the GPU in < 5ms.
 */

const VERTEX_SHADER_SRC = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_zoom;
uniform int u_maxIterations;
// 0: mandelbrot, 1: julia, 2: burning_ship, 3: tricorn, 4: multibrot3, 5: multibrot4, 6: newton, 7: nova, 8: sierpinski
uniform int u_fractalType;
uniform vec2 u_juliaConst;
uniform sampler2D u_paletteTexture;
uniform float u_paletteShift;

#define M_PI 3.14159265358979323846

void main() {
  float aspect = u_resolution.x / u_resolution.y;
  float spanY = 2.5 / u_zoom;
  float spanX = spanY * aspect;

  vec2 c = vec2(
    u_center.x - spanX * 0.5 + v_uv.x * spanX,
    u_center.y - spanY * 0.5 + v_uv.y * spanY
  );

  float iterVal = -1.0;
  const float BAILOUT_SQ = 16.0;

  if (u_fractalType == 0) {
    // 1. Mandelbrot Set (with early bulb rejection)
    float q = (c.x - 0.25) * (c.x - 0.25) + c.y * c.y;
    if (q * (q + (c.x - 0.25)) <= 0.25 * c.y * c.y || (c.x + 1.0) * (c.x + 1.0) + c.y * c.y <= 0.0625) {
      fragColor = vec4(0.02, 0.025, 0.05, 1.0);
      return;
    }

    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      float zx2 = z.x * z.x;
      float zy2 = z.y * z.y;
      if (zx2 + zy2 > BAILOUT_SQ) break;
      z = vec2(zx2 - zy2 + c.x, 2.0 * z.x * z.y + c.y);
    }

    if (i < u_maxIterations) {
      float mod = length(z);
      iterVal = float(i) + 1.0 - log(log(mod) / 0.693147) / 0.693147;
    }
  } else if (u_fractalType == 1) {
    // 2. Julia Set
    vec2 z = c;
    vec2 jc = u_juliaConst;
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      float zx2 = z.x * z.x;
      float zy2 = z.y * z.y;
      if (zx2 + zy2 > BAILOUT_SQ) break;
      z = vec2(zx2 - zy2 + jc.x, 2.0 * z.x * z.y + jc.y);
    }

    if (i < u_maxIterations) {
      float mod = length(z);
      iterVal = float(i) + 1.0 - log(log(mod) / 0.693147) / 0.693147;
    }
  } else if (u_fractalType == 2) {
    // 3. Burning Ship
    vec2 z = c;
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      float zx2 = z.x * z.x;
      float zy2 = z.y * z.y;
      if (zx2 + zy2 > BAILOUT_SQ) break;
      z = vec2(zx2 - zy2 - c.x, abs(2.0 * z.x * z.y) - c.y);
    }

    if (i < u_maxIterations) {
      float mod = length(z);
      iterVal = float(i) + 1.0 - log(log(mod) / 0.693147) / 0.693147;
    }
  } else if (u_fractalType == 3) {
    // 4. Tricorn (Mandelbar)
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      float zx2 = z.x * z.x;
      float zy2 = z.y * z.y;
      if (zx2 + zy2 > BAILOUT_SQ) break;
      z = vec2(zx2 - zy2 + c.x, -2.0 * z.x * z.y + c.y);
    }

    if (i < u_maxIterations) {
      float mod = length(z);
      iterVal = float(i) + 1.0 - log(log(mod) / 0.693147) / 0.693147;
    }
  } else if (u_fractalType == 4) {
    // 5. Multibrot 3 (Cubic)
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > BAILOUT_SQ) break;
      z = vec2(z.x * (z.x * z.x - 3.0 * z.y * z.y) + c.x, z.y * (3.0 * z.x * z.x - z.y * z.y) + c.y);
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 5) {
    // 6. Multibrot 4 (Quartic)
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > BAILOUT_SQ) break;
      vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      z = vec2(z2.x * z2.x - z2.y * z2.y + c.x, 2.0 * z2.x * z2.y + c.y);
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 6) {
    // 7. Newton-Raphson (z^3 - 1 = 0)
    vec2 z = c;
    int i = 0;
    for (; i < 500; i++) {
      if (i >= u_maxIterations) break;
      float d2 = dot(z, z);
      if (d2 < 1e-8) break;
      float invD4 = 1.0 / (d2 * d2);
      vec2 invZ2 = vec2(z.x * z.x - z.y * z.y, -2.0 * z.x * z.y) * invD4;
      vec2 nextZ = (2.0 * z + invZ2) / 3.0;
      if (distance(nextZ, z) < 1e-4) {
        float rootId = nextZ.x > 0.5 ? 1.0 : (nextZ.y > 0.0 ? 2.0 : 3.0);
        iterVal = float(i) + rootId * 18.0;
        break;
      }
      z = nextZ;
    }
  } else if (u_fractalType == 7) {
    // 8. Nova Fractal
    vec2 z = c;
    int i = 0;
    for (; i < 500; i++) {
      if (i >= u_maxIterations) break;
      float d2 = dot(z, z);
      if (d2 < 1e-8) break;
      float invD4 = 1.0 / (d2 * d2);
      vec2 invZ2 = vec2(z.x * z.x - z.y * z.y, -2.0 * z.x * z.y) * invD4;
      vec2 nextZ = (2.0 * z + invZ2) / 3.0 + c * 0.2;
      if (distance(nextZ, z) < 1e-3) {
        iterVal = float(i) * 2.5;
        break;
      }
      z = nextZ;
    }
  } else if (u_fractalType == 8) {
    // 9. Sierpinski Carpet
    vec2 p = abs(c);
    int d = 0;
    for (; d < 10; d++) {
      if (d >= u_maxIterations) break;
      int mx = int(floor(p.x * 3.0)) % 3;
      int my = int(floor(p.y * 3.0)) % 3;
      if (mx == 1 && my == 1) {
        iterVal = float(d + 1) * 15.0;
        break;
      }
      p = fract(p * 3.0);
    }
  }

  if (iterVal < 0.0) {
    fragColor = vec4(0.02, 0.025, 0.05, 1.0);
  } else {
    float u = fract((iterVal * 0.04) + u_paletteShift);
    vec4 col = texture(u_paletteTexture, vec2(u, 0.5));
    fragColor = col;
  }
}
`;

export class WebGLFractalRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });

    if (!this.gl) {
      console.warn('WebGL2 not supported, falling back to 2D worker');
      return;
    }

    this.initShaders();
    this.initBuffers();
    this.initPaletteTexture();
  }

  get isSupported() {
    return !!(this.gl && this.program);
  }

  initShaders() {
    const gl = this.gl;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VERTEX_SHADER_SRC);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('VS compile error:', gl.getShaderInfoLog(vs));
      return;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, FRAGMENT_SHADER_SRC);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('FS compile error:', gl.getShaderInfoLog(fs));
      return;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(prog));
      return;
    }

    this.program = prog;

    // Cache uniform locations
    this.uniforms = {
      resolution: gl.getUniformLocation(prog, 'u_resolution'),
      center: gl.getUniformLocation(prog, 'u_center'),
      zoom: gl.getUniformLocation(prog, 'u_zoom'),
      maxIterations: gl.getUniformLocation(prog, 'u_maxIterations'),
      fractalType: gl.getUniformLocation(prog, 'u_fractalType'),
      juliaConst: gl.getUniformLocation(prog, 'u_juliaConst'),
      paletteTexture: gl.getUniformLocation(prog, 'u_paletteTexture'),
      paletteShift: gl.getUniformLocation(prog, 'u_paletteShift'),
    };
  }

  initBuffers() {
    const gl = this.gl;
    const quadVertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
  }

  initPaletteTexture() {
    const gl = this.gl;
    this.paletteTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.paletteTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  updatePalette(lut) {
    const gl = this.gl;
    if (!gl || !this.paletteTex) return;
    const width = lut.length / 4;
    gl.bindTexture(gl.TEXTURE_2D, this.paletteTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      lut
    );
  }

  render({
    width,
    height,
    centerX,
    centerY,
    zoom,
    maxIterations,
    fractalType,
    juliaReal,
    juliaImag,
    paletteShift,
  }) {
    if (!this.gl || !this.program) return false;
    const gl = this.gl;

    gl.viewport(0, 0, width, height);
    gl.useProgram(this.program);

    gl.uniform2f(this.uniforms.resolution, width, height);
    gl.uniform2f(this.uniforms.center, centerX, centerY);
    gl.uniform1f(this.uniforms.zoom, zoom);
    gl.uniform1i(this.uniforms.maxIterations, maxIterations);

    const typeMap = {
      mandelbrot: 0,
      julia: 1,
      burning_ship: 2,
      tricorn: 3,
      multibrot3: 4,
      multibrot4: 5,
      newton: 6,
      nova: 7,
      sierpinski_carpet: 8,
    };

    if (!(fractalType in typeMap)) {
      return false; // Fall back to CPU worker for unsupported shader types (e.g. Barnsley Fern)
    }

    gl.uniform1i(this.uniforms.fractalType, typeMap[fractalType]);
    gl.uniform2f(this.uniforms.juliaConst, juliaReal, juliaImag);
    gl.uniform1f(this.uniforms.paletteShift, paletteShift);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.paletteTex);
    gl.uniform1i(this.uniforms.paletteTexture, 0);

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);

    return true;
  }

  destroy() {
    if (!this.gl) return;
    const gl = this.gl;
    if (this.paletteTex) gl.deleteTexture(this.paletteTex);
    if (this.vbo) gl.deleteBuffer(this.vbo);
    if (this.vao) gl.deleteVertexArray(this.vao);
    if (this.program) gl.deleteProgram(this.program);
  }
}
