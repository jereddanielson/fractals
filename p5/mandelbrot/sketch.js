const max_iter = 100;

function setup() {
  smooth(4);
  createCanvas(1200, 800);
  background(0);
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let mappedX = map(x, 0, width, -3, 3);
      let mappedY = map(y, 0, height, -2, 2);
      let v = calcMandelbrot(mappedX, mappedY);
      let b = map(sqrt(map(v, 0, max_iter, 0, 1)), 0, 1, 255, 0);
      set(x, y, b);
    }
  }
  updatePixels();
}

function calcMandelbrot(x, y) {
  let z_r = 0;
  let z_i = 0;

  let i = 0;
  while (i < max_iter) {
    let r_squared = z_r * z_r;
    let i_squared = z_i * z_i;
    let two_r_i = 2.0 * z_r * z_i;
    z_r = r_squared - i_squared + x;
    z_i = two_r_i + y;

    if (sqrt(abs(z_r * z_r + z_i * z_i)) > 2) {
      break;
    }
    i++;
  }

  if (i == max_iter) {
    //return 0;
  }

  return i;
}
