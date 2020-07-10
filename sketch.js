//#region main

let width = window.innerWidth;
let height = window.innerHeight;

let slider;

let objects = [{
  type: 'circle',
  x: 100,
  y: 100,
  r: 50
},
{
  type: 'box',
  x: 300,
  y: 300,
  w: 50,
  h: 50
},
{
  type: 'box',
  x: 700,
  y: 500,
  w: 200,
  h: 50
},
{
  type: 'circle',
  x: 900,
  y: 100,
  r: 200
},
{
  type: 'border',
  x: width + 5,
  y: height / 2,
  w: 1,
  h: height / 2
},
{
  type: 'border',
  x: width / 2,
  y: height + 5,
  w: width / 2,
  h: 1,
},
{
  type: 'border',
  x: -5,
  y: height / 2,
  w: 1,
  h: height / 2,
},
{
  type: 'border',
  x: width / 2,
  y: -5,
  w: width / 2,
  h: 1,
},
];

let px, py;

function setup() {
  colorMode(HSB, 100);
  //noStroke();

  ellipseMode(RADIUS);
  rectMode(RADIUS);

  createCanvas(width, height);

  slider = createSlider(0, 100, 100);
  slider.position(20, 20);
}

function draw() {
  background(0);

  if (width - 5 > mouseX && mouseX > 5 && height - 5 > mouseY && mouseY > 5) {
    render(objects);
    debug(objects);
  }
}

function render(objs) {
  fill(1, 0, 0);
  strokeWeight(0);
  objects.forEach(obj => {
    if (obj.type == 'circle') {
      ellipse(obj.x, obj.y, obj.r, obj.r);
    }
    if (obj.type == 'box' || obj.type == 'border') {
      rect(obj.x, obj.y, obj.w, obj.h);
    }
  });
}

function debug(objs) {
  let p = [mouseX, mouseY];
  let h = 2/Math.PI*Math.asin(sin(2*Math.PI*(frameCount/500)))*50+50;
  console.log(h);
  let d = signedDstToScene(mouseX, mouseY, objects);

  fill(h, 0, 0);
  ellipse(p[0], p[1], d);

  fov(objects, p, h, d, 0.04, 5);
}

function fov(objs, p, h, d, i, m) {
  let j = 0;
  march(objs, p, h, d, 0);
  while (j < m) {
    j += i;
    march(objs, p, h, d, j);
    march(objs, p, h, d, -j);
  }
}

function march(objs, p, h, d, a) {
  while (d > 5) {
    h += 1;
    p = vec(p[0], p[1], a, d);
    d = signedDstToScene(p[0], p[1], objs);

    fill(0, 0, 0);
    strokeWeight(1);
    stroke(slider.value()+Math.sin(d/100)*25, 100, 100);
    ellipse(p[0], p[1], d);
    //line(mouseX,mouseY,p[0],p[1])
  }
}

//#endregion

//#region helpers

function length(vx, vy) {
  return Math.sqrt(vx * vx + vy * vy);
}
function signedDstToCircle(px, py, cx, cy, r) {
  return length(cx - px, cy - py) - r;
}

function signedDstToBox(px, py, cx, cy, sx, sy) {
  let ox = Math.abs(px - cx) - sx;
  let oy = Math.abs(py - cy) - sy;


  let ud = length(Math.max(ox, 0), Math.max(oy, 0));

  let dib = Math.max(Math.min(ox, 0), Math.min(oy, 0));


  return ud + dib;
}

function signedDstToScene(px, py, objs) {
  let dst = [];

  objects.forEach(obj => {
    if (obj.type == 'circle') {
      dst.push(signedDstToCircle(px, py, obj.x, obj.y, obj.r));
    }
    if (obj.type == 'box') {
      dst.push(signedDstToBox(px, py, obj.x, obj.y, obj.w, obj.h));
    }
    if (obj.type == 'border') {
      dst.push(signedDstToBox(px, py, obj.x, obj.y, obj.w, obj.h));
    }
  });

  return Math.min(...dst);
}

function vec(x, y, r, l) {
  let x2 = l * Math.cos(r * QUARTER_PI) + x
  let y2 = l * Math.sin(r * QUARTER_PI) + y
  return [x2, y2];
}

//#endregion