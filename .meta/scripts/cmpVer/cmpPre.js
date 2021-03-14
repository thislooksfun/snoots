const semver = require("semver");

const preOrder = ["dev", "alpha", "beta", "rc"];
function cmpPre([a1, ...ar], [b1, ...br], semiRev = false) {
  if (a1 == null) {
    return b1 == null ? 0 : semiRev ? 1 : -1;
  }
  if (b1 == null) return semiRev ? -1 : 1;

  const ia = preOrder.findIndex(o => o === a1);
  const ib = preOrder.findIndex(o => o === b1);

  if (ia === ib) {
    if (ia === -1) {
      // Not an entry in our table, fall back on default sort.
      return semver.compareIdentifiers(a1, b1) || cmpPre(ar, br, semiRev);
    } else {
      return cmpPre(ar, br, semiRev);
    }
  } else {
    return ia < ib ? -1 : 1;
  }
}

module.exports = cmpPre;
