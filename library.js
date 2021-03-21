class Planet {
    constructor (x, y, vx, vy) {
        this.r = createVector(x, y);
        this.v = createVector(vx, vy);
        [this.E, this.h, this.phi, this.a, this.b, this.e, this.fd, this.gd, this.theta] = calo(this);
        this.d = 1.2742e7;

        // find position relative to untilted coordinate system (where phi is 0)
        let p = this.r.copy();
        p.rotate(-this.phi);
        [this.x, this.y] = [p.x-this.fd, p.y];

        // calculate time stuff
        this.T = sqrt(4 * sq(Math.PI) * (this.a * this.a * this.a) / mu);
        this.u = acost((this.e+cos(this.theta)) / (1+(this.e*cos(this.theta))));
        this.M = this.u-(this.e*sin(this.u));
        this.t = this.T * this.M / TAU;
        if ((this.theta > 0 && this.theta % TAU > PI) || (this.theta < 0 && this.theta % TAU < PI)) {
            this.t += 2*((this.T/2) - (this.t%this.T));
        }
    }
    
    adjustThetaToU() {
        let cu = cos(this.u);
        this.theta = acost((cu-this.e) / (1-(cu*this.e)));
        if (this.t%this.T>this.T/2) {
            this.theta = -this.theta;
        }
    }
    adjustToTheta() {
        this.r = createVector(- (this.h.mag()*this.h.mag()/mu) / (1+(this.e*cos(this.theta))), 0);
        this.r.rotate(this.phi);
        if (this.h.z > 0) {
            this.r.rotate(this.theta);
        } else {
            this.r.rotate(-this.theta);
        }
        let p = this.r.copy();
        p.rotate(-this.phi);
        [this.x, this.y] = [p.x-this.fd, p.y];
        this.adjustVelocity();
    }
    adjustVelocity() {
        let speed = sqrt(2*(this.E + (mu/this.r.mag())));
        let anglerv = asint(this.h.z/(this.r.mag()*speed));
        if (this.t%this.T>this.T/2) {
            anglerv = PI -anglerv;
        }
        this.v = this.r.copy();
        this.v.mult(speed/this.r.mag());
        this.v.rotate(anglerv);
    }
}

function calo(planet) {
    let E = (0.5*sq(planet.v.mag())) - (mu/planet.r.mag());
    let h = p5.Vector.cross(planet.r, planet.v);
    let phi, a, b, e, fd, gd, theta;
    if (E < 0) {
        a = -mu/(2*E);
        e = sqrt(1-sq(h.mag())/(a*mu));
        fd = a*e;
        b = sqrt(sq(a)-sq(fd));
        gd = a/e;
        theta = acost((((h.mag() * h.mag()) / mu) - planet.r.mag()) / (planet.r.mag() * e));
        // if planet is returning to periapse, then theta is the other solution of arccos;
        if (p5.Vector.dot(planet.r, planet.v) < 0) {
            theta = -theta;
        }
        if (h.z >= 0) {
            phi = createVector(-100, 0).angleBetween(planet.r) - theta;
        } else {
            phi = createVector(-100, 0).angleBetween(planet.r) + theta;
        }
    }
    return [E, h, phi, a, b, e, fd, gd, theta];
}

// finds solution to equation by iteration method if iterative function given
function findxgiveni (xnow, iterativeFunction, precision) {
    let px;
    do {
        px = xnow;
        xnow = iterativeFunction(xnow);
    } while (abs(xnow-px) > precision);
    return xnow;
}

// cuz sometimes you wanna find acos(1.000000000015)
function acost(c) {
    if (c > 1) {
        c = 1;
    } else if (c<-1) {
        c = -1;
    }
    return acos(c);
}
function asint(s) {
    if (s > 1) {
        s = 1;
    } else if (s<-1) {
        s = -1;
    }
    return asin(s);
}

class Log {
    constructor(){
        this.logHolder = document.querySelector(".log_holder");
        document.querySelector(".log_holder").style.height = `${innerHeight - 50}px`;
        this.initiateVariable("distance", "distance", "Distance", "meter");
        this.initiateVariable("speed", "speed", "Speed", "meter per second");
        this.initiateVariable("acceleration", "acceleration", "Acceleration", "meter per second squared");
        this.initiateVariable("total_energy", "totalEnergy", "Total energy (per unit mass)", "joule per kg");
        this.initiateVariable("kinetic_energy", "kineticEnergy", "Kinetic energy", "joule per kg");
        this.initiateVariable("gravitational_energy", "gravitationalEnergy", "Gravitational potential erergy", "joule per kg");
        this.initiateVariable("angular_momentum", "angularMomentum", "Angular momentum (per unit mass)", "meter squared per second");
        this.initiateVariable("angular_speed", "angularSpeed", "Angular speed", "radian per second");
        //this.initiateVariable("angular_acceleration", "angularAcceleration", "Angular speed", "radian per second squared");
        this.initiateVariable("radial_speed", "radialSpeed", "Radial speed", "meter per second");
        //this.initiateVariable("radial_acceleration", "radialAcceleration", "Radial acceleration", "meter per second squared");
        this.initiateVariable("eccentricity", "eccentricity", "Eccentricity", "");
        this.initiateVariable("period", "period", "Orbital period", "second");
        this.initiateVariable("semi-major_axis", "semiMajorAxis", "Semi-major axis", "meter");
        this.initiateVariable("semi-minor_axis", "semiMinorAxis", "Semi-minor axis", "meter");
        this.initiateVariable("focal_distance", "focalDistance", "Focal distance", "meter");
    }
    initiateVariable(variableHTML, variableJS, variableDisplay, units) {
        // property element
        let propertyName = document.createElement("p");
        propertyName.classList.add("property_name");
        propertyName.innerHTML = variableDisplay;
        // unit element
        let unit = document.createElement("p");
        unit.classList.add("unit");
        unit.innerHTML = `/${units}`;
        let property = document.createElement("div");
        property.classList.add("property");
        property.appendChild(propertyName);       
        property.appendChild(unit);       
        // value element
        let value = document.createElement("p");
        value.classList.add("value");
        // parent div to hold all log for this variable
        let div = document.createElement("div");
        div.classList.add("log");
        div.id = variableHTML;
        // append all those elements to main div
        div.appendChild(property);
        div.appendChild(value);
        // throw this new div to DOM via logHolder
        this.logHolder.appendChild(div);
        // remember the value element so that it can be changed later according to the value of this variable (in script.js)
        this[variableJS] = document.querySelector(`#${variableHTML} .value`);
    }
}