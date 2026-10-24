/**
 * FantasticFractals - Hardware-Accelerated WebGL 2.0 Fractal Engine
 * Compiles custom fragment shaders to compute millions of fractal points in parallel on the GPU in < 5ms.
 * Supports 24 GPU-accelerated fractal equations.
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
  } else if (u_fractalType == 9) {
    // 10. Sierpinski Triangle (Gasket)
    vec2 p = vec2(abs(c.x), c.y + 0.5);
    for (int d = 0; d < 12; d++) {
      if (d >= u_maxIterations) break;
      if (p.x < 0.0) p.x = -p.x;
      float t = 0.5 * (p.x * 1.7320508 - p.y);
      if (t > 0.0) {
        p.x -= 1.7320508 * t;
        p.y += t;
      }
      p = p * 2.0 - vec2(0.0, 1.7320508);
      if (dot(p, p) > 4.0) {
        iterVal = float(d + 1) * 14.0;
        break;
      }
    }
  } else if (u_fractalType == 10) {
    // 11. Koch Snowflake
    vec2 p = abs(c);
    for (int d = 0; d < 8; d++) {
      if (d >= u_maxIterations) break;
      p = abs(p);
      float dDot = -0.8660254 * p.x + 0.5 * p.y;
      if (dDot > 0.0) {
        p += 2.0 * dDot * vec2(0.8660254, -0.5);
      }
      p.x -= 0.5;
      p *= 3.0;
      p.x += 0.5;
      if (dot(p, p) > 4.0) {
        iterVal = float(d + 1) * 18.0;
        break;
      }
    }
  } else if (u_fractalType == 11) {
    // 12. Vicsek Fractal (Box Cross)
    vec2 p = abs(c);
    for (int d = 0; d < 8; d++) {
      if (d >= u_maxIterations) break;
      int mx = int(floor(p.x * 3.0)) % 3;
      int my = int(floor(p.y * 3.0)) % 3;
      if (mx != 1 && my != 1) {
        iterVal = float(d + 1) * 18.0;
        break;
      }
      p = fract(p * 3.0);
    }
  } else if (u_fractalType == 12) {
    // 13. Celtic Mandelbrot
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > BAILOUT_SQ) break;
      z = vec2(abs(z.x * z.x - z.y * z.y) + c.x, 2.0 * z.x * z.y + c.y);
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 13) {
    // 14. Buffalo Fractal
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > BAILOUT_SQ) break;
      z = vec2(abs(z.x * z.x - z.y * z.y) - abs(z.x) + c.x, -abs(2.0 * z.x * z.y) + c.y);
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 14) {
    // 15. Perpendicular Mandelbrot
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > BAILOUT_SQ) break;
      z = vec2(z.x * z.x - z.y * z.y + c.x, -2.0 * abs(z.x) * z.y + c.y);
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 15) {
    // 16. Perpendicular Burning Ship
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > BAILOUT_SQ) break;
      z = vec2(z.x * z.x - z.y * z.y + c.x, -2.0 * z.x * abs(z.y) + c.y);
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 16) {
    // 17. Multibar 3 (Cubic Conjugate Tricorn)
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 2000; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > BAILOUT_SQ) break;
      z = vec2(z.x * (z.x * z.x - 3.0 * z.y * z.y) + c.x, -z.y * (3.0 * z.x * z.x - z.y * z.y) + c.y);
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 17) {
    // 18. Newton Quartic (z^4 - 1 = 0)
    vec2 z = c;
    int i = 0;
    for (; i < 500; i++) {
      if (i >= u_maxIterations) break;
      float d2 = dot(z, z);
      if (d2 < 1e-8) break;
      float d6 = d2 * d2 * d2;
      vec2 z3 = vec2(z.x * z.x * z.x - 3.0 * z.x * z.y * z.y, -3.0 * z.x * z.x * z.y + z.y * z.y * z.y) / d6;
      vec2 nextZ = (3.0 * z + z3) * 0.25;
      if (distance(nextZ, z) < 1e-4) {
        float rootId = nextZ.x > 0.5 ? 1.0 : (nextZ.x < -0.5 ? 2.0 : (nextZ.y > 0.0 ? 3.0 : 4.0));
        iterVal = float(i) + rootId * 18.0;
        break;
      }
      z = nextZ;
    }
  } else if (u_fractalType == 18) {
    // 19. Feather Fractal: z^3 / (1 + z^2) + c
    vec2 z = c;
    int i = 0;
    for (; i < 500; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > BAILOUT_SQ) break;
      vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      vec2 denom = vec2(1.0 + z2.x, z2.y);
      float denD2 = dot(denom, denom);
      if (denD2 < 1e-8) break;
      vec2 z3 = vec2(z.x * z2.x - z.y * z2.y, z.x * z2.y + z.y * z2.x);
      vec2 frac = vec2(z3.x * denom.x + z3.y * denom.y, z3.y * denom.x - z3.x * denom.y) / denD2;
      z = frac + c;
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 19) {
    // 20. Magnet Fractal Type 1
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 500; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > 100.0) break;
      vec2 num = vec2(z.x * z.x - z.y * z.y + c.x - 1.0, 2.0 * z.x * z.y + c.y);
      vec2 den = vec2(2.0 * z.x + c.x - 2.0, 2.0 * z.y + c.y);
      float denD2 = dot(den, den);
      if (denD2 < 1e-8) break;
      vec2 q = vec2(num.x * den.x + num.y * den.y, num.y * den.x - num.x * den.y) / denD2;
      z = vec2(q.x * q.x - q.y * q.y, 2.0 * q.x * q.y);
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 20) {
    // 21. Magnet Fractal Type 2
    vec2 z = vec2(0.0);
    int i = 0;
    for (; i < 500; i++) {
      if (i >= u_maxIterations) break;
      if (dot(z, z) > 100.0) break;
      vec2 c1 = vec2(c.x - 1.0, c.y);
      vec2 c2 = vec2(c.x - 2.0, c.y);
      vec2 c12 = vec2(c1.x * c2.x - c1.y * c2.y, c1.x * c2.y + c1.y * c2.x);
      vec2 num = vec2(z.x * (z.x * z.x - 3.0 * z.y * z.y) + 3.0 * (c1.x * z.x - c1.y * z.y) + c12.x,
                      z.y * (3.0 * z.x * z.x - z.y * z.y) + 3.0 * (c1.x * z.y + c1.y * z.x) + c12.y);
      vec2 den = vec2(3.0 * (z.x * z.x - z.y * z.y) + 3.0 * (c2.x * z.x - c2.y * z.y) + c12.x + 1.0,
                      6.0 * z.x * z.y + 3.0 * (c2.x * z.y + c2.y * z.x) + c12.y);
      float denD2 = dot(den, den);
      if (denD2 < 1e-8) break;
      vec2 q = vec2(num.x * den.x + num.y * den.y, num.y * den.x - num.x * den.y) / denD2;
      z = vec2(q.x * q.x - q.y * q.y, 2.0 * q.x * q.y);
    }
    if (i < u_maxIterations) iterVal = float(i);
  } else if (u_fractalType == 21) {
    // 22. Cantor Dust (2D)
    vec2 p = abs(c);
    for (int d = 0; d < 8; d++) {
      if (d >= u_maxIterations) break;
      int mx = int(floor(p.x * 3.0)) % 3;
      int my = int(floor(p.y * 3.0)) % 3;
      if (mx == 1 || my == 1) {
        iterVal = float(d + 1) * 16.0;
        break;
      }
      p = fract(p * 3.0);
    }
  } else if (u_fractalType == 22) {
    // 23. Apollonian Gasket Inversion
    vec2 p = c;
    for (int d = 0; d < 24; d++) {
      if (d >= u_maxIterations) break;
      p = mod(p + 1.0, 2.0) - 1.0;
      float r2 = dot(p, p);
      if (r2 < 1.0 && r2 > 1e-4) {
        p /= r2;
      } else {
        iterVal = float(d + 1) * 12.0;
        break;
      }
    }
  } else if (u_fractalType == 23) {
    // 24. Dragon Curve Boundary
    vec2 z = c;
    for (int d = 0; d < 24; d++) {
      if (d >= u_maxIterations) break;
      z = vec2((z.x - z.y) * 0.70710678 + 0.1, (z.x + z.y) * 0.70710678 + 0.1);
      if (dot(z, z) > 4.0) {
        iterVal = float(d + 1) * 15.0;
        break;
      }
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
      console.warn('WebGL2 not supported, falling back to Worker');
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
      sierpinski_triangle: 9,
      koch_snowflake: 10,
      vicsek: 11,
      celtic_mandelbrot: 12,
      buffalo: 13,
      perp_mandelbrot: 14,
      perp_burning_ship: 15,
      multibar3: 16,
      newton_z4: 17,
      feather: 18,
      magnet1: 19,
      magnet2: 20,
      cantor_dust: 21,
      apollonian: 22,
      dragon_curve: 23,
    };

    if (!(fractalType in typeMap)) {
      return false; // Fall back to CPU for non-shader types (e.g. Barnsley Fern, Lyapunov, Collatz)
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
