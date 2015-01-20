var distance = require('turf-distance');
var point = require('turf-point');
var bearing = require('turf-bearing');
var destination = require('turf-destination');

/**
Returns a point at a specified distance along a line.

@module turf/along
@param {LineString} Line to move along
@param {Number} Distance to move
@param {String} [units=miles] can be degrees, radians, miles, or kilometers
@return {Point} Point along the line at X distance
@example
var line = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [
        -77.0316696166992,
        38.878605901789236
      ],
      [
        -77.02960968017578,
        38.88194668656296
      ],
      [
        -77.02033996582031,
        38.88408470638821
      ],
      [
        -77.02566146850586,
        38.885821800123196
      ],
      [
        -77.02188491821289,
        38.88956308852534
      ],
      [
        -77.01982498168944,
        38.89236892551996
      ]
    ]
  }
}

var along = turf.along(line, 1, 'miles');
//=along
*/
module.exports = function (line, dist, units) {
  var coords;
  if(line.type === 'Feature') coords = line.geometry.coordinates;
  else if(line.type === 'LineString') coords = line.geometry.coordinates;
  else throw new Error('input must be a LineString Feature or Geometry');

  var travelled = 0;
  for(var i = 0; i < coords.length - 1; i++) {
    if(travelled >= dist) {
      var overshot = dist - travelled;
      if(!overshot) return point(coords[i]);
      else {
        var direction = bearing(point(coords[i]), point(coords[i-1])) - 180;
        var interpolated = destination(point(coords[i]), overshot, direction, units);
        return interpolated;
      }
    }
    else {
      travelled += distance(point(coords[i]), point(coords[i+1]), units);
    }
  }
  return point(coords[coords.length - 1]);
}