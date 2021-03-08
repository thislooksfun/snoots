// semantic-release config
const commitMsg = "chore(release): ${nextRelease.version} [skip ci]";
module.exports = {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    ["@semantic-release/npm", { tarballDir: "release" }],
    ["@semantic-release/github", { assets: "release/*.tgz" }],
    ["@semantic-release/git", { message: commitMsg }],
  ],
  preset: "conventionalcommits",
};
