const semver = require("semver");
const cmpPre = require("./cmpPre");
const compare = require("./compare");

const keyOrder = ["master", "latest", "stable"];

function cmpSpecial(a, b) {
  // Put 'master', 'latest', and 'stable' at the top, in that order.
  const ia = keyOrder.findIndex(o => o === a);
  const ib = keyOrder.findIndex(o => o === b);
  if (ia > -1) {
    if (ib < 0) return -1;
    return ia === ib ? 0 : ia < ib ? -1 : 1;
  }
  if (ib > -1) return 1;

  return null;
}

function cmpVerRange(v, r) {
  if (!semver.validRange(r)) return 1;
  const sat = semver.satisfies(v, r);
  const out = sat ? 1 : -compare(v, r.replace(/x/g, Number.MAX_SAFE_INTEGER));
  return out;
}

function cmpRanges(a, b) {
  const aa = a.replace(/x/g, Number.MAX_SAFE_INTEGER);
  const bb = b.replace(/x/g, Number.MAX_SAFE_INTEGER);
  const res = compare(aa, bb);
  if (res !== 0) return -res;

  const ca = (a.match(/x/g) || []).length;
  const cb = (b.match(/x/g) || []).length;
  return cb - ca;
}

/**
 * Sort in the order (e.g.):
 * - latest
 * - stable
 * - beta
 * - alpha
 * - dev
 * - v1.x.x
 * - v1.2.x
 * - v1.2.2
 * - v1.2.1
 * - v1.2.1-beta.1
 * - v1.2.0
 * - v1.1.x
 * - v1.1.5
 * - etc.
 */
function cmpKeys(a, b) {
  if (a === b) return 0;

  let res = cmpSpecial(a, b);
  if (res != null) return res;

  const va = !!semver.valid(a);
  const vb = !!semver.valid(b);
  if (va && vb) {
    // Both keys are valid versions. Sort them in reverse order so we get the
    // newest at the top.
    return -compare(a, b, true);
  }

  const ra = !!semver.validRange(a);
  const rb = !!semver.validRange(b);
  if (va !== vb) {
    // Only one key is a valid version.
    return va ? cmpVerRange(a, b) : -cmpVerRange(b, a);
  } else if (ra && rb) {
    return cmpRanges(a, b);
  }

  // if (ra) {
  //   semver.intersects;
  //   const aa = a.replace(/x/g, 0);
  //   if (!rb) return -1;
  //   const bb = b.replace(/x/g, 0);
  //   return compare(aa, bb) || 1;
  // }
  // if (rb) return 1;

  return -cmpPre([a], [b], true);
}

module.exports = cmpKeys;
