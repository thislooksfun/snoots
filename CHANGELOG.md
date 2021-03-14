## 1.0.0-dev.1 (2021-03-14)


### Features

* add a base data object ([74637d8](https://github.com/thislooksfun/snoots/commit/74637d84b6282e1fa06cb49356c451149953466e))
* add a function to distinguish a comment ([e4c681f](https://github.com/thislooksfun/snoots/commit/e4c681f82966185241e7d88c397d4b616ca1a397))
* add a function to update the client's token ([3964f7a](https://github.com/thislooksfun/snoots/commit/3964f7a6c1419e2d49a1fe878e2b4eedec096d82))
* add a method to remove an item ([6e77a74](https://github.com/thislooksfun/snoots/commit/6e77a74344a350a1ffcadb58ad091d64ca4e329f))
* add banNote ([6892f44](https://github.com/thislooksfun/snoots/commit/6892f44a4c5f05a877e03c1ca64b291707a8c7b8))
* add base listing implementation ([90b8f2a](https://github.com/thislooksfun/snoots/commit/90b8f2a7ad70780b4474b155aa9b2857b35409db))
* add base type for votable objects ([2da716c](https://github.com/thislooksfun/snoots/commit/2da716c116740e2b061c6857ffebcddfc0a3d39a))
* add client-authorized api wrapper ([22c7f87](https://github.com/thislooksfun/snoots/commit/22c7f874db3c3567b8a6701836f762ad044eb32e))
* add controls for interacting with comments ([6f7b81e](https://github.com/thislooksfun/snoots/commit/6f7b81e7d3dbacb20dd22c30549af8bbce88123a))
* add controls for interacting with voteable objects ([8c08cbc](https://github.com/thislooksfun/snoots/commit/8c08cbc1556ee70e1461666948e2938c93c6d8c1))
* add core api wrapper ([75fbc27](https://github.com/thislooksfun/snoots/commit/75fbc273e78f4a6f645d92d8ac2490f58949f22e))
* add dismissedUserReports ([daa9aac](https://github.com/thislooksfun/snoots/commit/daa9aaceef681500706315ece6ec94ab874448df))
* add helper function to update an oauth token ([507d61c](https://github.com/thislooksfun/snoots/commit/507d61c9735765ff8618baa465615b30d43acff4))
* add helper functions to Voteable ([aa0ca66](https://github.com/thislooksfun/snoots/commit/aa0ca66b85e417f1f55eb20d936e112cd77010e9))
* add helper get() and post() methods ([29f4876](https://github.com/thislooksfun/snoots/commit/29f48765a5178e98c41e21cd12ecad882235cf5a))
* add helper to camelCase the keys in an object ([b5e5c83](https://github.com/thislooksfun/snoots/commit/b5e5c83e12a42dd67dbad61fbf4e6eee082b56b7))
* add helper to split an array into sized groups ([ffbe5b1](https://github.com/thislooksfun/snoots/commit/ffbe5b1a955d93ac9df63693d4eb2ed89affd296))
* add missing functions to VoteableControls ([3dc79db](https://github.com/thislooksfun/snoots/commit/3dc79dba3a39b8d5007f1a855c151cc747ab60f2))
* add oauth api wrapper ([0b6501e](https://github.com/thislooksfun/snoots/commit/0b6501e7e8f7992f2d97ec5e50f00e59d135496d))
* add the ability to ignore reports on an item ([31f6cc1](https://github.com/thislooksfun/snoots/commit/31f6cc1a21e289dc818ae7b8cb6c70bb63c2403c))
* add unauthorized api wrapper ([052c592](https://github.com/thislooksfun/snoots/commit/052c5926d82ee031faf04558c6341346ed4c1cd9))
* add VoteableData.*ReportsDismissed ([41da3f1](https://github.com/thislooksfun/snoots/commit/41da3f1ca85fcb796e9a54187e2682705440500e))
* allow application-only-auth ([487c5fd](https://github.com/thislooksfun/snoots/commit/487c5fdb55af3bdffabce13bbeb4d549374aed89))
* initial commit ([cedbf15](https://github.com/thislooksfun/snoots/commit/cedbf1565672353a10713fa0d76c35953bc26ed9))
* make the client take in options ([79875ab](https://github.com/thislooksfun/snoots/commit/79875ab2633fc9b1c1eea00964a9cf0c50141cff))
* remove CommentData.depth ([b5d6bf4](https://github.com/thislooksfun/snoots/commit/b5d6bf47e34bf4078b6dfaba3f0f2023729730fd))
* remove subredditId ([431efe2](https://github.com/thislooksfun/snoots/commit/431efe2fb35cbad8b9b4d72ab8f4c73e4ded9abe))
* start work on Client object ([4628499](https://github.com/thislooksfun/snoots/commit/4628499799f28c5207e6159999accecfc34dbe58))


### Bug Fixes

* accurately reflect types of 'edited' ([65f94c7](https://github.com/thislooksfun/snoots/commit/65f94c76e1959667b7e866d18e02145770e2d7cc))
* fix types of mod* attributes ([0db4994](https://github.com/thislooksfun/snoots/commit/0db49946e2794b10d7d7d6041344f54dc7ead054))
* fix VoteableData.userReports' type ([df5301d](https://github.com/thislooksfun/snoots/commit/df5301d4ee8e9a8e87afdd2325819e309070d4d0))
* make form the default POST body ([8a80eac](https://github.com/thislooksfun/snoots/commit/8a80eac9bc5cb8f7bbd1474352e5f3167dd3f679))
* mark gid_x as optional ([35a38b2](https://github.com/thislooksfun/snoots/commit/35a38b2443053068c7cfc7ad90409eea60c5e67e))
* remove reportReasons ([0fbcc02](https://github.com/thislooksfun/snoots/commit/0fbcc028bc290518f5010362e156df57d4ba55f2))
* request json api on all json posts ([5a8ff48](https://github.com/thislooksfun/snoots/commit/5a8ff48712ff79474c5722121b82bf992d284bde))


### Performance Improvements

* cache the lookahead for future use ([4a6b8cb](https://github.com/thislooksfun/snoots/commit/4a6b8cbb5b6b0cf58e83a8efea214fa852ff22fe))
