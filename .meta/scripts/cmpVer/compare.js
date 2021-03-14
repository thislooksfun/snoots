const semver = require("semver");
const isPre = require("./isPre");
const cmpPre = require("./cmpPre");

function compare(v1, v2, semiRev = false) {
  if (v1 === v2) return 0;

  const a = semver.parse(v1);
  const b = semver.parse(v2);

  // If they are both pre-releases, we have to order them ourselves.
  if (isPre(a) && isPre(b)) {
    // By default SemVer.compare() sorts pre-releases alphabetically. This is
    // fine for the common categories 'alpha', 'beta', and 'rc', but we use
    // 'dev' which should come first, not third.
    const baseA = `${a.major}.${a.minor}.${a.patch}`;
    const baseB = `${b.major}.${b.minor}.${b.patch}`;
    return (
      compare(baseA, baseB, semiRev) ||
      cmpPre(a.prerelease, b.prerelease, semiRev)
    );
  } else {
    return a.compare(b);
  }
}

module.exports = compare;
