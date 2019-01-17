// let iterSlider;

// function setup() {
//   smooth(4);
//   createCanvas(300, 200);
//   iterSlider = createSlider(1, 100, 10);
//   iterSlider.parent(document.getElementById("inputs"));
// }

// function draw() {
//   const max_iter = iterSlider.value();
//   background(0);
//   loadPixels();
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       let mappedX = map(x, 0, width, -3, 3);
//       let mappedY = map(y, 0, height, -2, 2);
//       let v = calcMandelbrot(mappedX, mappedY);
//       let b = map(sqrt(map(v, 0, max_iter, 0, 1)), 0, 1, 255, 0);
//       set(x, y, b);
//     }
//   }
//   updatePixels();
// }

// function calcMandelbrot(x, y) {
//   const max_iter = iterSlider.value();
//   let z_r = 0;
//   let z_i = 0;

//   let i = 0;
//   while (i < max_iter) {
//     let r_squared = z_r * z_r;
//     let i_squared = z_i * z_i;
//     let two_r_i = 2.0 * z_r * z_i;
//     z_r = r_squared - i_squared + x;
//     z_i = two_r_i + y;

//     if (sqrt(abs(z_r * z_r + z_i * z_i)) > 2) {
//       break;
//     }
//     i++;
//   }

//   if (i == max_iter) {
//     //return 0;
//   }

//   return i;
// }

// the 'varying's are shared between both vertex & fragment shaders
const varying = `precision highp float; varying vec2 vPos; varying lowp float;`;

// the vertex shader is called for each vertex
const vert = `
  ${varying}
  attribute vec3 aPosition;
  void main() { vPos = (gl_Position = vec4(aPosition,1.0)).xy; }
  `;

// the fragment shader is called for each pixel
const frag = `
  ${varying}
  uniform vec2 p;
  uniform float r;
  uniform float I;
  void main() {
    int max_iter = int(I);
    vec2 c = p + vPos * r, z = c;
    vec2 zsqr = vec2(pow(z.x, 2.0), pow(z.y, 2.0));
    float n = 0.0;
    for (int i = 0; i < 500; i++) {
      if(zsqr.x + zsqr.y > 4.0 || i > max_iter) {
        n = float(i)/float(max_iter);
        break;
      }
      z.y = pow(z.x + z.y, 2.0) - zsqr.x - zsqr.y;
      z.y += c.y;
      z.x = zsqr.x - zsqr.y + c.x;
      zsqr.x = pow(z.x, 2.0);
      zsqr.y = pow(z.y, 2.0);
    }
    gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);
  }
  `;

let mandel;

let iterationSlider;
let rSlider;
let pxSlider;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);

  iterationSlider = createSlider(1, 1000, 500);
  iterationSlider.parent(document.getElementById("inputs"));
  rSlider = createSlider(0.00001, 1000, 1000);
  rSlider.parent(document.getElementById("inputs"));
  pxSlider = createSlider(-2000, 2000, 0);
  pxSlider.parent(document.getElementById("inputs"));
  pySlider = createSlider(-2000, 2000, 0);
  pySlider.parent(document.getElementById("inputs"));

  // create and initialize the shader
  mandel = createShader(vert, frag);
  shader(mandel);
  noStroke();
}

function draw() {
  // 'r' is the size of the image in Mandelbrot-space
  mandel.setUniform("r", rSlider.value() / 1000);
  mandel.setUniform("I", iterationSlider.value());
  // 'p' is the center point of the Mandelbrot image
  mandel.setUniform("p", [pxSlider.value() / 1000, pySlider.value() / 1000]);
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}
