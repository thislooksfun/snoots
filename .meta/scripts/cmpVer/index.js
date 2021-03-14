module.exports = {
  cmpKeys: require("./cmpKeys"),
  cmpPre: require("./cmpPre"),
  compare: require("./compare"),
  isPre: sv => sv.prerelease.length > 0,
};
