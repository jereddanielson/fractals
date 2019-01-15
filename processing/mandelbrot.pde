int max_iter = 100;

void setup() {
  smooth(4);
  size(1200, 800);
  float range_x = float(width) / float(height) * 1.5;
  float range_y = 1.5;
  println(range_x, range_y);
  background(0);
  loadPixels();
  for (int y = 0; y < height; y++) {
   for (int x = 0; x < width; x++) {
     float mappedX = map(x, 0, width, -range_x - 0.75, range_x - 0.75);
     float mappedY = map(y, 0, height, -range_y, range_y);
     int v = calcMandelbrot(mappedX, mappedY);
     int px = y * width + x;
     pixels[px] = color(map(sqrt(map(v, 0, max_iter, 0, 1)), 0, 1, 255, 0));
     //pixels[px] = color(map(v, 0, 1, 0, 255));
   }
  }
  updatePixels();
}

int calcMandelbrot(float x, float y) {
  float z_r = 0;
  float z_i = 0;
  
  int i = 0;
  while (i < max_iter) {
    float r_squared = z_r * z_r;
    float i_squared = z_i * z_i;
    float two_r_i = 2.0 * z_r * z_i;
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
