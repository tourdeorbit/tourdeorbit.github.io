let sscale = 7.5e8; // distance in 1px
let biglength;
let planet;
let G = 6.67408e-11;
let M = 1.9891e30;
let mu = 6.67408e-11 * 1.9891e30;
let tscale = 4.5e3; // time in 1millis
let vscale = sscale/tscale;
let time;
let playing = false;
let resetting = false;
let selected = 1;

let log;

function setup() {
    createCanvas(innerWidth, innerHeight-4);
    biglength = sqrt(sq(width)+sq(height));
    planet = new Planet(-1.521e11, 0, 0, -3.029e4);
    time = millis();
    interact();
    log = new Log();
}

function draw() {
    background(0);
    translate(width/3, height/2);
    planetAndOrbit(planet);
    star();
    logger();
    animate();
}

function mouseClicked() {
    //animatetest(200);
}

function planetAndOrbit(planet) {
    
    noFill();
    stroke(255, 100);
    rotate(planet.phi);
    translate(planet.fd/sscale, 0);
    // the path
    if (planet.E < 0) {
        ellipse(0, 0, 2*planet.a/sscale, 2*planet.b/sscale);
    } else {
        let startTh = atan(biglength*sscale/planet.b);
        let endTh = -startTh;
        let step = (endTh-startTh)/100;
        startTh+=PI;
        endTh+=PI;
        beginShape();
        for (let th = startTh; step*(endTh-th)>= 0; th += step) {
            vertex((planet.a/sscale)/cos(th), (planet.b/sscale)*tan(th));
        }
        endShape();
    }
    // directrices
    line(-planet.gd/sscale, -biglength, -planet.gd/sscale, biglength);
    if (planet.E < 0) {
        line(planet.gd/sscale, -biglength, planet.gd/sscale, biglength);
    }
    stroke(255, 50);
    // to focal points
    line(-planet.fd/sscale, 0, planet.x/sscale, planet.y/sscale);
    if (planet.E < 0) {
        line(planet.fd/sscale, 0, planet.x/sscale, planet.y/sscale);
    }
    // to directrices
    if (planet.e < 0.1) {
        stroke(255, 15);
    }
    line(-planet.gd/sscale, planet.y/sscale, planet.x/sscale, planet.y/sscale);
    if (planet.E < 0) {
        line(planet.gd/sscale, planet.y/sscale, planet.x/sscale, planet.y/sscale);
    }
    translate(-planet.fd/sscale, 0);
    rotate(-planet.phi);
    // the planet
    translate(planet.r.x/sscale, planet.r.y/sscale);
    stroke(100, 100, 255, 200);
    line(0, 0, 200*planet.v.x*4.5e3/sscale, 200*planet.v.y*4.5e3/sscale);
    noStroke();
    fill(0, 255, 0);
    ellipse(0, 0, planet.d*350/sscale, planet.d*350/sscale);
    translate(-planet.r.x/sscale, -planet.r.y/sscale);
}

function star() {
    let starD = 1.3927e9;
    noStroke();
    for (let w = 0; w < 35*starD/sscale; w++) {
        ratio = w / (35*starD/sscale);
        fill(255, 255, 255, 255*pow(1-ratio, 3));
        ellipse(0, 0, w, w);
    }
}
// number of iterations in leap-frog method
let leaps = 100;
function animate() {
    if (playing) {
        let delt = (millis()-time) * tscale;
        planet.t += delt;
        if (planet.E < 0) {
            planet.M = TAU*planet.t / planet.T;
            planet.u = findxgiveni(planet.u, x => planet.M+(planet.e*sin(x)), 0.0001);
            planet.adjustThetaToU();
            planet.adjustToTheta();
        } else {
            if (planet.h.z < 0) {
                //delt = -delt;
            }
            for (let i = 0; i < leaps; i++) {
                planet.theta = planet.theta + (planet.angularSpeed*(delt / leaps));
                planet.adjustToTheta();
            }
        }
        time = millis();
    }
}

function animatetest(m) {
    planet.t += (m) * tscale;
    planet.M = TAU*planet.t / planet.T;
    planet.adjustThetaToU();
    planet.adjustToTheta();
    time = millis();
}

function mouseDragged() {
    if (resetting) {
        if (selected == 1) {
            planet = new Planet(planet.r.x+((mouseX-pmouseX)*sscale), planet.r.y+((mouseY-pmouseY)*sscale), planet.v.x, planet.v.y);    
        } else if (selected == 2) {
            planet = new Planet(planet.r.x, planet.r.y, planet.v.x+((mouseX-pmouseX)*20), planet.v.y+((mouseY-pmouseY)*20));
        } else if (selected == 3) {
            M *= 1+((mouseX-pmouseX)/10);
            mu = G * M;
            planet = new Planet(planet.r.x, planet.r.y, planet.v.x, planet.v.y);
        }
    }
}

function logger() {
    let idealPrecision = 3;
    // cuz i aint gon type that big name this many times
    let ip = idealPrecision;
    set("distance", planet.r.mag(), ip);
    set("speed", planet.v.mag(), ip);
    set("acceleration", mu/sq(planet.r.mag()), ip);
    set("starMass", M, ip);
    set("totalEnergy", planet.E, ip);
    set("kineticEnergy", 0.5*sq(planet.v.mag()), ip);
    set("gravitationalEnergy", -mu/planet.r.mag(), ip);
    set("angularMomentum", planet.h.z, ip);
    let radialSpeed = p5.Vector.dot(planet.v, p5.Vector.mult(planet.r, 1/planet.r.mag()));;
    let perpendicularSpeed = sqrt(sq(planet.v.mag())-sq(radialSpeed));
    set("angularSpeed", perpendicularSpeed/planet.r.mag(), ip);
    set("radialSpeed", radialSpeed, ip);
    set("eccentricity", planet.e, ip);
    set("period", planet.T, ip);
    set("semiMajorAxis", planet.a, ip);
    set("semiMinorAxis", planet.b, ip);
    set("focalDistance", planet.fd, ip);
    function set(property, value, precision) {
        log[property].innerHTML = value.toPrecision(precision).toString();
    }
}