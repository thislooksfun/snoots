const fs = require("fs");
const path = require("path");
const semver = require("semver");
const { cmpKeys, compare } = require("./cmpVer");

const docRoot = path.join(__dirname, "../../docs");
process.chdir(docRoot);
console.log(`Moved to ${docRoot}`);

const versions = {};
function updateVersion(key, nv) {
  const old = versions[key] || "0.0.0";
  if (compare(old, nv) < 0) {
    versions[key] = nv;
  }
}

function isSL(pth) {
  return fs.existsSync(pth) && fs.lstatSync(pth).isSymbolicLink();
}
function isDir(pth) {
  return fs.existsSync(pth) && fs.lstatSync(pth).isDirectory();
}

for (const name of fs.readdirSync(docRoot)) {
  console.log(`Checking file ${docRoot}/${name}`);
  if (isSL(name)) continue;
  if (!isDir(name)) continue;
  versions[name] = name;
  if (!semver.valid(name)) continue;

  const { major, minor, patch, prerelease } = semver.parse(name);

  updateVersion("latest", name);
  if (prerelease.length > 0) {
    const prType = prerelease[0];
    updateVersion(`v${major}.${minor}.${patch}-${prType}`, name);
    updateVersion(prType, name);
  } else {
    updateVersion(`v${major}.${minor}.x`, name);
    updateVersion(`v${major}.x.x`, name);
    updateVersion("stable", name);
  }
}

console.log("Found versions:");
console.log(JSON.stringify(versions, null, 2));

function ln(from, to) {
  if (fs.existsSync(to)) {
    if (!isSL(to)) return;
    fs.unlinkSync(to);
  }
  console.log(`Linking: ${to} -> ${from}`);
  fs.symlinkSync(from, to);
}

let versionLinks = "";
let keys = Object.keys(versions).sort(cmpKeys);

for (const key of keys) {
  ln(versions[key], key);
  versionLinks += `\n<li><a href="${key}">${key}</a></li>`;
}

// Update version links.
console.log("Updating version links in index.html...");
let index = fs.readFileSync("./index.html", { encoding: "utf-8" });
index = index.replace(
  /<!-- START:VERSIONS -->[\s\S]*?<!-- END:VERSIONS -->/,
  `<!-- START:VERSIONS -->${versionLinks}\n<!-- END:VERSIONS -->`
);
fs.writeFileSync("./index.html", index);
console.log("index.html updated successfully!");
