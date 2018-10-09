 const c = document.querySelector('canvas'),
      ctx = c.getContext('2d');

c.width = window.innerWidth;
c.height = window.innerHeight;

const circleDegrees = [], delay = [], pointAngle = [], speed = [], count = [];

let startDegree = 270;

for (let i = 0; i < 15; i++) {
  circleDegrees[i] = startDegree;

  startDegree = startDegree === 360 ? 0 : startDegree += 24;
}

for (let i = 0; i < circleDegrees.length; i++) {
  delay[i] = i * 200;
  pointAngle[i] = 0;
  speed[i] = .1;
  count[i] = 0;
}

function draw() {
  const mainRadius = 150,
        circleRadius = 47;
  pointRadius = 10;
  pointCoordAdjust = [5, 9]
  pointCoupleCoord = [];

  for (let i = 0; i < circleDegrees.length; i++) {
    // Small circle center
    const x = (mainRadius - pointCoordAdjust[0]) * Math.cos(circleDegrees[i] * (Math.PI/180)) + c.width / 2,
          y = (mainRadius - pointCoordAdjust[0]) * Math.sin(circleDegrees[i] * (Math.PI/180)) + c.height / 2;

    // Big circle center, who move around small circle
    const newX = (a) => mainRadius * Math.cos((circleDegrees[i] + pointAngle[i] + a) * (Math.PI/180)) + x,
          newY = (a) =>  mainRadius * Math.sin((circleDegrees[i] + pointAngle[i] + a) * (Math.PI/180)) + y;

    // Intersection coordinates between two circles
    pointCoupleCoord[0] = [
      intersection(newX(-pointCoordAdjust[1]), newY(-pointCoordAdjust[1]), mainRadius, x, y, circleRadius)[0],
      intersection(newX(-pointCoordAdjust[1]), newY(-pointCoordAdjust[1]), mainRadius, x, y, circleRadius)[2],
    ];

    pointCoupleCoord[1] = [
      intersection(newX(pointCoordAdjust[1]), newY(pointCoordAdjust[1]), mainRadius, x, y, circleRadius)[1],
      intersection(newX(pointCoordAdjust[1]), newY(pointCoordAdjust[1]), mainRadius, x, y, circleRadius)[3],
    ];

    ctx.beginPath();
    ctx.arc(pointCoupleCoord[0][0], pointCoupleCoord[0][1], pointRadius, 0, 2 * Math.PI);
    ctx.arc(pointCoupleCoord[1][0], pointCoupleCoord[1][1], pointRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(47, 47, 47, 1)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(47, 47, 47, ${pointAngle[i] < 90 ? pointAngle[i]/90 : 1 - (pointAngle[i] - 90)/90})`;

    ctx.moveTo(pointCoupleCoord[0][0], pointCoupleCoord[0][1]);
    ctx.lineTo(pointCoupleCoord[1][0], pointCoupleCoord[1][1]);
    ctx.stroke();
  }
}

function animate() {
  ctx.clearRect(0, 0, c.width, c.height);
  draw();

  for (let i = 0; i < circleDegrees.length; i++) {
    setTimeout(() => {
      if (count[i] === 0) {
        speed[i] = pointAngle[i] <= 90 ? Math.abs(speed[i]) + .015 : speed[i] -= .015;
        pointAngle[i] = pointAngle[i] < 180 ? pointAngle[i] += Math.abs(speed[i]) : 0;

        if (pointAngle[i] >= 180) {
          pointAngle[i] = 0;
          count[i] = 1;
          
          if (i === circleDegrees.length - 1) {
            for (let j = 0; j < circleDegrees.length; j++) {
              setTimeout(() => {
                count[j] = 0;
              }, delay[j]);
            }
          }
        }
      }
    }, delay[i]);
  }
  
  setTimeout(animate, 0);
}

animate();


// Function that returns of intersection between two circles
// https://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
function intersection(x0, y0, r0, x1, y1, r1) {
  var a, dx, dy, d, h, rx, ry;
  var x2, y2;

  dx = x1 - x0;
  dy = y1 - y0;

  d = Math.sqrt((dy*dy) + (dx*dx));

  if (d > (r0 + r1)) {
    return false;
  }

  if (d < Math.abs(r0 - r1)) {
    return false;
  }

  a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

  x2 = x0 + (dx * a/d);
  y2 = y0 + (dy * a/d);

  h = Math.sqrt((r0*r0) - (a*a));

  rx = -dy * (h/d);
  ry = dx * (h/d);

  const xi = x2 + rx,
        xi_prime = x2 - rx,
        yi = y2 + ry,
        yi_prime = y2 - ry;

  return [xi, xi_prime, yi, yi_prime];
}
