;(function() {
  'use strict';

  var pi = Math.PI, sin = Math.sin, cos = Math.cos;
  var PIXELS_PER_KM = 0.0005;

  var Orbit3D = function(eph, opts) {
    opts = opts || {};
    opts.width = opts.width || 1;
    opts.object_size = opts.object_size || 1;
    opts.jed =  opts.jed || 2451545.0;

    this.opts = opts;
    this.eph = eph;
  }

  Orbit3D.prototype.createOrbit = function() {
    var pts;
    var points;
    var time = this.opts.jed;
    var pts = [];
    var limit = this.eph.p + 1;
    var parts = this.eph.e > .20 ? 300 : 100;   // Extra precision for high eccentricity.
    var delta = Math.ceil(limit / parts);
    var prev;
    for (var i=0; i <= parts; i++, time+=delta) {
      var pos = this.getPosAtTime(time);
      var vector = new THREE.Vector3(pos[0], pos[1], pos[2]);
      prev = vector;
      pts.push(vector);
    }

    points = new THREE.Geometry();
    points.vertices = pts;
    points.computeLineDistances(); // Required for dotted lines.
    points.verticesNeedUpdate = true;
    points.lineDistancesNeedUpdate = true;

    var line = new THREE.Line(points,
      new THREE.LineDashedMaterial({
        color: this.opts.color,
        linewidth: this.opts.width,
        dashSize: 1,
        gapSize: 0.5
      }), THREE.LineStrip);
    return line;
  }

  Orbit3D.prototype.getPosAtTime = function(jed) {
    // Note: logic below must match the vertex shader.
    // This position calculation is used to create orbital ellipses.

    var e = this.eph.e;
    var a = this.eph.a;
    var i = this.eph.i * pi/180;
    var o = this.eph.o * pi/180; // longitude of ascending node
    var p = this.eph.w * pi/180; // LONGITUDE of perihelion
    var ma = this.eph.ma;
    var M;

    // Calculate mean anomaly at jed
    ma = ma * pi/180;
    var n = 2*pi / this.eph.p;
    var epoch = this.eph.epoch;
    var d = jed - epoch;
    M = ma + n * d;

    // Estimate eccentric and true anom using iterative approx
    var E0 = M;
    var lastdiff;
    do {
      var E1 = M + e * sin(E0);
      lastdiff = Math.abs(E1-E0);
      E0 = E1;
    } while(lastdiff > 0.0000001);
    var E = E0;
    var v = 2 * Math.atan(Math.sqrt((1+e)/(1-e)) * Math.tan(E/2));

    // Radius vector, in AU
    var r = a * (1 - e*e) / (1 + e * cos(v)) * PIXELS_PER_KM;

    // Hekliocentric coords
    var X = r * (cos(o) * cos(v + p - o) - sin(o) * sin(v + p - o) * cos(i))
    var Y = r * (sin(o) * cos(v + p - o) + cos(o) * sin(v + p - o) * cos(i))
    var Z = r * (sin(v + p - o) * sin(i))
    var ret = [X, Y, Z];
    return ret;
  }

  window.Orbit3D = Orbit3D;
})();
