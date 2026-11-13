:robot: I have created a release *beep* *boop*
---


<details><summary>@leather.io/analytics: 3.27.0</summary>

## [3.27.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/analytics-v3.26.1...@leather.io/analytics-v3.27.0) (2026-11-13)


### Features

* add pox-5 staking ([#2539](https://github.com/edgar-stacks-fixer-bot/mono/issues/2539)) ([f348a4d](https://github.com/edgar-stacks-fixer-bot/mono/commit/f348a4d7123f6445c64a617438f944f8cdcf9cb4))
* address verification ([#2549](https://github.com/edgar-stacks-fixer-bot/mono/issues/2549)) ([4965f2d](https://github.com/edgar-stacks-fixer-bot/mono/commit/4965f2d8e71b93a286f7cd1ab6f04493dbe7cfa8))
* delete legacy requests ([#2612](https://github.com/edgar-stacks-fixer-bot/mono/issues/2612)) ([c17d65f](https://github.com/edgar-stacks-fixer-bot/mono/commit/c17d65fc12fd799ff045d6fb725b57b50462fd84))
* **extension:** deprecation of ordinals and runes ([d6e1fea](https://github.com/edgar-stacks-fixer-bot/mono/commit/d6e1feaccb47de540983c9263cb198f279ed7679))
* **extension:** new swaps flow with sBTC bridging ([#2554](https://github.com/edgar-stacks-fixer-bot/mono/issues/2554)) ([65c8518](https://github.com/edgar-stacks-fixer-bot/mono/commit/65c85186c847b2e99fd062d00997c81932268bc5))
* **extension:** tell users when a new version is available ([#2793](https://github.com/edgar-stacks-fixer-bot/mono/issues/2793)) ([6ef500a](https://github.com/edgar-stacks-fixer-bot/mono/commit/6ef500afb68f502e3de3873d55397ca9ed4bd45e))
* migrate compliance check call to new service ([#2484](https://github.com/edgar-stacks-fixer-bot/mono/issues/2484)) ([b410f39](https://github.com/edgar-stacks-fixer-bot/mono/commit/b410f39a9f3e490dd35bded04d73bdf8f4bb3533))
* **mobile:** token presets and a hidden tokens pill under the list ([#2859](https://github.com/edgar-stacks-fixer-bot/mono/issues/2859)) ([9e71d62](https://github.com/edgar-stacks-fixer-bot/mono/commit/9e71d6218aca02385ab98330c9ff90c8e85bd2fe))
* **services:** replace chainalysis with leather api compliance endpoint ([#2606](https://github.com/edgar-stacks-fixer-bot/mono/issues/2606)) ([ac3a931](https://github.com/edgar-stacks-fixer-bot/mono/commit/ac3a931ed2dec18d52dd3832450fb59f4dc5282d))
* token price history graph ([#2764](https://github.com/edgar-stacks-fixer-bot/mono/issues/2764)) ([b7c56bc](https://github.com/edgar-stacks-fixer-bot/mono/commit/b7c56bc7eb49b3a38ea7f40c6332e6c5ce390f93))
* tx proposal in extension via rpc requests ([#2472](https://github.com/edgar-stacks-fixer-bot/mono/issues/2472)) ([ef5f7d2](https://github.com/edgar-stacks-fixer-bot/mono/commit/ef5f7d202e1d78862d350443fe622732db25961e))
* **web:** update-stake signer-manager switching ([#2657](https://github.com/edgar-stacks-fixer-bot/mono/issues/2657)) ([5b7f7d8](https://github.com/edgar-stacks-fixer-bot/mono/commit/5b7f7d8f0cf948a1d23bd08ee5843274b073e701))


### Bug Fixes

* add all balances settings tab ([#2552](https://github.com/edgar-stacks-fixer-bot/mono/issues/2552)) ([1ef1c33](https://github.com/edgar-stacks-fixer-bot/mono/commit/1ef1c33ecb393f6e2d87f0829773e88e7a59fcfa))
* add ledger derivation paths ([#2592](https://github.com/edgar-stacks-fixer-bot/mono/issues/2592)) ([94806ea](https://github.com/edgar-stacks-fixer-bot/mono/commit/94806eaffddabc4a2e1d6c29fa405979e8170c95))
* legacy requests callout / analytics ([236e016](https://github.com/edgar-stacks-fixer-bot/mono/commit/236e01633d5b26871f2d89eeb61ede098d646240))
* remove runes/ordinals pages from services/models ([#2358](https://github.com/edgar-stacks-fixer-bot/mono/issues/2358)) ([101bf28](https://github.com/edgar-stacks-fixer-bot/mono/commit/101bf2808285991f40d93e6eaad00f32c4435675))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @leather.io/models bumped to 0.64.0
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
</details>

<details><summary>@leather.io/bitcoin: 0.43.0</summary>

## [0.43.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/bitcoin-v0.42.1...@leather.io/bitcoin-v0.43.0) (2026-11-13)


### Features

* auth infrastructure ([#2368](https://github.com/edgar-stacks-fixer-bot/mono/issues/2368)) ([f3d4b3e](https://github.com/edgar-stacks-fixer-bot/mono/commit/f3d4b3e91e86f0d69606c21f67985b3eed762f1f))
* bond exit ([#2648](https://github.com/edgar-stacks-fixer-bot/mono/issues/2648)) ([289275f](https://github.com/edgar-stacks-fixer-bot/mono/commit/289275f169a4b0563d2fec662e48c9a844792bf3))
* build multisig transfer transactions ([#2418](https://github.com/edgar-stacks-fixer-bot/mono/issues/2418)) ([c72b145](https://github.com/edgar-stacks-fixer-bot/mono/commit/c72b1453cffbcbaa3d972823ce173bc10cb85731))
* fully move to dmk btc/stx dmk packages ([#2763](https://github.com/edgar-stacks-fixer-bot/mono/issues/2763)) ([c4bb5f3](https://github.com/edgar-stacks-fixer-bot/mono/commit/c4bb5f39ed9f2ff88ce59c325e86dda0cb87568b))
* multisig tx signing ([#2431](https://github.com/edgar-stacks-fixer-bot/mono/issues/2431)) ([1997d3d](https://github.com/edgar-stacks-fixer-bot/mono/commit/1997d3d8bb0314ef4fd4104fb3303a600a46b0e7))
* policy account state ([#2430](https://github.com/edgar-stacks-fixer-bot/mono/issues/2430)) ([01e4ea0](https://github.com/edgar-stacks-fixer-bot/mono/commit/01e4ea07d67a8dbf4209912aa1c14304b770d521))
* policy accounts ([#2438](https://github.com/edgar-stacks-fixer-bot/mono/issues/2438)) ([08d3861](https://github.com/edgar-stacks-fixer-bot/mono/commit/08d3861dfd5cced3ae2cd23b547007b84a83a5b9))
* spending sources foundation + btc send flow ([#2820](https://github.com/edgar-stacks-fixer-bot/mono/issues/2820)) ([181c4f7](https://github.com/edgar-stacks-fixer-bot/mono/commit/181c4f71366f1cb4a744ae04d261f1fa63d75f30))
* tx proposal in extension via rpc requests ([#2472](https://github.com/edgar-stacks-fixer-bot/mono/issues/2472)) ([ef5f7d2](https://github.com/edgar-stacks-fixer-bot/mono/commit/ef5f7d202e1d78862d350443fe622732db25961e))
* **web:** support custom private regtest network for multisig internal testing ([#2476](https://github.com/edgar-stacks-fixer-bot/mono/issues/2476)) ([143950b](https://github.com/edgar-stacks-fixer-bot/mono/commit/143950b3c49711ac643a3e04ae4b5bec6fa63572))


### Bug Fixes

* add @stacks/connect ([#2580](https://github.com/edgar-stacks-fixer-bot/mono/issues/2580)) ([625b20b](https://github.com/edgar-stacks-fixer-bot/mono/commit/625b20b6a68ee0c1bba63e892b46b837561b71e9))
* add non zero index signing for descriptor mode in signPsbt ([#2382](https://github.com/edgar-stacks-fixer-bot/mono/issues/2382)) ([ad289a7](https://github.com/edgar-stacks-fixer-bot/mono/commit/ad289a7a03b0bc11042b3e335b58b8d39d2e0cf6))
* add support for tpubs ([#2381](https://github.com/edgar-stacks-fixer-bot/mono/issues/2381)) ([09d4c94](https://github.com/edgar-stacks-fixer-bot/mono/commit/09d4c944af9b0f74bb15379382d47ad45f11832f))
* **bitcoin:** accept multi form in bond descriptor matching ([#2673](https://github.com/edgar-stacks-fixer-bot/mono/issues/2673)) ([77ad173](https://github.com/edgar-stacks-fixer-bot/mono/commit/77ad1735df93eec653557a807bf2ab4b9c9503d5))
* bitcoinjs-lib audit ([#2959](https://github.com/edgar-stacks-fixer-bot/mono/issues/2959)) ([47f9582](https://github.com/edgar-stacks-fixer-bot/mono/commit/47f95825a09be6f4ae695e0a2c62bf3268febb30))
* **bitcoin:** resolve the bond co-signer as an extended key so ledger can sign ([#2674](https://github.com/edgar-stacks-fixer-bot/mono/issues/2674)) ([7828c5b](https://github.com/edgar-stacks-fixer-bot/mono/commit/7828c5b4db6273f03873239138a5589f2296fc2b))
* **bitcoin:** verify psbt consistency in wsh descriptor finalization ([#2701](https://github.com/edgar-stacks-fixer-bot/mono/issues/2701)) ([68e36b4](https://github.com/edgar-stacks-fixer-bot/mono/commit/68e36b4e1e43a96e1343d1506e3c279829c5d6eb))
* body-parser and undici audit ([#2912](https://github.com/edgar-stacks-fixer-bot/mono/issues/2912)) ([2bee4e7](https://github.com/edgar-stacks-fixer-bot/mono/commit/2bee4e772dd95fff8406822a62225854fb708fbd))
* enforce runtime circular dependency detection ([#2852](https://github.com/edgar-stacks-fixer-bot/mono/issues/2852)) ([857e0f7](https://github.com/edgar-stacks-fixer-bot/mono/commit/857e0f79d75025cc0da9f31a78c875fa64ed5eba))
* **extension:** block psbt signing with disallowed sighash types ([#2667](https://github.com/edgar-stacks-fixer-bot/mono/issues/2667)) ([9b4d0f4](https://github.com/edgar-stacks-fixer-bot/mono/commit/9b4d0f46d6e77cbbda5da1b519ae853514fd1c30))
* **extension:** classify psbt inputs by script type when building signing config ([#2680](https://github.com/edgar-stacks-fixer-bot/mono/issues/2680)) ([263e3c2](https://github.com/edgar-stacks-fixer-bot/mono/commit/263e3c28d3975ee0e0fb2ec8607421a75c81230b))
* **extension:** ledger testnet address verification ([#2649](https://github.com/edgar-stacks-fixer-bot/mono/issues/2649)) ([f16cc57](https://github.com/edgar-stacks-fixer-bot/mono/commit/f16cc5757b7300c58f6ee2c05e56644e5d737a00))
* implement wsh signing in signPsbt ([#2374](https://github.com/edgar-stacks-fixer-bot/mono/issues/2374)) ([82f6216](https://github.com/edgar-stacks-fixer-bot/mono/commit/82f621646a4ff619e31090be9eb24ec148866349))
* **mobile:** signPsbt issues ([#2478](https://github.com/edgar-stacks-fixer-bot/mono/issues/2478)) ([bfdeb52](https://github.com/edgar-stacks-fixer-bot/mono/commit/bfdeb52641b522ecc537e1d853d35102b4645e0f))
* remove runes/ordinals pages from services/models ([#2358](https://github.com/edgar-stacks-fixer-bot/mono/issues/2358)) ([101bf28](https://github.com/edgar-stacks-fixer-bot/mono/commit/101bf2808285991f40d93e6eaad00f32c4435675))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* update ledger dependencies ([#2661](https://github.com/edgar-stacks-fixer-bot/mono/issues/2661)) ([7ef2061](https://github.com/edgar-stacks-fixer-bot/mono/commit/7ef20613d3a4858da6f6102bb586bbb370201e4b))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/constants bumped to 0.42.0
    * @leather.io/crypto bumped to 1.14.0
    * @leather.io/models bumped to 0.64.0
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/rpc bumped to 2.26.0
    * @leather.io/test-config bumped to 0.1.5
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/cms: 1.7.0</summary>

## [1.7.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/cms-v1.6.4...@leather.io/cms-v1.7.0) (2026-11-13)


### Features

* **cms:** add fully CMS-driven learn sections ([dc0ed7a](https://github.com/edgar-stacks-fixer-bot/mono/commit/dc0ed7a350d2f4be1f88c9e117531eea00257110))


### Bug Fixes

* body-parser and undici audit ([#2912](https://github.com/edgar-stacks-fixer-bot/mono/issues/2912)) ([2bee4e7](https://github.com/edgar-stacks-fixer-bot/mono/commit/2bee4e772dd95fff8406822a62225854fb708fbd))
* remove runes/ordinals pages from services/models ([#2358](https://github.com/edgar-stacks-fixer-bot/mono/issues/2358)) ([101bf28](https://github.com/edgar-stacks-fixer-bot/mono/commit/101bf2808285991f40d93e6eaad00f32c4435675))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* sunset basic sbtc rewards ([#2698](https://github.com/edgar-stacks-fixer-bot/mono/issues/2698)) ([745d583](https://github.com/edgar-stacks-fixer-bot/mono/commit/745d58317d430b8efe6bf1a7783dd086824fc6f5))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
</details>

<details><summary>@leather.io/constants: 0.42.0</summary>

## [0.42.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/constants-v0.41.0...@leather.io/constants-v0.42.0) (2026-11-13)


### Features

* add new activity list ([#2555](https://github.com/edgar-stacks-fixer-bot/mono/issues/2555)) ([7d5f88a](https://github.com/edgar-stacks-fixer-bot/mono/commit/7d5f88a8f5af565d381c231a401842462263c322))
* **cms:** add fully CMS-driven learn sections ([dc0ed7a](https://github.com/edgar-stacks-fixer-bot/mono/commit/dc0ed7a350d2f4be1f88c9e117531eea00257110))
* delete legacy requests ([#2612](https://github.com/edgar-stacks-fixer-bot/mono/issues/2612)) ([c17d65f](https://github.com/edgar-stacks-fixer-bot/mono/commit/c17d65fc12fd799ff045d6fb725b57b50462fd84))
* **extension:** add aeUSDC retirement callout ([#2336](https://github.com/edgar-stacks-fixer-bot/mono/issues/2336)) ([a2f8423](https://github.com/edgar-stacks-fixer-bot/mono/commit/a2f8423fae4074f952a016b249c291674c7878fa))
* **extension:** new swaps flow with sBTC bridging ([#2554](https://github.com/edgar-stacks-fixer-bot/mono/issues/2554)) ([65c8518](https://github.com/edgar-stacks-fixer-bot/mono/commit/65c85186c847b2e99fd062d00997c81932268bc5))
* pin sBTC and USDCx after BTC and STX in token lists ([#2858](https://github.com/edgar-stacks-fixer-bot/mono/issues/2858)) ([12d4c39](https://github.com/edgar-stacks-fixer-bot/mono/commit/12d4c398445f690c714d16e4198b8a4ec47f9566))
* policy account state ([#2430](https://github.com/edgar-stacks-fixer-bot/mono/issues/2430)) ([01e4ea0](https://github.com/edgar-stacks-fixer-bot/mono/commit/01e4ea07d67a8dbf4209912aa1c14304b770d521))


### Bug Fixes

* add support for tpubs ([#2381](https://github.com/edgar-stacks-fixer-bot/mono/issues/2381)) ([09d4c94](https://github.com/edgar-stacks-fixer-bot/mono/commit/09d4c944af9b0f74bb15379382d47ad45f11832f))
* **auth:** bind sign-in message to requesting domain ([#2690](https://github.com/edgar-stacks-fixer-bot/mono/issues/2690)) ([dfb58cb](https://github.com/edgar-stacks-fixer-bot/mono/commit/dfb58cb5e85b2a10f89d830c5e3269c458dc6564))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* **web:** cap multisig member/vault names and truncate account address ([#2544](https://github.com/edgar-stacks-fixer-bot/mono/issues/2544)) ([ed3697c](https://github.com/edgar-stacks-fixer-bot/mono/commit/ed3697cb98d1e31997302798ba4cc994cb856617))
* **web:** unblock footer links under the connect overlay and retire Advanced Earn ([#2731](https://github.com/edgar-stacks-fixer-bot/mono/issues/2731)) ([7c4ac69](https://github.com/edgar-stacks-fixer-bot/mono/commit/7c4ac6979a7f9f656bc7caf709fd61c521f504b8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/models bumped to 0.64.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/crypto: 1.14.0</summary>

## [1.14.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/crypto-v1.13.11...@leather.io/crypto-v1.14.0) (2026-11-13)


### Features

* multisig service transactions ([#2404](https://github.com/edgar-stacks-fixer-bot/mono/issues/2404)) ([8c3a1d4](https://github.com/edgar-stacks-fixer-bot/mono/commit/8c3a1d41b09c1caf4f526ac9b567d479c1436c40))
* multiwallet UI ([#2356](https://github.com/edgar-stacks-fixer-bot/mono/issues/2356)) ([34e7419](https://github.com/edgar-stacks-fixer-bot/mono/commit/34e7419c4a870546500e3896d2ec2890fe309f33))


### Bug Fixes

* account lookup ([#2416](https://github.com/edgar-stacks-fixer-bot/mono/issues/2416)) ([a250a30](https://github.com/edgar-stacks-fixer-bot/mono/commit/a250a30a2be396846c9af017c3ac94eeb7a92fc6))
* add ledger derivation paths ([#2592](https://github.com/edgar-stacks-fixer-bot/mono/issues/2592)) ([94806ea](https://github.com/edgar-stacks-fixer-bot/mono/commit/94806eaffddabc4a2e1d6c29fa405979e8170c95))
* add support for tpubs ([#2381](https://github.com/edgar-stacks-fixer-bot/mono/issues/2381)) ([09d4c94](https://github.com/edgar-stacks-fixer-bot/mono/commit/09d4c944af9b0f74bb15379382d47ad45f11832f))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/constants bumped to 0.42.0
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
</details>

<details><summary>@leather.io/eslint-config: 0.14.5</summary>

## [0.14.5](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/eslint-config-v0.14.4...@leather.io/eslint-config-v0.14.5) (2026-11-13)


### Bug Fixes

* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
</details>

<details><summary>@leather.io/extension: 6.116.0</summary>

## [6.116.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/extension-v6.115.0...@leather.io/extension-v6.116.0) (2026-11-13)


### Features

* add banners ([245d75f](https://github.com/edgar-stacks-fixer-bot/mono/commit/245d75f017839f7610dbe1fdcf40b7527f690c32))
* add BNS testnet support ([#2733](https://github.com/edgar-stacks-fixer-bot/mono/issues/2733)) ([8f92aa3](https://github.com/edgar-stacks-fixer-bot/mono/commit/8f92aa3b6d0f87f765f7de98eeecfe24e2bd2939))
* add btc/stx_addAccount rpc approver flow ([#2421](https://github.com/edgar-stacks-fixer-bot/mono/issues/2421)) ([e3cd9b4](https://github.com/edgar-stacks-fixer-bot/mono/commit/e3cd9b45eab45eef54446943adfb3830522ee7ed))
* add new activity list ([#2555](https://github.com/edgar-stacks-fixer-bot/mono/issues/2555)) ([7d5f88a](https://github.com/edgar-stacks-fixer-bot/mono/commit/7d5f88a8f5af565d381c231a401842462263c322))
* add new postconditions ([#2422](https://github.com/edgar-stacks-fixer-bot/mono/issues/2422)) ([2416d06](https://github.com/edgar-stacks-fixer-bot/mono/commit/2416d0668a194e0de7ede0c724238b92cb361e81))
* address verification ([#2549](https://github.com/edgar-stacks-fixer-bot/mono/issues/2549)) ([4965f2d](https://github.com/edgar-stacks-fixer-bot/mono/commit/4965f2d8e71b93a286f7cd1ab6f04493dbe7cfa8))
* bond exit ([#2648](https://github.com/edgar-stacks-fixer-bot/mono/issues/2648)) ([289275f](https://github.com/edgar-stacks-fixer-bot/mono/commit/289275f169a4b0563d2fec662e48c9a844792bf3))
* bump stacks minimum app version and update designs ([#2591](https://github.com/edgar-stacks-fixer-bot/mono/issues/2591)) ([e491bd8](https://github.com/edgar-stacks-fixer-bot/mono/commit/e491bd86310f656f11e29fb16ead56c26d6cceb0))
* **cms:** add fully CMS-driven learn sections ([dc0ed7a](https://github.com/edgar-stacks-fixer-bot/mono/commit/dc0ed7a350d2f4be1f88c9e117531eea00257110))
* custom network for sendTransfer and signMessage ([#2392](https://github.com/edgar-stacks-fixer-bot/mono/issues/2392)) ([46a158d](https://github.com/edgar-stacks-fixer-bot/mono/commit/46a158d3287fe872143fee998e785558a4324d58))
* delete legacy requests ([#2612](https://github.com/edgar-stacks-fixer-bot/mono/issues/2612)) ([c17d65f](https://github.com/edgar-stacks-fixer-bot/mono/commit/c17d65fc12fd799ff045d6fb725b57b50462fd84))
* extension proposal ([#2538](https://github.com/edgar-stacks-fixer-bot/mono/issues/2538)) ([933f90e](https://github.com/edgar-stacks-fixer-bot/mono/commit/933f90e4e3c79ede5107672623ba73fc9fb9dfbc))
* **extension:** add aeUSDC retirement callout ([#2336](https://github.com/edgar-stacks-fixer-bot/mono/issues/2336)) ([a2f8423](https://github.com/edgar-stacks-fixer-bot/mono/commit/a2f8423fae4074f952a016b249c291674c7878fa))
* **extension:** add collectible details pages and manage inscriptions ([26fc7a9](https://github.com/edgar-stacks-fixer-bot/mono/commit/26fc7a925ec71720735abd9dc9e105472301c777))
* **extension:** add empty and error states to swap review ([d2102cc](https://github.com/edgar-stacks-fixer-bot/mono/commit/d2102cc1fa115564ff686134a5b0d433c71b2daf))
* **extension:** add few attributes to swap amount field ([9f4ca69](https://github.com/edgar-stacks-fixer-bot/mono/commit/9f4ca69559c61ee1ac58aef09b78512b29a37a59))
* **extension:** add swap review detail rows for account, rate, and min. receive ([edb8771](https://github.com/edgar-stacks-fixer-bot/mono/commit/edb8771eba7f35c1271876ff3f18642ed39d9a02))
* **extension:** add swap review details building blocks ([6acaf25](https://github.com/edgar-stacks-fixer-bot/mono/commit/6acaf258b547861d3a19b835b369e96859a40261))
* **extension:** add swap review price impact and fee rows ([01de174](https://github.com/edgar-stacks-fixer-bot/mono/commit/01de1744e3811c0757c716fc6662b73792b9521b))
* **extension:** add swap review slippage selector ([9f9ae97](https://github.com/edgar-stacks-fixer-bot/mono/commit/9f9ae97f85f770928cdf20bbaf277ff2971b1c65))
* **extension:** add swap review summary section ([3c71a81](https://github.com/edgar-stacks-fixer-bot/mono/commit/3c71a81ba2aef808bc702a3b679d7722f46ede4c))
* **extension:** add tooltips for swap review details and fees breakdown ([67cfcba](https://github.com/edgar-stacks-fixer-bot/mono/commit/67cfcbae900178042594b87ea18a5f290d7ca279))
* **extension:** add wallet fingerprint to getAddresses ([#2499](https://github.com/edgar-stacks-fixer-bot/mono/issues/2499)) ([8e13787](https://github.com/edgar-stacks-fixer-bot/mono/commit/8e13787b37de92b334ea98dbb371ac03c622848f))
* **extension:** bitcoin staking balances and positions UI ([#2715](https://github.com/edgar-stacks-fixer-bot/mono/issues/2715)) ([0af16a8](https://github.com/edgar-stacks-fixer-bot/mono/commit/0af16a8f1ac9509cf94a351f8f667ba5c2b85a83))
* **extension:** deprecation of ordinals and runes ([d6e1fea](https://github.com/edgar-stacks-fixer-bot/mono/commit/d6e1feaccb47de540983c9263cb198f279ed7679))
* **extension:** fee service usage in extension ([f295794](https://github.com/edgar-stacks-fixer-bot/mono/commit/f29579434d4291805dc1010faeac863dcadaaf5f))
* **extension:** first token ([a945df1](https://github.com/edgar-stacks-fixer-bot/mono/commit/a945df1e5bef1f884d3a1c670f7f5485376d6d2b))
* **extension:** migrate from webpack to vite ([#2703](https://github.com/edgar-stacks-fixer-bot/mono/issues/2703)) ([f364905](https://github.com/edgar-stacks-fixer-bot/mono/commit/f364905b60510fedd4cb2284f55821c00f047952))
* **extension:** new swaps flow with sBTC bridging ([#2554](https://github.com/edgar-stacks-fixer-bot/mono/issues/2554)) ([65c8518](https://github.com/edgar-stacks-fixer-bot/mono/commit/65c85186c847b2e99fd062d00997c81932268bc5))
* **extension:** refine Ledger account indication ([5d1a602](https://github.com/edgar-stacks-fixer-bot/mono/commit/5d1a602bd52013912f8e2f4051bc1de5d5361387))
* **extension:** remove runes and ordinals ([#2343](https://github.com/edgar-stacks-fixer-bot/mono/issues/2343)) ([88d12da](https://github.com/edgar-stacks-fixer-bot/mono/commit/88d12da1389dc241d24753f7f7f230a243b2444b))
* **extension:** show spending sources on rpc send transfer approval ([#2836](https://github.com/edgar-stacks-fixer-bot/mono/issues/2836)) ([6b51080](https://github.com/edgar-stacks-fixer-bot/mono/commit/6b51080ab45d5bcaef6bf39f6e57dc93b7e71f12))
* **extension:** support originator post-condition mode ([#2324](https://github.com/edgar-stacks-fixer-bot/mono/issues/2324)) ([6e7d3e1](https://github.com/edgar-stacks-fixer-bot/mono/commit/6e7d3e11b5d18a576c72fe4886f5ead6376d9d16))
* **extension:** tell users when a new version is available ([#2793](https://github.com/edgar-stacks-fixer-bot/mono/issues/2793)) ([6ef500a](https://github.com/edgar-stacks-fixer-bot/mono/commit/6ef500afb68f502e3de3873d55397ca9ed4bd45e))
* fully move to dmk btc/stx dmk packages ([#2763](https://github.com/edgar-stacks-fixer-bot/mono/issues/2763)) ([c4bb5f3](https://github.com/edgar-stacks-fixer-bot/mono/commit/c4bb5f39ed9f2ff88ce59c325e86dda0cb87568b))
* ledger dmk transport (hid instead of usb) (1/2) ([#2759](https://github.com/edgar-stacks-fixer-bot/mono/issues/2759)) ([462ddbc](https://github.com/edgar-stacks-fixer-bot/mono/commit/462ddbcffe12dd4955535f3f913816acb41b5b7d))
* migrate compliance check call to new service ([#2484](https://github.com/edgar-stacks-fixer-bot/mono/issues/2484)) ([b410f39](https://github.com/edgar-stacks-fixer-bot/mono/commit/b410f39a9f3e490dd35bded04d73bdf8f4bb3533))
* multisig fixed address account ([#2415](https://github.com/edgar-stacks-fixer-bot/mono/issues/2415)) ([964ff42](https://github.com/edgar-stacks-fixer-bot/mono/commit/964ff421f0b83ca688859f9bae7d2863adc9c183))
* multisig production cutover ([#2704](https://github.com/edgar-stacks-fixer-bot/mono/issues/2704)) ([8950cac](https://github.com/edgar-stacks-fixer-bot/mono/commit/8950cac2a3228a1621272f377796cdb3f0e7c264))
* multiwallet UI ([#2356](https://github.com/edgar-stacks-fixer-bot/mono/issues/2356)) ([34e7419](https://github.com/edgar-stacks-fixer-bot/mono/commit/34e7419c4a870546500e3896d2ec2890fe309f33))
* new test app ([#2694](https://github.com/edgar-stacks-fixer-bot/mono/issues/2694)) ([a39e946](https://github.com/edgar-stacks-fixer-bot/mono/commit/a39e94664c02b7986960251bda8b9991a9588e2e))
* pin sBTC and USDCx after BTC and STX in token lists ([#2858](https://github.com/edgar-stacks-fixer-bot/mono/issues/2858)) ([12d4c39](https://github.com/edgar-stacks-fixer-bot/mono/commit/12d4c398445f690c714d16e4198b8a4ec47f9566))
* policy account state ([#2430](https://github.com/edgar-stacks-fixer-bot/mono/issues/2430)) ([01e4ea0](https://github.com/edgar-stacks-fixer-bot/mono/commit/01e4ea07d67a8dbf4209912aa1c14304b770d521))
* policy accounts ([#2438](https://github.com/edgar-stacks-fixer-bot/mono/issues/2438)) ([08d3861](https://github.com/edgar-stacks-fixer-bot/mono/commit/08d3861dfd5cced3ae2cd23b547007b84a83a5b9))
* policy receive in send flow ([#2535](https://github.com/edgar-stacks-fixer-bot/mono/issues/2535)) ([087a4b0](https://github.com/edgar-stacks-fixer-bot/mono/commit/087a4b009008f4160c52ccfcaad3db01a6ce58c8))
* remove 3rd party ext upload cli ([#2307](https://github.com/edgar-stacks-fixer-bot/mono/issues/2307)) ([3409171](https://github.com/edgar-stacks-fixer-bot/mono/commit/3409171ca9824932ce7555659443e75300b078b9))
* **repo:** add fix-issue skill + workflow to fix issues with review rounds and screenshots ([6da6f0f](https://github.com/edgar-stacks-fixer-bot/mono/commit/6da6f0f9d95434b51d37de038aa311a7340c6ec2))
* **services:** replace chainalysis with leather api compliance endpoint ([#2606](https://github.com/edgar-stacks-fixer-bot/mono/issues/2606)) ([ac3a931](https://github.com/edgar-stacks-fixer-bot/mono/commit/ac3a931ed2dec18d52dd3832450fb59f4dc5282d))
* spending sources foundation + btc send flow ([#2820](https://github.com/edgar-stacks-fixer-bot/mono/issues/2820)) ([181c4f7](https://github.com/edgar-stacks-fixer-bot/mono/commit/181c4f71366f1cb4a744ae04d261f1fa63d75f30))
* token price history graph ([#2764](https://github.com/edgar-stacks-fixer-bot/mono/issues/2764)) ([b7c56bc](https://github.com/edgar-stacks-fixer-bot/mono/commit/b7c56bc7eb49b3a38ea7f40c6332e6c5ce390f93))
* **tokens:** add ink.text-secondary and use it for decision-critical copy ([#2853](https://github.com/edgar-stacks-fixer-bot/mono/issues/2853)) ([9b5ff8f](https://github.com/edgar-stacks-fixer-bot/mono/commit/9b5ff8fafad7c678cca5d7e25ef15115ea186fac))
* **tools:** add the extension feature map with generator, rot check and skill ([#2907](https://github.com/edgar-stacks-fixer-bot/mono/issues/2907)) ([be5696e](https://github.com/edgar-stacks-fixer-bot/mono/commit/be5696ec09e73b0c70bfa34d53334bd9a208d78a))
* tx proposal in extension via rpc requests ([#2472](https://github.com/edgar-stacks-fixer-bot/mono/issues/2472)) ([ef5f7d2](https://github.com/edgar-stacks-fixer-bot/mono/commit/ef5f7d202e1d78862d350443fe622732db25961e))
* update sendTransfer params ([#2634](https://github.com/edgar-stacks-fixer-bot/mono/issues/2634)) ([344da46](https://github.com/edgar-stacks-fixer-bot/mono/commit/344da46f4608c9e431522e99e5326af916deb499))
* web staging custom domain ([#2817](https://github.com/edgar-stacks-fixer-bot/mono/issues/2817)) ([75f6225](https://github.com/edgar-stacks-fixer-bot/mono/commit/75f6225ef5761febb89de502425b1ceaa8dff71e))
* **web:** support custom private regtest network for multisig internal testing ([#2476](https://github.com/edgar-stacks-fixer-bot/mono/issues/2476)) ([143950b](https://github.com/edgar-stacks-fixer-bot/mono/commit/143950b3c49711ac643a3e04ae4b5bec6fa63572))


### Bug Fixes

* account lookup ([#2416](https://github.com/edgar-stacks-fixer-bot/mono/issues/2416)) ([a250a30](https://github.com/edgar-stacks-fixer-bot/mono/commit/a250a30a2be396846c9af017c3ac94eeb7a92fc6))
* account name cap ([#2534](https://github.com/edgar-stacks-fixer-bot/mono/issues/2534)) ([e52375b](https://github.com/edgar-stacks-fixer-bot/mono/commit/e52375b3cadc5522f9034a040833b9044200fe19))
* accounts display ([300c929](https://github.com/edgar-stacks-fixer-bot/mono/commit/300c929a3008efa12252caa11f402b3b2ca44f50))
* activity view drift revert ([#2645](https://github.com/edgar-stacks-fixer-bot/mono/issues/2645)) ([a4677e0](https://github.com/edgar-stacks-fixer-bot/mono/commit/a4677e08a42feedd38fb6a9cf7344dfc7f3b2af5))
* add all balances settings tab ([#2552](https://github.com/edgar-stacks-fixer-bot/mono/issues/2552)) ([1ef1c33](https://github.com/edgar-stacks-fixer-bot/mono/commit/1ef1c33ecb393f6e2d87f0829773e88e7a59fcfa))
* add ledger derivation paths ([#2592](https://github.com/edgar-stacks-fixer-bot/mono/issues/2592)) ([94806ea](https://github.com/edgar-stacks-fixer-bot/mono/commit/94806eaffddabc4a2e1d6c29fa405979e8170c95))
* add non zero index signing for descriptor mode in signPsbt ([#2382](https://github.com/edgar-stacks-fixer-bot/mono/issues/2382)) ([ad289a7](https://github.com/edgar-stacks-fixer-bot/mono/commit/ad289a7a03b0bc11042b3e335b58b8d39d2e0cf6))
* add support for tpubs ([#2381](https://github.com/edgar-stacks-fixer-bot/mono/issues/2381)) ([09d4c94](https://github.com/edgar-stacks-fixer-bot/mono/commit/09d4c944af9b0f74bb15379382d47ad45f11832f))
* audit axios ([#2362](https://github.com/edgar-stacks-fixer-bot/mono/issues/2362)) ([83e1848](https://github.com/edgar-stacks-fixer-bot/mono/commit/83e1848b6fe5f4ac3d4478090277b3bf032d055b))
* audit issues ([#2536](https://github.com/edgar-stacks-fixer-bot/mono/issues/2536)) ([812123e](https://github.com/edgar-stacks-fixer-bot/mono/commit/812123ef33b712cb3ef380e21525c8fb67cf1928))
* audit react-router ([#2369](https://github.com/edgar-stacks-fixer-bot/mono/issues/2369)) ([80a7ed8](https://github.com/edgar-stacks-fixer-bot/mono/commit/80a7ed886eb9981d85fdfda6736c37f488b37d06))
* **auth:** bind sign-in message to requesting domain ([#2690](https://github.com/edgar-stacks-fixer-bot/mono/issues/2690)) ([dfb58cb](https://github.com/edgar-stacks-fixer-bot/mono/commit/dfb58cb5e85b2a10f89d830c5e3269c458dc6564))
* axios audit ([#2815](https://github.com/edgar-stacks-fixer-bot/mono/issues/2815)) ([480ceda](https://github.com/edgar-stacks-fixer-bot/mono/commit/480ceda66cf6537701f7c3571a1fb6c08fc5f127))
* bitcoinjs-lib audit ([#2959](https://github.com/edgar-stacks-fixer-bot/mono/issues/2959)) ([47f9582](https://github.com/edgar-stacks-fixer-bot/mono/commit/47f95825a09be6f4ae695e0a2c62bf3268febb30))
* bitflow mocks ([#2355](https://github.com/edgar-stacks-fixer-bot/mono/issues/2355)) ([be896b5](https://github.com/edgar-stacks-fixer-bot/mono/commit/be896b53cc9e27b777a1b8469b4b966beae175a2))
* body-parser and undici audit ([#2912](https://github.com/edgar-stacks-fixer-bot/mono/issues/2912)) ([2bee4e7](https://github.com/edgar-stacks-fixer-bot/mono/commit/2bee4e772dd95fff8406822a62225854fb708fbd))
* bring back ordinal banners and make those dismissable ([#2615](https://github.com/edgar-stacks-fixer-bot/mono/issues/2615)) ([c085334](https://github.com/edgar-stacks-fixer-bot/mono/commit/c08533430f9b6bfd7c18f8e03b4151e2ec13cd91))
* btc account selection in signPsbt flow ([#2384](https://github.com/edgar-stacks-fixer-bot/mono/issues/2384)) ([0acc820](https://github.com/edgar-stacks-fixer-bot/mono/commit/0acc820215ad906b1695d56deb5eafca50dd12b7))
* bump ledger stacks app minimum version ([#2720](https://github.com/edgar-stacks-fixer-bot/mono/issues/2720)) ([300ea15](https://github.com/edgar-stacks-fixer-bot/mono/commit/300ea1523f9c6be02d08debc74dc47f375f507ea))
* clarity 6 contract deployment ([#2545](https://github.com/edgar-stacks-fixer-bot/mono/issues/2545)) ([2c04085](https://github.com/edgar-stacks-fixer-bot/mono/commit/2c0408553bdad021dad7430beb81d22cf565c95d))
* dep audit ([f0f69d3](https://github.com/edgar-stacks-fixer-bot/mono/commit/f0f69d3b726fc8637ba9b7b69b7bcbf3bb78d244))
* dep audit ([#2551](https://github.com/edgar-stacks-fixer-bot/mono/issues/2551)) ([3486f42](https://github.com/edgar-stacks-fixer-bot/mono/commit/3486f42a6a671dd60888a24305446fb92eaa3fdf))
* developer notice on legacy requests ([6414b17](https://github.com/edgar-stacks-fixer-bot/mono/commit/6414b1749b6a62789bb62314fb772defbcee7705))
* enforce runtime circular dependency detection ([#2852](https://github.com/edgar-stacks-fixer-bot/mono/issues/2852)) ([857e0f7](https://github.com/edgar-stacks-fixer-bot/mono/commit/857e0f79d75025cc0da9f31a78c875fa64ed5eba))
* extension rpc memo ([#2491](https://github.com/edgar-stacks-fixer-bot/mono/issues/2491)) ([adc473e](https://github.com/edgar-stacks-fixer-bot/mono/commit/adc473eaa7daa0e44bf93fcb1ef11dc8a90ea006))
* **extension:** account picker, header & logo visual polish (LEA-3591, LEA-3589, LEA-3594) ([#2411](https://github.com/edgar-stacks-fixer-bot/mono/issues/2411)) ([9a54be2](https://github.com/edgar-stacks-fixer-bot/mono/commit/9a54be237891d601dc7110e106589c2c51f5d502))
* **extension:** add border radius to collectibles hover state ([480f77d](https://github.com/edgar-stacks-fixer-bot/mono/commit/480f77db908c0c6ffa84b2aeb7edff76fee7c12c))
* **extension:** adds fade in mask to trending tokens ([254c693](https://github.com/edgar-stacks-fixer-bot/mono/commit/254c693739483d5cd974f69b67cd8945e9e98185))
* **extension:** align swap popup gutters, headings and dividers ([#2856](https://github.com/edgar-stacks-fixer-bot/mono/issues/2856)) ([1a0fd0e](https://github.com/edgar-stacks-fixer-bot/mono/commit/1a0fd0ea75ef8dac05126321a92e071a1d25e149))
* **extension:** block psbt signing with disallowed sighash types ([#2667](https://github.com/edgar-stacks-fixer-bot/mono/issues/2667)) ([9b4d0f4](https://github.com/edgar-stacks-fixer-bot/mono/commit/9b4d0f46d6e77cbbda5da1b519ae853514fd1c30))
* **extension:** classify psbt inputs by script type when building signing config ([#2680](https://github.com/edgar-stacks-fixer-bot/mono/issues/2680)) ([263e3c2](https://github.com/edgar-stacks-fixer-bot/mono/commit/263e3c28d3975ee0e0fb2ec8607421a75c81230b))
* **extension:** clear the lint baseline ([#2860](https://github.com/edgar-stacks-fixer-bot/mono/issues/2860)) ([9e61b58](https://github.com/edgar-stacks-fixer-bot/mono/commit/9e61b58ad9dc2f068b650fe759fa6b4f87f1b4e7))
* **extension:** correct disabled swap button outline and add explanatory tooltip ([#2429](https://github.com/edgar-stacks-fixer-bot/mono/issues/2429)) ([0b2bf4f](https://github.com/edgar-stacks-fixer-bot/mono/commit/0b2bf4ff2ebe55d33fb6d9acfc5168a16986c6ec))
* **extension:** correct nfts typo in receive caption ([#2941](https://github.com/edgar-stacks-fixer-bot/mono/issues/2941)) ([d15b9ae](https://github.com/edgar-stacks-fixer-bot/mono/commit/d15b9aee3278af9cab5318bc713b3cfb35211a64))
* **extension:** cross-origin iframe callout ([#2647](https://github.com/edgar-stacks-fixer-bot/mono/issues/2647)) ([aedf524](https://github.com/edgar-stacks-fixer-bot/mono/commit/aedf5248eb67d2c24acd106f9439cf8fd7e364f3))
* **extension:** fingerprint not passed to window ([fc62262](https://github.com/edgar-stacks-fixer-bot/mono/commit/fc6226292aea1d7d42856db0523fd2c4add435f4))
* **extension:** fix collectibles hover state overflow ([6d055bf](https://github.com/edgar-stacks-fixer-bot/mono/commit/6d055bf29ef818beb34d18c42701cd340f56d035))
* **extension:** hash structured message bytes for ledger display ([#2949](https://github.com/edgar-stacks-fixer-bot/mono/issues/2949)) ([34cb2d8](https://github.com/edgar-stacks-fixer-bot/mono/commit/34cb2d886d442ccde2150a6bd126544f90eedce1))
* **extension:** import ledger lottie json as default export ([#2810](https://github.com/edgar-stacks-fixer-bot/mono/issues/2810)) ([ff279c2](https://github.com/edgar-stacks-fixer-bot/mono/commit/ff279c26a1f3f5d98662a6aeea9c867a8749651c))
* **extension:** insufficient funds ([5508cf9](https://github.com/edgar-stacks-fixer-bot/mono/commit/5508cf99a7347b5d9e982d86001da29ff6f488c1))
* **extension:** keep update notice readable and add toast countdown ring ([#2861](https://github.com/edgar-stacks-fixer-bot/mono/issues/2861)) ([aa8c75a](https://github.com/edgar-stacks-fixer-bot/mono/commit/aa8c75a6fa6a0b87a720b3fbb0ed596af0aeef56))
* **extension:** label Bitcoin API dropdown as Custom when values diverge from a preset ([#2428](https://github.com/edgar-stacks-fixer-bot/mono/issues/2428)) ([b5d5f5e](https://github.com/edgar-stacks-fixer-bot/mono/commit/b5d5f5eb733b5e9e5b636f4d52759498a5b07cb7))
* **extension:** ledger chains connection ([be79b57](https://github.com/edgar-stacks-fixer-bot/mono/commit/be79b57a4e5d540ac139c4f2de08aa75767e6513))
* **extension:** ledger contract call should display contract's address ([481900a](https://github.com/edgar-stacks-fixer-bot/mono/commit/481900a1fe3fa474bd380f2e44da6fc73c4a21d7))
* **extension:** ledger testnet address verification ([#2649](https://github.com/edgar-stacks-fixer-bot/mono/issues/2649)) ([f16cc57](https://github.com/edgar-stacks-fixer-bot/mono/commit/f16cc5757b7300c58f6ee2c05e56644e5d737a00))
* **extension:** maintain focus on amount field after set to max ([1ca5801](https://github.com/edgar-stacks-fixer-bot/mono/commit/1ca5801d51b234166740b72fa79413a6690adf52))
* **extension:** make deposits pressable ([831a1f3](https://github.com/edgar-stacks-fixer-bot/mono/commit/831a1f3c2603ad9422d9bbe9008d72599ce24fa6))
* **extension:** new account becomes active account ([5a4e830](https://github.com/edgar-stacks-fixer-bot/mono/commit/5a4e8305b21447c872dbb19c27df5a7695e190a9))
* **extension:** only auto-focus on amount field when base asset is selected ([045c509](https://github.com/edgar-stacks-fixer-bot/mono/commit/045c509344c83a2b2908a479035947cd661d9cb4))
* **extension:** open send form directly from token details ([#2781](https://github.com/edgar-stacks-fixer-bot/mono/issues/2781)) ([ff99d19](https://github.com/edgar-stacks-fixer-bot/mono/commit/ff99d19ce1cdb087f3a4e4e7c43361aff98b2399))
* **extension:** propose transaction to staging ([#2507](https://github.com/edgar-stacks-fixer-bot/mono/issues/2507)) ([b0677ae](https://github.com/edgar-stacks-fixer-bot/mono/commit/b0677ae1cee2e097f24f2bcb087426f8168068ec))
* **extension:** redux store sync between tabs ([#2503](https://github.com/edgar-stacks-fixer-bot/mono/issues/2503)) ([b11f6ed](https://github.com/edgar-stacks-fixer-bot/mono/commit/b11f6ed03fdd61f07a61ba14edaf83361536c74b))
* **extension:** refine collectibles tab typography and spacing ([509e784](https://github.com/edgar-stacks-fixer-bot/mono/commit/509e78416099d4e90f47bb89eacd4abc474ee84a))
* **extension:** refine first token banner typography and spacing ([9cb2b01](https://github.com/edgar-stacks-fixer-bot/mono/commit/9cb2b01977e4f98bf9230989dd23ed6f08d833f1))
* **extension:** refine token list typography, spacing, and hover radius ([05871e1](https://github.com/edgar-stacks-fixer-bot/mono/commit/05871e1686e292760caba72286afd8ecf24781bd))
* **extension:** remove inscriptions buttons ([c458604](https://github.com/edgar-stacks-fixer-bot/mono/commit/c458604d1e82e665b0be859e2705f5a79318c89d))
* **extension:** remove redundant WebkitMaskImage and fix prettier formatting ([785da18](https://github.com/edgar-stacks-fixer-bot/mono/commit/785da187a4110aac3b66dd69593ac1df5f52d636))
* **extension:** render sip10 avatars in rpc approver post conditions ([#2706](https://github.com/edgar-stacks-fixer-bot/mono/issues/2706)) ([b3e5f61](https://github.com/edgar-stacks-fixer-bot/mono/commit/b3e5f61c5af226d2aa14b75e6ff5274d5cd32b3d))
* **extension:** set correct app permissions for policy accounts ([#2501](https://github.com/edgar-stacks-fixer-bot/mono/issues/2501)) ([ba23dcc](https://github.com/edgar-stacks-fixer-bot/mono/commit/ba23dcc957e2717746580e2e3934f44a236d9b7c))
* **extension:** skip sunset callout for fixed-address accounts ([#2809](https://github.com/edgar-stacks-fixer-bot/mono/issues/2809)) ([68f29a8](https://github.com/edgar-stacks-fixer-bot/mono/commit/68f29a83dddd5aea241a195073d708def985c4bd))
* **extension:** swap locked balance units in STX asset row ([829a132](https://github.com/edgar-stacks-fixer-bot/mono/commit/829a13231c51be705c5e96528d363b7fbe6491dd))
* **extension:** tidy up the multi-wallet account row in approval views ([#2433](https://github.com/edgar-stacks-fixer-bot/mono/issues/2433)) ([8ff20d9](https://github.com/edgar-stacks-fixer-bot/mono/commit/8ff20d9fe5e34dff42e149926b823b91e54626a3))
* **extension:** trending tokens click ([2a07dcc](https://github.com/edgar-stacks-fixer-bot/mono/commit/2a07dcc97c6069c3733b42376556bef361047197))
* **extension:** update collectible design ([30076c3](https://github.com/edgar-stacks-fixer-bot/mono/commit/30076c3616a7feb0cf3998bfc793d24093c4c518))
* **extension:** update collectible design ([be468f1](https://github.com/edgar-stacks-fixer-bot/mono/commit/be468f184f4af48458b35236954026f48e5166c7))
* **extension:** update collectible design ([7902c68](https://github.com/edgar-stacks-fixer-bot/mono/commit/7902c68a97f6883c17b83f0935d125fa227ee78d))
* **extension:** update e2e test for swapped BNS learn link ([ec9be16](https://github.com/edgar-stacks-fixer-bot/mono/commit/ec9be1647891fcd3c0a520a32a02e51665bad80c))
* **extension:** update multi-wallet announcement visual ([#2423](https://github.com/edgar-stacks-fixer-bot/mono/issues/2423)) ([503a28c](https://github.com/edgar-stacks-fixer-bot/mono/commit/503a28caea9d9ad672af396f07e6a31fc790c052))
* **extension:** update trending tokens heading to label.01 ([a852bc1](https://github.com/edgar-stacks-fixer-bot/mono/commit/a852bc17d0a4dd122b65255772aec7ae77a4ede2))
* faster integration tests ([#2892](https://github.com/edgar-stacks-fixer-bot/mono/issues/2892)) ([c7f0371](https://github.com/edgar-stacks-fixer-bot/mono/commit/c7f03715845889e62bcd52d88caa792400915ed1))
* implement frameId for rpc requests ([#2487](https://github.com/edgar-stacks-fixer-bot/mono/issues/2487)) ([2fd3af3](https://github.com/edgar-stacks-fixer-bot/mono/commit/2fd3af36586f94b23a3aa0a4bb45a467d464b953))
* implement wsh signing in signPsbt ([#2374](https://github.com/edgar-stacks-fixer-bot/mono/issues/2374)) ([82f6216](https://github.com/edgar-stacks-fixer-bot/mono/commit/82f621646a4ff619e31090be9eb24ec148866349))
* ledger btc keychain filtration ([61b40b9](https://github.com/edgar-stacks-fixer-bot/mono/commit/61b40b95fd6e7e7b9a1118185f48a9b6f363c054))
* ledger popup pairing ([#2822](https://github.com/edgar-stacks-fixer-bot/mono/issues/2822)) ([b59d93a](https://github.com/edgar-stacks-fixer-bot/mono/commit/b59d93a4e93887cd6101f8a3da092466735941e2))
* legacy requests callout / analytics ([236e016](https://github.com/edgar-stacks-fixer-bot/mono/commit/236e01633d5b26871f2d89eeb61ede098d646240))
* localhost tx proposal ([#2644](https://github.com/edgar-stacks-fixer-bot/mono/issues/2644)) ([1340cdc](https://github.com/edgar-stacks-fixer-bot/mono/commit/1340cdcd3c7eff4ba00746b41a9322a15b1d5461))
* networks bug ([#2379](https://github.com/edgar-stacks-fixer-bot/mono/issues/2379)) ([01d0c87](https://github.com/edgar-stacks-fixer-bot/mono/commit/01d0c87860b18ff5952cac03a12f42f8f9b9165a))
* no keychain warning ([#2537](https://github.com/edgar-stacks-fixer-bot/mono/issues/2537)) ([17549ee](https://github.com/edgar-stacks-fixer-bot/mono/commit/17549ee7b2b8b141bbd66b576495ae5ef33f0da0))
* openswap-param-injection ([#2616](https://github.com/edgar-stacks-fixer-bot/mono/issues/2616)) ([ab3de86](https://github.com/edgar-stacks-fixer-bot/mono/commit/ab3de867c583bc315cbf90cdb6fc3c35eec56a61))
* ordinals/runes fallback ([35d1bea](https://github.com/edgar-stacks-fixer-bot/mono/commit/35d1bea0e3cde0e9ad1e6c77d33793ef48260e3b))
* origin-principal-post-condition ([#2617](https://github.com/edgar-stacks-fixer-bot/mono/issues/2617)) ([c339004](https://github.com/edgar-stacks-fixer-bot/mono/commit/c339004db150a797ae4411ac3d4c85d17c303e95))
* postcss audit ([#2546](https://github.com/edgar-stacks-fixer-bot/mono/issues/2546)) ([2f27e90](https://github.com/edgar-stacks-fixer-bot/mono/commit/2f27e90175e73bc6933316e024c9604c8c5a6bfb))
* propogate BE error details to multisig app ([#2609](https://github.com/edgar-stacks-fixer-bot/mono/issues/2609)) ([e902bdb](https://github.com/edgar-stacks-fixer-bot/mono/commit/e902bdb0c9b692d570c696f67a1e3d78dc63e077))
* psbt-taproot-transfer-total ([#2613](https://github.com/edgar-stacks-fixer-bot/mono/issues/2613)) ([1902614](https://github.com/edgar-stacks-fixer-bot/mono/commit/1902614ae8315939cbf5fff68af28e781867df36))
* refactor ledger flow dialog ([#2772](https://github.com/edgar-stacks-fixer-bot/mono/issues/2772)) ([03eb4b9](https://github.com/edgar-stacks-fixer-bot/mono/commit/03eb4b9bec1d94fa8b718154129eaaeb0e700f26))
* remove runes/ordinals pages from queries ([#2352](https://github.com/edgar-stacks-fixer-bot/mono/issues/2352)) ([22578a1](https://github.com/edgar-stacks-fixer-bot/mono/commit/22578a14ef855040b549e8ec2d39c5f23de3806b))
* remove runes/ordinals pages from services/models ([#2358](https://github.com/edgar-stacks-fixer-bot/mono/issues/2358)) ([101bf28](https://github.com/edgar-stacks-fixer-bot/mono/commit/101bf2808285991f40d93e6eaad00f32c4435675))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* route bitflow readonly calls through hiro ([#2683](https://github.com/edgar-stacks-fixer-bot/mono/issues/2683)) ([9659a2f](https://github.com/edgar-stacks-fixer-bot/mono/commit/9659a2f1469e7e6d27428959e2d84264a23d7372))
* rpc-method-type-confusion ([#2618](https://github.com/edgar-stacks-fixer-bot/mono/issues/2618)) ([b885858](https://github.com/edgar-stacks-fixer-bot/mono/commit/b8858585a25b2e86509c5cf95d4178188f7b0b8a))
* signTransaction fee-nonce bug ([#2420](https://github.com/edgar-stacks-fixer-bot/mono/issues/2420)) ([61028c4](https://github.com/edgar-stacks-fixer-bot/mono/commit/61028c406c3ee6c7b02df36444a430920a61b4ff))
* staking testnet network ([#2801](https://github.com/edgar-stacks-fixer-bot/mono/issues/2801)) ([20fe188](https://github.com/edgar-stacks-fixer-bot/mono/commit/20fe1889a867e9ecffb7c20ef7b5a2364e53b43b))
* swaps ui improvements ([#2758](https://github.com/edgar-stacks-fixer-bot/mono/issues/2758)) ([be4e2cf](https://github.com/edgar-stacks-fixer-bot/mono/commit/be4e2cfa261d803c24eb504f675713f5e2235673))
* token details activity loading ([#2782](https://github.com/edgar-stacks-fixer-bot/mono/issues/2782)) ([a505cac](https://github.com/edgar-stacks-fixer-bot/mono/commit/a505cac16639b0e15437f46d14f0093784045dab))
* **ui:** repair default callout contrast and link underline and focus states ([#2800](https://github.com/edgar-stacks-fixer-bot/mono/issues/2800)) ([32d87f8](https://github.com/edgar-stacks-fixer-bot/mono/commit/32d87f8973cb71e06ebe7fc55c7a47fa94a6557f))
* **ui:** truncate long titles in item layout with ellipsis ([#2360](https://github.com/edgar-stacks-fixer-bot/mono/issues/2360)) ([58cf921](https://github.com/edgar-stacks-fixer-bot/mono/commit/58cf92115f5ccffa6c0bfd847ec85026e85d5880))
* update ledger dependencies ([#2661](https://github.com/edgar-stacks-fixer-bot/mono/issues/2661)) ([7ef2061](https://github.com/edgar-stacks-fixer-bot/mono/commit/7ef20613d3a4858da6f6102bb586bbb370201e4b))
* update Ledger derivation path copy per review feedback ([#2600](https://github.com/edgar-stacks-fixer-bot/mono/issues/2600)) ([6de04e8](https://github.com/edgar-stacks-fixer-bot/mono/commit/6de04e800bd4f5f354a76bd9416a41e2ca7ccdd6))
* update supportedMethods docs urls and add stx methods ([#2795](https://github.com/edgar-stacks-fixer-bot/mono/issues/2795)) ([ae34f69](https://github.com/edgar-stacks-fixer-bot/mono/commit/ae34f694fe0d373fcf96fc0e9c157e5ff93a9417))
* upgrade axios ([#2313](https://github.com/edgar-stacks-fixer-bot/mono/issues/2313)) ([9876bb2](https://github.com/edgar-stacks-fixer-bot/mono/commit/9876bb2a6cc764494fbcf9d57449ce5ccc821ab3))
* use shared state in stx rpc flow ([#2488](https://github.com/edgar-stacks-fixer-bot/mono/issues/2488)) ([9c78a2d](https://github.com/edgar-stacks-fixer-bot/mono/commit/9c78a2de5384ac0091441c68d9ab3c398c9f3724))
* **web:** private network resolution, regtest explorer links, activity polling ([#2663](https://github.com/edgar-stacks-fixer-bot/mono/issues/2663)) ([243071c](https://github.com/edgar-stacks-fixer-bot/mono/commit/243071c811e4966f52cef00f67c0a5cba21ec3ad))
* **web:** unblock footer links under the connect overlay and retire Advanced Earn ([#2731](https://github.com/edgar-stacks-fixer-bot/mono/issues/2731)) ([7c4ac69](https://github.com/edgar-stacks-fixer-bot/mono/commit/7c4ac6979a7f9f656bc7caf709fd61c521f504b8))
* whitelist dev leather url ([#2505](https://github.com/edgar-stacks-fixer-bot/mono/issues/2505)) ([c0e1c49](https://github.com/edgar-stacks-fixer-bot/mono/commit/c0e1c49241290fe7b8979916957a1c68506cc169))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/analytics bumped to 3.27.0
    * @leather.io/bitcoin bumped to 0.43.0
    * @leather.io/cms bumped to 1.7.0
    * @leather.io/constants bumped to 0.42.0
    * @leather.io/crypto bumped to 1.14.0
    * @leather.io/features bumped to 1.9.0
    * @leather.io/models bumped to 0.64.0
    * @leather.io/provider bumped to 1.8.0
    * @leather.io/queries bumped to 0.18.0
    * @leather.io/rpc bumped to 2.26.0
    * @leather.io/services bumped to 1.67.0
    * @leather.io/stacks bumped to 1.23.0
    * @leather.io/tokens bumped to 0.29.0
    * @leather.io/ui bumped to 1.120.0
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/panda-preset bumped to 0.16.7
    * @leather.io/prettier-config bumped to 0.9.2
</details>

<details><summary>@leather.io/features: 1.9.0</summary>

## [1.9.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/features-v1.8.6...@leather.io/features-v1.9.0) (2026-11-13)


### Features

* add new activity list ([#2555](https://github.com/edgar-stacks-fixer-bot/mono/issues/2555)) ([7d5f88a](https://github.com/edgar-stacks-fixer-bot/mono/commit/7d5f88a8f5af565d381c231a401842462263c322))
* blockchain activity paging and view mapping ([#2473](https://github.com/edgar-stacks-fixer-bot/mono/issues/2473)) ([a279b9e](https://github.com/edgar-stacks-fixer-bot/mono/commit/a279b9eaaee43587bc7894b5b7288a748758c15c))
* distinguish multisig cancelled activity items ([#2660](https://github.com/edgar-stacks-fixer-bot/mono/issues/2660)) ([4dc3931](https://github.com/edgar-stacks-fixer-bot/mono/commit/4dc3931374c6529b833d7e98e231e23e0bd78b23))
* **extension:** add collectible details pages and manage inscriptions ([26fc7a9](https://github.com/edgar-stacks-fixer-bot/mono/commit/26fc7a925ec71720735abd9dc9e105472301c777))
* multisig activity ([#2482](https://github.com/edgar-stacks-fixer-bot/mono/issues/2482)) ([864d9a6](https://github.com/edgar-stacks-fixer-bot/mono/commit/864d9a6774a758396c97bb6bca2923d0fef45960))
* **web:** playground design surface + multisig content refinements ([#2527](https://github.com/edgar-stacks-fixer-bot/mono/issues/2527)) ([#2532](https://github.com/edgar-stacks-fixer-bot/mono/issues/2532)) ([6580b89](https://github.com/edgar-stacks-fixer-bot/mono/commit/6580b892a307bca0f66db2b159ea656d3998af19))


### Bug Fixes

* activity view drift revert ([#2645](https://github.com/edgar-stacks-fixer-bot/mono/issues/2645)) ([a4677e0](https://github.com/edgar-stacks-fixer-bot/mono/commit/a4677e08a42feedd38fb6a9cf7344dfc7f3b2af5))
* remove runes/ordinals from ui packages ([#2353](https://github.com/edgar-stacks-fixer-bot/mono/issues/2353)) ([709dbb5](https://github.com/edgar-stacks-fixer-bot/mono/commit/709dbb53a38f221b2befc73191e44c952bee4c49))
* remove runes/ordinals pages from services/models ([#2358](https://github.com/edgar-stacks-fixer-bot/mono/issues/2358)) ([101bf28](https://github.com/edgar-stacks-fixer-bot/mono/commit/101bf2808285991f40d93e6eaad00f32c4435675))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* staking testnet network ([#2801](https://github.com/edgar-stacks-fixer-bot/mono/issues/2801)) ([20fe188](https://github.com/edgar-stacks-fixer-bot/mono/commit/20fe1889a867e9ecffb7c20ef7b5a2364e53b43b))
* **web:** private network resolution, regtest explorer links, activity polling ([#2663](https://github.com/edgar-stacks-fixer-bot/mono/issues/2663)) ([243071c](https://github.com/edgar-stacks-fixer-bot/mono/commit/243071c811e4966f52cef00f67c0a5cba21ec3ad))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/constants bumped to 0.42.0
    * @leather.io/models bumped to 0.64.0
    * @leather.io/services bumped to 1.67.0
    * @leather.io/stacks bumped to 1.23.0
    * @leather.io/tokens bumped to 0.29.0
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/mobile: 2.117.0</summary>

## [2.117.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/mobile-v2.116.0...@leather.io/mobile-v2.117.0) (2026-11-13)


### Features

* add new postconditions ([#2422](https://github.com/edgar-stacks-fixer-bot/mono/issues/2422)) ([2416d06](https://github.com/edgar-stacks-fixer-bot/mono/commit/2416d0668a194e0de7ede0c724238b92cb361e81))
* **cms:** add fully CMS-driven learn sections ([dc0ed7a](https://github.com/edgar-stacks-fixer-bot/mono/commit/dc0ed7a350d2f4be1f88c9e117531eea00257110))
* **extension:** add wallet fingerprint to getAddresses ([#2499](https://github.com/edgar-stacks-fixer-bot/mono/issues/2499)) ([8e13787](https://github.com/edgar-stacks-fixer-bot/mono/commit/8e13787b37de92b334ea98dbb371ac03c622848f))
* **extension:** first token ([a945df1](https://github.com/edgar-stacks-fixer-bot/mono/commit/a945df1e5bef1f884d3a1c670f7f5485376d6d2b))
* **extension:** new swaps flow with sBTC bridging ([#2554](https://github.com/edgar-stacks-fixer-bot/mono/issues/2554)) ([65c8518](https://github.com/edgar-stacks-fixer-bot/mono/commit/65c85186c847b2e99fd062d00997c81932268bc5))
* **extension:** support originator post-condition mode ([#2324](https://github.com/edgar-stacks-fixer-bot/mono/issues/2324)) ([6e7d3e1](https://github.com/edgar-stacks-fixer-bot/mono/commit/6e7d3e11b5d18a576c72fe4886f5ead6376d9d16))
* migrate compliance check call to new service ([#2484](https://github.com/edgar-stacks-fixer-bot/mono/issues/2484)) ([b410f39](https://github.com/edgar-stacks-fixer-bot/mono/commit/b410f39a9f3e490dd35bded04d73bdf8f4bb3533))
* migrate off eas ([#2306](https://github.com/edgar-stacks-fixer-bot/mono/issues/2306)) ([66751ab](https://github.com/edgar-stacks-fixer-bot/mono/commit/66751ab5bea4504021927313185d67848516897a))
* **mobile:** bring token management on par with the extension ([#2826](https://github.com/edgar-stacks-fixer-bot/mono/issues/2826)) ([3d7cffc](https://github.com/edgar-stacks-fixer-bot/mono/commit/3d7cffce70e4f3f2489e758ae9192a9d1c9de11c))
* **mobile:** ordinals feature flag ([#2320](https://github.com/edgar-stacks-fixer-bot/mono/issues/2320)) ([0dc1bc3](https://github.com/edgar-stacks-fixer-bot/mono/commit/0dc1bc3d970ae1db80624585f5a4c58a9b0aff5d))
* **mobile:** remove runes/ordinals ([#2347](https://github.com/edgar-stacks-fixer-bot/mono/issues/2347)) ([1f8437b](https://github.com/edgar-stacks-fixer-bot/mono/commit/1f8437b44f2bb26f047c5fc0a679d92ee7ebebb8))
* **mobile:** token presets and a hidden tokens pill under the list ([#2859](https://github.com/edgar-stacks-fixer-bot/mono/issues/2859)) ([9e71d62](https://github.com/edgar-stacks-fixer-bot/mono/commit/9e71d6218aca02385ab98330c9ff90c8e85bd2fe))
* multisig fixed address account ([#2415](https://github.com/edgar-stacks-fixer-bot/mono/issues/2415)) ([964ff42](https://github.com/edgar-stacks-fixer-bot/mono/commit/964ff421f0b83ca688859f9bae7d2863adc9c183))
* pin sBTC and USDCx after BTC and STX in token lists ([#2858](https://github.com/edgar-stacks-fixer-bot/mono/issues/2858)) ([12d4c39](https://github.com/edgar-stacks-fixer-bot/mono/commit/12d4c398445f690c714d16e4198b8a4ec47f9566))
* policy accounts ([#2438](https://github.com/edgar-stacks-fixer-bot/mono/issues/2438)) ([08d3861](https://github.com/edgar-stacks-fixer-bot/mono/commit/08d3861dfd5cced3ae2cd23b547007b84a83a5b9))
* **services:** replace chainalysis with leather api compliance endpoint ([#2606](https://github.com/edgar-stacks-fixer-bot/mono/issues/2606)) ([ac3a931](https://github.com/edgar-stacks-fixer-bot/mono/commit/ac3a931ed2dec18d52dd3832450fb59f4dc5282d))
* **tokens:** add ink.text-secondary and use it for decision-critical copy ([#2853](https://github.com/edgar-stacks-fixer-bot/mono/issues/2853)) ([9b5ff8f](https://github.com/edgar-stacks-fixer-bot/mono/commit/9b5ff8fafad7c678cca5d7e25ef15115ea186fac))
* update sendTransfer params ([#2634](https://github.com/edgar-stacks-fixer-bot/mono/issues/2634)) ([344da46](https://github.com/edgar-stacks-fixer-bot/mono/commit/344da46f4608c9e431522e99e5326af916deb499))
* **web:** Leather Multisig UI (initial import, behind multisigEnabled flag) ([#2365](https://github.com/edgar-stacks-fixer-bot/mono/issues/2365)) ([872827d](https://github.com/edgar-stacks-fixer-bot/mono/commit/872827d28f3f848595958f197df22df6b580dd81))


### Bug Fixes

* android version code ([#2309](https://github.com/edgar-stacks-fixer-bot/mono/issues/2309)) ([283432b](https://github.com/edgar-stacks-fixer-bot/mono/commit/283432bba7b74295c180e6a852909f930b4ed4e6))
* audit axios ([#2362](https://github.com/edgar-stacks-fixer-bot/mono/issues/2362)) ([83e1848](https://github.com/edgar-stacks-fixer-bot/mono/commit/83e1848b6fe5f4ac3d4478090277b3bf032d055b))
* audit issues ([#2536](https://github.com/edgar-stacks-fixer-bot/mono/issues/2536)) ([812123e](https://github.com/edgar-stacks-fixer-bot/mono/commit/812123ef33b712cb3ef380e21525c8fb67cf1928))
* axios audit ([#2815](https://github.com/edgar-stacks-fixer-bot/mono/issues/2815)) ([480ceda](https://github.com/edgar-stacks-fixer-bot/mono/commit/480ceda66cf6537701f7c3571a1fb6c08fc5f127))
* bitcoinjs-lib audit ([#2959](https://github.com/edgar-stacks-fixer-bot/mono/issues/2959)) ([47f9582](https://github.com/edgar-stacks-fixer-bot/mono/commit/47f95825a09be6f4ae695e0a2c62bf3268febb30))
* body-parser and undici audit ([#2912](https://github.com/edgar-stacks-fixer-bot/mono/issues/2912)) ([2bee4e7](https://github.com/edgar-stacks-fixer-bot/mono/commit/2bee4e772dd95fff8406822a62225854fb708fbd))
* dep audit ([f0f69d3](https://github.com/edgar-stacks-fixer-bot/mono/commit/f0f69d3b726fc8637ba9b7b69b7bcbf3bb78d244))
* dependency audit ([#2936](https://github.com/edgar-stacks-fixer-bot/mono/issues/2936)) ([cb2ca06](https://github.com/edgar-stacks-fixer-bot/mono/commit/cb2ca069eed6769542512e87cfd273b562acf890))
* ios team id ([#2310](https://github.com/edgar-stacks-fixer-bot/mono/issues/2310)) ([3d40cf8](https://github.com/edgar-stacks-fixer-bot/mono/commit/3d40cf8df8ec7aea38d36f348ccdcadbf3982215))
* mobile release ([#2308](https://github.com/edgar-stacks-fixer-bot/mono/issues/2308)) ([c973d9a](https://github.com/edgar-stacks-fixer-bot/mono/commit/c973d9aef60ee2eaa84710ac204e5106a52f5843))
* mobile-stale-passphrase ([#2614](https://github.com/edgar-stacks-fixer-bot/mono/issues/2614)) ([5d42c21](https://github.com/edgar-stacks-fixer-bot/mono/commit/5d42c210335038b3d99567282b2ac403d9d5fd1d))
* **mobile:** decimals on btc and stx in rpc calls ([#2480](https://github.com/edgar-stacks-fixer-bot/mono/issues/2480)) ([a63c0c3](https://github.com/edgar-stacks-fixer-bot/mono/commit/a63c0c3d3e795fef816dbe4f278319e21584f692))
* **mobile:** keep approvers usable when fee requests fail ([#2932](https://github.com/edgar-stacks-fixer-bot/mono/issues/2932)) ([1e05e52](https://github.com/edgar-stacks-fixer-bot/mono/commit/1e05e52d5cd8a8ccfad9d56b5ae86de9f7baf631))
* **mobile:** remove deep linking ([#2349](https://github.com/edgar-stacks-fixer-bot/mono/issues/2349)) ([6d8d5f5](https://github.com/edgar-stacks-fixer-bot/mono/commit/6d8d5f5b0e92323ce36ce0cf32bd8d867ad290d4))
* **mobile:** remove mobile runes/stamps ([#2288](https://github.com/edgar-stacks-fixer-bot/mono/issues/2288)) ([66a4584](https://github.com/edgar-stacks-fixer-bot/mono/commit/66a4584ca0abeb5e6413a0c225447fad144bfe8c))
* **mobile:** return sponsored contract calls to the app without error ([#2811](https://github.com/edgar-stacks-fixer-bot/mono/issues/2811)) ([0012105](https://github.com/edgar-stacks-fixer-bot/mono/commit/00121054e400c7de2302e205fbc30f14965cbce7))
* **mobile:** show ft post conditions without metadata ([#2847](https://github.com/edgar-stacks-fixer-bot/mono/issues/2847)) ([4af9c00](https://github.com/edgar-stacks-fixer-bot/mono/commit/4af9c00a217fa89c8ac9f43fdbd6f123c43f598b))
* **mobile:** signPsbt issues ([#2478](https://github.com/edgar-stacks-fixer-bot/mono/issues/2478)) ([bfdeb52](https://github.com/edgar-stacks-fixer-bot/mono/commit/bfdeb52641b522ecc537e1d853d35102b4645e0f))
* networks bug ([#2379](https://github.com/edgar-stacks-fixer-bot/mono/issues/2379)) ([01d0c87](https://github.com/edgar-stacks-fixer-bot/mono/commit/01d0c87860b18ff5952cac03a12f42f8f9b9165a))
* origin-principal-post-condition ([#2617](https://github.com/edgar-stacks-fixer-bot/mono/issues/2617)) ([c339004](https://github.com/edgar-stacks-fixer-bot/mono/commit/c339004db150a797ae4411ac3d4c85d17c303e95))
* remove runes/ordinals pages from queries ([#2352](https://github.com/edgar-stacks-fixer-bot/mono/issues/2352)) ([22578a1](https://github.com/edgar-stacks-fixer-bot/mono/commit/22578a14ef855040b549e8ec2d39c5f23de3806b))
* remove runes/ordinals pages from services/models ([#2358](https://github.com/edgar-stacks-fixer-bot/mono/issues/2358)) ([101bf28](https://github.com/edgar-stacks-fixer-bot/mono/commit/101bf2808285991f40d93e6eaad00f32c4435675))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* route bitflow readonly calls through hiro ([#2683](https://github.com/edgar-stacks-fixer-bot/mono/issues/2683)) ([9659a2f](https://github.com/edgar-stacks-fixer-bot/mono/commit/9659a2f1469e7e6d27428959e2d84264a23d7372))
* subframe rpc misattribution ([#2479](https://github.com/edgar-stacks-fixer-bot/mono/issues/2479)) ([823b58b](https://github.com/edgar-stacks-fixer-bot/mono/commit/823b58b8033580a53e3239a1e578628f70deef2d))
* update ledger dependencies ([#2661](https://github.com/edgar-stacks-fixer-bot/mono/issues/2661)) ([7ef2061](https://github.com/edgar-stacks-fixer-bot/mono/commit/7ef20613d3a4858da6f6102bb586bbb370201e4b))
* update supportedMethods docs urls and add stx methods ([#2795](https://github.com/edgar-stacks-fixer-bot/mono/issues/2795)) ([ae34f69](https://github.com/edgar-stacks-fixer-bot/mono/commit/ae34f694fe0d373fcf96fc0e9c157e5ff93a9417))
* upgrade axios ([#2313](https://github.com/edgar-stacks-fixer-bot/mono/issues/2313)) ([9876bb2](https://github.com/edgar-stacks-fixer-bot/mono/commit/9876bb2a6cc764494fbcf9d57449ce5ccc821ab3))
* **web:** unblock footer links under the connect overlay and retire Advanced Earn ([#2731](https://github.com/edgar-stacks-fixer-bot/mono/issues/2731)) ([7c4ac69](https://github.com/edgar-stacks-fixer-bot/mono/commit/7c4ac6979a7f9f656bc7caf709fd61c521f504b8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/analytics bumped to 3.27.0
    * @leather.io/bitcoin bumped to 0.43.0
    * @leather.io/cms bumped to 1.7.0
    * @leather.io/constants bumped to 0.42.0
    * @leather.io/crypto bumped to 1.14.0
    * @leather.io/features bumped to 1.9.0
    * @leather.io/models bumped to 0.64.0
    * @leather.io/provider bumped to 1.8.0
    * @leather.io/queries bumped to 0.18.0
    * @leather.io/rpc bumped to 2.26.0
    * @leather.io/services bumped to 1.67.0
    * @leather.io/stacks bumped to 1.23.0
    * @leather.io/ui bumped to 1.120.0
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
</details>

<details><summary>@leather.io/models: 0.64.0</summary>

## [0.64.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/models-v0.63.1...@leather.io/models-v0.64.0) (2026-11-13)


### Features

* add BNS testnet support ([#2733](https://github.com/edgar-stacks-fixer-bot/mono/issues/2733)) ([8f92aa3](https://github.com/edgar-stacks-fixer-bot/mono/commit/8f92aa3b6d0f87f765f7de98eeecfe24e2bd2939))
* allow custom fee for transaction proposal from multisig account ([#2773](https://github.com/edgar-stacks-fixer-bot/mono/issues/2773)) ([cc45d87](https://github.com/edgar-stacks-fixer-bot/mono/commit/cc45d8779c65c5333ba56bfe5cbf187df8b6c88a))
* auth infrastructure ([#2368](https://github.com/edgar-stacks-fixer-bot/mono/issues/2368)) ([f3d4b3e](https://github.com/edgar-stacks-fixer-bot/mono/commit/f3d4b3e91e86f0d69606c21f67985b3eed762f1f))
* blockchain activity paging and view mapping ([#2473](https://github.com/edgar-stacks-fixer-bot/mono/issues/2473)) ([a279b9e](https://github.com/edgar-stacks-fixer-bot/mono/commit/a279b9eaaee43587bc7894b5b7288a748758c15c))
* build multisig transfer transactions ([#2418](https://github.com/edgar-stacks-fixer-bot/mono/issues/2418)) ([c72b145](https://github.com/edgar-stacks-fixer-bot/mono/commit/c72b1453cffbcbaa3d972823ce173bc10cb85731))
* **extension:** fee service usage in extension ([f295794](https://github.com/edgar-stacks-fixer-bot/mono/commit/f29579434d4291805dc1010faeac863dcadaaf5f))
* **extension:** new swaps flow with sBTC bridging ([#2554](https://github.com/edgar-stacks-fixer-bot/mono/issues/2554)) ([65c8518](https://github.com/edgar-stacks-fixer-bot/mono/commit/65c85186c847b2e99fd062d00997c81932268bc5))
* multisig fixed address account ([#2415](https://github.com/edgar-stacks-fixer-bot/mono/issues/2415)) ([964ff42](https://github.com/edgar-stacks-fixer-bot/mono/commit/964ff421f0b83ca688859f9bae7d2863adc9c183))
* multisig service transactions ([#2404](https://github.com/edgar-stacks-fixer-bot/mono/issues/2404)) ([8c3a1d4](https://github.com/edgar-stacks-fixer-bot/mono/commit/8c3a1d41b09c1caf4f526ac9b567d479c1436c40))
* multisig tx signing ([#2431](https://github.com/edgar-stacks-fixer-bot/mono/issues/2431)) ([1997d3d](https://github.com/edgar-stacks-fixer-bot/mono/commit/1997d3d8bb0314ef4fd4104fb3303a600a46b0e7))
* **services:** activity v2 ([ae29c23](https://github.com/edgar-stacks-fixer-bot/mono/commit/ae29c23a6001bffc5ab81c89400e2d9768930478))
* **services:** add signedByMe field to multisig tx summary ([#2496](https://github.com/edgar-stacks-fixer-bot/mono/issues/2496)) ([1a70094](https://github.com/edgar-stacks-fixer-bot/mono/commit/1a700948a3ad74b1b8c944a39268754c2006bf75))
* **services:** bitcoin staking balances and positions service ([#2714](https://github.com/edgar-stacks-fixer-bot/mono/issues/2714)) ([695400d](https://github.com/edgar-stacks-fixer-bot/mono/commit/695400d198c48641ec00395ffe33562cafd35f66))
* **services:** multisig service accounts ([#2383](https://github.com/edgar-stacks-fixer-bot/mono/issues/2383)) ([5a0513e](https://github.com/edgar-stacks-fixer-bot/mono/commit/5a0513e1c077a5b62ed49aff04d1e946c4d1ea22))
* **services:** multisig service vaults ([#2378](https://github.com/edgar-stacks-fixer-bot/mono/issues/2378)) ([4351c6c](https://github.com/edgar-stacks-fixer-bot/mono/commit/4351c6c26b256fd4007d70020bc588bf109f7b89))
* **web:** multisig vaults UI (create, view, invites) ([#2385](https://github.com/edgar-stacks-fixer-bot/mono/issues/2385)) ([8d55381](https://github.com/edgar-stacks-fixer-bot/mono/commit/8d55381d7a0d90a2ab36f70f528b174ae79d251f))
* **web:** show nonce on multisig transaction details ([#2635](https://github.com/edgar-stacks-fixer-bot/mono/issues/2635)) ([b482b2d](https://github.com/edgar-stacks-fixer-bot/mono/commit/b482b2db89de8218130ef26a3d5893e91f6a6dd9))
* **web:** support custom private regtest network for multisig internal testing ([#2476](https://github.com/edgar-stacks-fixer-bot/mono/issues/2476)) ([143950b](https://github.com/edgar-stacks-fixer-bot/mono/commit/143950b3c49711ac643a3e04ae4b5bec6fa63572))


### Bug Fixes

* add @stacks/connect ([#2580](https://github.com/edgar-stacks-fixer-bot/mono/issues/2580)) ([625b20b](https://github.com/edgar-stacks-fixer-bot/mono/commit/625b20b6a68ee0c1bba63e892b46b837561b71e9))
* add private-1 network ([#2650](https://github.com/edgar-stacks-fixer-bot/mono/issues/2650)) ([32c5518](https://github.com/edgar-stacks-fixer-bot/mono/commit/32c5518aa8410cf03f55365c53c617171980b166))
* body-parser and undici audit ([#2912](https://github.com/edgar-stacks-fixer-bot/mono/issues/2912)) ([2bee4e7](https://github.com/edgar-stacks-fixer-bot/mono/commit/2bee4e772dd95fff8406822a62225854fb708fbd))
* enforce runtime circular dependency detection ([#2852](https://github.com/edgar-stacks-fixer-bot/mono/issues/2852)) ([857e0f7](https://github.com/edgar-stacks-fixer-bot/mono/commit/857e0f79d75025cc0da9f31a78c875fa64ed5eba))
* remove runes/ordinals pages from services/models ([#2358](https://github.com/edgar-stacks-fixer-bot/mono/issues/2358)) ([101bf28](https://github.com/edgar-stacks-fixer-bot/mono/commit/101bf2808285991f40d93e6eaad00f32c4435675))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* staking testnet network ([#2801](https://github.com/edgar-stacks-fixer-bot/mono/issues/2801)) ([20fe188](https://github.com/edgar-stacks-fixer-bot/mono/commit/20fe1889a867e9ecffb7c20ef7b5a2364e53b43b))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/panda-preset: 0.16.7</summary>

## [0.16.7](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/panda-preset-v0.16.6...@leather.io/panda-preset-v0.16.7) (2026-11-13)


### Bug Fixes

* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* **ui:** repair default callout contrast and link underline and focus states ([#2800](https://github.com/edgar-stacks-fixer-bot/mono/issues/2800)) ([32d87f8](https://github.com/edgar-stacks-fixer-bot/mono/commit/32d87f8973cb71e06ebe7fc55c7a47fa94a6557f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/tokens bumped to 0.29.0
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/prettier-config: 0.9.2</summary>

## [0.9.2](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/prettier-config-v0.9.1...@leather.io/prettier-config-v0.9.2) (2026-11-13)


### Bug Fixes

* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
</details>

<details><summary>@leather.io/provider: 1.8.0</summary>

## [1.8.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/provider-v1.7.6...@leather.io/provider-v1.8.0) (2026-11-13)


### Features

* delete legacy requests ([#2612](https://github.com/edgar-stacks-fixer-bot/mono/issues/2612)) ([c17d65f](https://github.com/edgar-stacks-fixer-bot/mono/commit/c17d65fc12fd799ff045d6fb725b57b50462fd84))


### Bug Fixes

* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/rpc bumped to 2.26.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
</details>

<details><summary>@leather.io/queries: 0.18.0</summary>

## [0.18.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/queries-v0.17.3...@leather.io/queries-v0.18.0) (2026-11-13)


### Features

* add new postconditions ([#2422](https://github.com/edgar-stacks-fixer-bot/mono/issues/2422)) ([2416d06](https://github.com/edgar-stacks-fixer-bot/mono/commit/2416d0668a194e0de7ede0c724238b92cb361e81))
* allow custom fee for transaction proposal from multisig account ([#2773](https://github.com/edgar-stacks-fixer-bot/mono/issues/2773)) ([cc45d87](https://github.com/edgar-stacks-fixer-bot/mono/commit/cc45d8779c65c5333ba56bfe5cbf187df8b6c88a))
* blockchain activity paging and view mapping ([#2473](https://github.com/edgar-stacks-fixer-bot/mono/issues/2473)) ([a279b9e](https://github.com/edgar-stacks-fixer-bot/mono/commit/a279b9eaaee43587bc7894b5b7288a748758c15c))
* **cms:** add fully CMS-driven learn sections ([dc0ed7a](https://github.com/edgar-stacks-fixer-bot/mono/commit/dc0ed7a350d2f4be1f88c9e117531eea00257110))
* extension proposal ([#2538](https://github.com/edgar-stacks-fixer-bot/mono/issues/2538)) ([933f90e](https://github.com/edgar-stacks-fixer-bot/mono/commit/933f90e4e3c79ede5107672623ba73fc9fb9dfbc))
* **extension:** fee service usage in extension ([f295794](https://github.com/edgar-stacks-fixer-bot/mono/commit/f29579434d4291805dc1010faeac863dcadaaf5f))
* **extension:** support originator post-condition mode ([#2324](https://github.com/edgar-stacks-fixer-bot/mono/issues/2324)) ([6e7d3e1](https://github.com/edgar-stacks-fixer-bot/mono/commit/6e7d3e11b5d18a576c72fe4886f5ead6376d9d16))
* migrate compliance check call to new service ([#2484](https://github.com/edgar-stacks-fixer-bot/mono/issues/2484)) ([b410f39](https://github.com/edgar-stacks-fixer-bot/mono/commit/b410f39a9f3e490dd35bded04d73bdf8f4bb3533))
* **mobile:** token presets and a hidden tokens pill under the list ([#2859](https://github.com/edgar-stacks-fixer-bot/mono/issues/2859)) ([9e71d62](https://github.com/edgar-stacks-fixer-bot/mono/commit/9e71d6218aca02385ab98330c9ff90c8e85bd2fe))
* multisig activity ([#2482](https://github.com/edgar-stacks-fixer-bot/mono/issues/2482)) ([864d9a6](https://github.com/edgar-stacks-fixer-bot/mono/commit/864d9a6774a758396c97bb6bca2923d0fef45960))
* multisig asset list and token details ([#2493](https://github.com/edgar-stacks-fixer-bot/mono/issues/2493)) ([32a441a](https://github.com/edgar-stacks-fixer-bot/mono/commit/32a441a0168023db7f113ed4f12a55f0415a4441))
* multisig fixed address account ([#2415](https://github.com/edgar-stacks-fixer-bot/mono/issues/2415)) ([964ff42](https://github.com/edgar-stacks-fixer-bot/mono/commit/964ff421f0b83ca688859f9bae7d2863adc9c183))
* multisig sip10 transfers ([#2502](https://github.com/edgar-stacks-fixer-bot/mono/issues/2502)) ([4550325](https://github.com/edgar-stacks-fixer-bot/mono/commit/455032542e11e1d13eb40b8567feddd060f528c7))
* **services:** activity v2 ([ae29c23](https://github.com/edgar-stacks-fixer-bot/mono/commit/ae29c23a6001bffc5ab81c89400e2d9768930478))
* **services:** bitcoin staking balances and positions service ([#2714](https://github.com/edgar-stacks-fixer-bot/mono/issues/2714)) ([695400d](https://github.com/edgar-stacks-fixer-bot/mono/commit/695400d198c48641ec00395ffe33562cafd35f66))
* token price history graph ([#2764](https://github.com/edgar-stacks-fixer-bot/mono/issues/2764)) ([b7c56bc](https://github.com/edgar-stacks-fixer-bot/mono/commit/b7c56bc7eb49b3a38ea7f40c6332e6c5ce390f93))
* tx proposal in extension via rpc requests ([#2472](https://github.com/edgar-stacks-fixer-bot/mono/issues/2472)) ([ef5f7d2](https://github.com/edgar-stacks-fixer-bot/mono/commit/ef5f7d202e1d78862d350443fe622732db25961e))


### Bug Fixes

* **extension:** propose transaction to staging ([#2507](https://github.com/edgar-stacks-fixer-bot/mono/issues/2507)) ([b0677ae](https://github.com/edgar-stacks-fixer-bot/mono/commit/b0677ae1cee2e097f24f2bcb087426f8168068ec))
* remove runes/ordinals pages from queries ([#2352](https://github.com/edgar-stacks-fixer-bot/mono/issues/2352)) ([22578a1](https://github.com/edgar-stacks-fixer-bot/mono/commit/22578a14ef855040b549e8ec2d39c5f23de3806b))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/cms bumped to 1.7.0
    * @leather.io/models bumped to 0.64.0
    * @leather.io/services bumped to 1.67.0
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/rpc: 2.26.0</summary>

## [2.26.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/rpc-v2.25.4...@leather.io/rpc-v2.26.0) (2026-11-13)


### Features

* add btc/stx_addAccount rpc approver flow ([#2421](https://github.com/edgar-stacks-fixer-bot/mono/issues/2421)) ([e3cd9b4](https://github.com/edgar-stacks-fixer-bot/mono/commit/e3cd9b45eab45eef54446943adfb3830522ee7ed))
* add new postconditions ([#2422](https://github.com/edgar-stacks-fixer-bot/mono/issues/2422)) ([2416d06](https://github.com/edgar-stacks-fixer-bot/mono/commit/2416d0668a194e0de7ede0c724238b92cb361e81))
* bond exit ([#2648](https://github.com/edgar-stacks-fixer-bot/mono/issues/2648)) ([289275f](https://github.com/edgar-stacks-fixer-bot/mono/commit/289275f169a4b0563d2fec662e48c9a844792bf3))
* **extension:** add wallet fingerprint to getAddresses ([#2499](https://github.com/edgar-stacks-fixer-bot/mono/issues/2499)) ([8e13787](https://github.com/edgar-stacks-fixer-bot/mono/commit/8e13787b37de92b334ea98dbb371ac03c622848f))
* **extension:** support originator post-condition mode ([#2324](https://github.com/edgar-stacks-fixer-bot/mono/issues/2324)) ([6e7d3e1](https://github.com/edgar-stacks-fixer-bot/mono/commit/6e7d3e11b5d18a576c72fe4886f5ead6376d9d16))
* policy account state ([#2430](https://github.com/edgar-stacks-fixer-bot/mono/issues/2430)) ([01e4ea0](https://github.com/edgar-stacks-fixer-bot/mono/commit/01e4ea07d67a8dbf4209912aa1c14304b770d521))
* policy accounts ([#2438](https://github.com/edgar-stacks-fixer-bot/mono/issues/2438)) ([08d3861](https://github.com/edgar-stacks-fixer-bot/mono/commit/08d3861dfd5cced3ae2cd23b547007b84a83a5b9))
* tx proposal in extension via rpc requests ([#2472](https://github.com/edgar-stacks-fixer-bot/mono/issues/2472)) ([ef5f7d2](https://github.com/edgar-stacks-fixer-bot/mono/commit/ef5f7d202e1d78862d350443fe622732db25961e))
* update sendTransfer params ([#2634](https://github.com/edgar-stacks-fixer-bot/mono/issues/2634)) ([344da46](https://github.com/edgar-stacks-fixer-bot/mono/commit/344da46f4608c9e431522e99e5326af916deb499))
* **web:** support custom private regtest network for multisig internal testing ([#2476](https://github.com/edgar-stacks-fixer-bot/mono/issues/2476)) ([143950b](https://github.com/edgar-stacks-fixer-bot/mono/commit/143950b3c49711ac643a3e04ae4b5bec6fa63572))


### Bug Fixes

* account name cap ([#2534](https://github.com/edgar-stacks-fixer-bot/mono/issues/2534)) ([e52375b](https://github.com/edgar-stacks-fixer-bot/mono/commit/e52375b3cadc5522f9034a040833b9044200fe19))
* body-parser and undici audit ([#2912](https://github.com/edgar-stacks-fixer-bot/mono/issues/2912)) ([2bee4e7](https://github.com/edgar-stacks-fixer-bot/mono/commit/2bee4e772dd95fff8406822a62225854fb708fbd))
* **extension:** block psbt signing with disallowed sighash types ([#2667](https://github.com/edgar-stacks-fixer-bot/mono/issues/2667)) ([9b4d0f4](https://github.com/edgar-stacks-fixer-bot/mono/commit/9b4d0f46d6e77cbbda5da1b519ae853514fd1c30))
* implement wsh signing in signPsbt ([#2374](https://github.com/edgar-stacks-fixer-bot/mono/issues/2374)) ([82f6216](https://github.com/edgar-stacks-fixer-bot/mono/commit/82f621646a4ff619e31090be9eb24ec148866349))
* no keychain warning ([#2537](https://github.com/edgar-stacks-fixer-bot/mono/issues/2537)) ([17549ee](https://github.com/edgar-stacks-fixer-bot/mono/commit/17549ee7b2b8b141bbd66b576495ae5ef33f0da0))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/models bumped to 0.64.0
    * @leather.io/stacks bumped to 1.23.0
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
</details>

<details><summary>@leather.io/sdk: 1.5.59</summary>

## [1.5.59](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/sdk-v1.5.58...@leather.io/sdk-v1.5.59) (2026-11-13)


### Bug Fixes

* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/models bumped to 0.64.0
    * @leather.io/rpc bumped to 2.26.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
</details>

<details><summary>@leather.io/services: 1.67.0</summary>

## [1.67.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/services-v1.66.3...@leather.io/services-v1.67.0) (2026-11-13)


### Features

* add BNS testnet support ([#2733](https://github.com/edgar-stacks-fixer-bot/mono/issues/2733)) ([8f92aa3](https://github.com/edgar-stacks-fixer-bot/mono/commit/8f92aa3b6d0f87f765f7de98eeecfe24e2bd2939))
* add fallback responses to all bis client calls ([c81750e](https://github.com/edgar-stacks-fixer-bot/mono/commit/c81750ee967704794efdae276f9bd3e31af50941))
* add leather api vault member update endpoint ([#2509](https://github.com/edgar-stacks-fixer-bot/mono/issues/2509)) ([ef65d04](https://github.com/edgar-stacks-fixer-bot/mono/commit/ef65d048ed5629c64c816e717fcd70ab4b8ee601))
* add new activity list ([#2555](https://github.com/edgar-stacks-fixer-bot/mono/issues/2555)) ([7d5f88a](https://github.com/edgar-stacks-fixer-bot/mono/commit/7d5f88a8f5af565d381c231a401842462263c322))
* add new postconditions ([#2422](https://github.com/edgar-stacks-fixer-bot/mono/issues/2422)) ([2416d06](https://github.com/edgar-stacks-fixer-bot/mono/commit/2416d0668a194e0de7ede0c724238b92cb361e81))
* allow custom fee for transaction proposal from multisig account ([#2773](https://github.com/edgar-stacks-fixer-bot/mono/issues/2773)) ([cc45d87](https://github.com/edgar-stacks-fixer-bot/mono/commit/cc45d8779c65c5333ba56bfe5cbf187df8b6c88a))
* auth infrastructure ([#2368](https://github.com/edgar-stacks-fixer-bot/mono/issues/2368)) ([f3d4b3e](https://github.com/edgar-stacks-fixer-bot/mono/commit/f3d4b3e91e86f0d69606c21f67985b3eed762f1f))
* blockchain activity paging and view mapping ([#2473](https://github.com/edgar-stacks-fixer-bot/mono/issues/2473)) ([a279b9e](https://github.com/edgar-stacks-fixer-bot/mono/commit/a279b9eaaee43587bc7894b5b7288a748758c15c))
* build multisig transfer transactions ([#2418](https://github.com/edgar-stacks-fixer-bot/mono/issues/2418)) ([c72b145](https://github.com/edgar-stacks-fixer-bot/mono/commit/c72b1453cffbcbaa3d972823ce173bc10cb85731))
* extension proposal ([#2538](https://github.com/edgar-stacks-fixer-bot/mono/issues/2538)) ([933f90e](https://github.com/edgar-stacks-fixer-bot/mono/commit/933f90e4e3c79ede5107672623ba73fc9fb9dfbc))
* **extension:** deprecation of ordinals and runes ([d6e1fea](https://github.com/edgar-stacks-fixer-bot/mono/commit/d6e1feaccb47de540983c9263cb198f279ed7679))
* **extension:** fee service usage in extension ([f295794](https://github.com/edgar-stacks-fixer-bot/mono/commit/f29579434d4291805dc1010faeac863dcadaaf5f))
* **extension:** new swaps flow with sBTC bridging ([#2554](https://github.com/edgar-stacks-fixer-bot/mono/issues/2554)) ([65c8518](https://github.com/edgar-stacks-fixer-bot/mono/commit/65c85186c847b2e99fd062d00997c81932268bc5))
* **extension:** remove runes and ordinals ([#2343](https://github.com/edgar-stacks-fixer-bot/mono/issues/2343)) ([88d12da](https://github.com/edgar-stacks-fixer-bot/mono/commit/88d12da1389dc241d24753f7f7f230a243b2444b))
* **extension:** support originator post-condition mode ([#2324](https://github.com/edgar-stacks-fixer-bot/mono/issues/2324)) ([6e7d3e1](https://github.com/edgar-stacks-fixer-bot/mono/commit/6e7d3e11b5d18a576c72fe4886f5ead6376d9d16))
* implement auth service ([c414973](https://github.com/edgar-stacks-fixer-bot/mono/commit/c4149736c63f547718d8730ff6a029273c9a7306))
* migrate compliance check call to new service ([#2484](https://github.com/edgar-stacks-fixer-bot/mono/issues/2484)) ([b410f39](https://github.com/edgar-stacks-fixer-bot/mono/commit/b410f39a9f3e490dd35bded04d73bdf8f4bb3533))
* **mobile:** token presets and a hidden tokens pill under the list ([#2859](https://github.com/edgar-stacks-fixer-bot/mono/issues/2859)) ([9e71d62](https://github.com/edgar-stacks-fixer-bot/mono/commit/9e71d6218aca02385ab98330c9ff90c8e85bd2fe))
* multisig account recovery ([#2486](https://github.com/edgar-stacks-fixer-bot/mono/issues/2486)) ([a711892](https://github.com/edgar-stacks-fixer-bot/mono/commit/a7118922a0569fd1bdad9010f6e02169b362629a))
* multisig activity ([#2482](https://github.com/edgar-stacks-fixer-bot/mono/issues/2482)) ([864d9a6](https://github.com/edgar-stacks-fixer-bot/mono/commit/864d9a6774a758396c97bb6bca2923d0fef45960))
* multisig fixed address account ([#2415](https://github.com/edgar-stacks-fixer-bot/mono/issues/2415)) ([964ff42](https://github.com/edgar-stacks-fixer-bot/mono/commit/964ff421f0b83ca688859f9bae7d2863adc9c183))
* multisig production cutover ([#2704](https://github.com/edgar-stacks-fixer-bot/mono/issues/2704)) ([8950cac](https://github.com/edgar-stacks-fixer-bot/mono/commit/8950cac2a3228a1621272f377796cdb3f0e7c264))
* multisig service transactions ([#2404](https://github.com/edgar-stacks-fixer-bot/mono/issues/2404)) ([8c3a1d4](https://github.com/edgar-stacks-fixer-bot/mono/commit/8c3a1d41b09c1caf4f526ac9b567d479c1436c40))
* multisig tx signing ([#2431](https://github.com/edgar-stacks-fixer-bot/mono/issues/2431)) ([1997d3d](https://github.com/edgar-stacks-fixer-bot/mono/commit/1997d3d8bb0314ef4fd4104fb3303a600a46b0e7))
* **services:** activity v2 ([ae29c23](https://github.com/edgar-stacks-fixer-bot/mono/commit/ae29c23a6001bffc5ab81c89400e2d9768930478))
* **services:** add signedByMe field to multisig tx summary ([#2496](https://github.com/edgar-stacks-fixer-bot/mono/issues/2496)) ([1a70094](https://github.com/edgar-stacks-fixer-bot/mono/commit/1a700948a3ad74b1b8c944a39268754c2006bf75))
* **services:** bitcoin staking balances and positions service ([#2714](https://github.com/edgar-stacks-fixer-bot/mono/issues/2714)) ([695400d](https://github.com/edgar-stacks-fixer-bot/mono/commit/695400d198c48641ec00395ffe33562cafd35f66))
* **services:** multisig service accounts ([#2383](https://github.com/edgar-stacks-fixer-bot/mono/issues/2383)) ([5a0513e](https://github.com/edgar-stacks-fixer-bot/mono/commit/5a0513e1c077a5b62ed49aff04d1e946c4d1ea22))
* **services:** multisig service vaults ([#2378](https://github.com/edgar-stacks-fixer-bot/mono/issues/2378)) ([4351c6c](https://github.com/edgar-stacks-fixer-bot/mono/commit/4351c6c26b256fd4007d70020bc588bf109f7b89))
* **services:** replace chainalysis with leather api compliance endpoint ([#2606](https://github.com/edgar-stacks-fixer-bot/mono/issues/2606)) ([ac3a931](https://github.com/edgar-stacks-fixer-bot/mono/commit/ac3a931ed2dec18d52dd3832450fb59f4dc5282d))
* token price history graph ([#2764](https://github.com/edgar-stacks-fixer-bot/mono/issues/2764)) ([b7c56bc](https://github.com/edgar-stacks-fixer-bot/mono/commit/b7c56bc7eb49b3a38ea7f40c6332e6c5ce390f93))
* tx proposal in extension via rpc requests ([#2472](https://github.com/edgar-stacks-fixer-bot/mono/issues/2472)) ([ef5f7d2](https://github.com/edgar-stacks-fixer-bot/mono/commit/ef5f7d202e1d78862d350443fe622732db25961e))
* **web:** edit multisig member names and show resolved bns names ([#2512](https://github.com/edgar-stacks-fixer-bot/mono/issues/2512)) ([cc8d94a](https://github.com/edgar-stacks-fixer-bot/mono/commit/cc8d94a20ce4d9c0ece5c2209b6818d0515d57d1))
* **web:** multisig vaults UI (create, view, invites) ([#2385](https://github.com/edgar-stacks-fixer-bot/mono/issues/2385)) ([8d55381](https://github.com/edgar-stacks-fixer-bot/mono/commit/8d55381d7a0d90a2ab36f70f528b174ae79d251f))
* **web:** show nonce on multisig transaction details ([#2635](https://github.com/edgar-stacks-fixer-bot/mono/issues/2635)) ([b482b2d](https://github.com/edgar-stacks-fixer-bot/mono/commit/b482b2db89de8218130ef26a3d5893e91f6a6dd9))
* **web:** support custom private regtest network for multisig internal testing ([#2476](https://github.com/edgar-stacks-fixer-bot/mono/issues/2476)) ([143950b](https://github.com/edgar-stacks-fixer-bot/mono/commit/143950b3c49711ac643a3e04ae4b5bec6fa63572))
* **web:** wire multisig auth sign-in flow and session bootstrap (ref LEA-3577) ([#2372](https://github.com/edgar-stacks-fixer-bot/mono/issues/2372)) ([6aa01ea](https://github.com/edgar-stacks-fixer-bot/mono/commit/6aa01ea6a609ebac1dee13908c658ce871e4dd39))


### Bug Fixes

* add @stacks/connect ([#2580](https://github.com/edgar-stacks-fixer-bot/mono/issues/2580)) ([625b20b](https://github.com/edgar-stacks-fixer-bot/mono/commit/625b20b6a68ee0c1bba63e892b46b837561b71e9))
* add all balances settings tab ([#2552](https://github.com/edgar-stacks-fixer-bot/mono/issues/2552)) ([1ef1c33](https://github.com/edgar-stacks-fixer-bot/mono/commit/1ef1c33ecb393f6e2d87f0829773e88e7a59fcfa))
* add private-1 network ([#2650](https://github.com/edgar-stacks-fixer-bot/mono/issues/2650)) ([32c5518](https://github.com/edgar-stacks-fixer-bot/mono/commit/32c5518aa8410cf03f55365c53c617171980b166))
* audit axios ([#2362](https://github.com/edgar-stacks-fixer-bot/mono/issues/2362)) ([83e1848](https://github.com/edgar-stacks-fixer-bot/mono/commit/83e1848b6fe5f4ac3d4478090277b3bf032d055b))
* audit issues ([#2536](https://github.com/edgar-stacks-fixer-bot/mono/issues/2536)) ([812123e](https://github.com/edgar-stacks-fixer-bot/mono/commit/812123ef33b712cb3ef380e21525c8fb67cf1928))
* **auth:** bind sign-in message to requesting domain ([#2690](https://github.com/edgar-stacks-fixer-bot/mono/issues/2690)) ([dfb58cb](https://github.com/edgar-stacks-fixer-bot/mono/commit/dfb58cb5e85b2a10f89d830c5e3269c458dc6564))
* axios audit ([#2815](https://github.com/edgar-stacks-fixer-bot/mono/issues/2815)) ([480ceda](https://github.com/edgar-stacks-fixer-bot/mono/commit/480ceda66cf6537701f7c3571a1fb6c08fc5f127))
* body-parser and undici audit ([#2912](https://github.com/edgar-stacks-fixer-bot/mono/issues/2912)) ([2bee4e7](https://github.com/edgar-stacks-fixer-bot/mono/commit/2bee4e772dd95fff8406822a62225854fb708fbd))
* dep audit ([f0f69d3](https://github.com/edgar-stacks-fixer-bot/mono/commit/f0f69d3b726fc8637ba9b7b69b7bcbf3bb78d244))
* enforce runtime circular dependency detection ([#2852](https://github.com/edgar-stacks-fixer-bot/mono/issues/2852)) ([857e0f7](https://github.com/edgar-stacks-fixer-bot/mono/commit/857e0f79d75025cc0da9f31a78c875fa64ed5eba))
* **extension:** propose transaction to staging ([#2507](https://github.com/edgar-stacks-fixer-bot/mono/issues/2507)) ([b0677ae](https://github.com/edgar-stacks-fixer-bot/mono/commit/b0677ae1cee2e097f24f2bcb087426f8168068ec))
* multisig transaction page repaint ([#2639](https://github.com/edgar-stacks-fixer-bot/mono/issues/2639)) ([75bc675](https://github.com/edgar-stacks-fixer-bot/mono/commit/75bc675b79d2b414bc04171adaa9109f6d41d07f))
* networks bug ([#2379](https://github.com/edgar-stacks-fixer-bot/mono/issues/2379)) ([01d0c87](https://github.com/edgar-stacks-fixer-bot/mono/commit/01d0c87860b18ff5952cac03a12f42f8f9b9165a))
* ordinals/runes fallback ([35d1bea](https://github.com/edgar-stacks-fixer-bot/mono/commit/35d1bea0e3cde0e9ad1e6c77d33793ef48260e3b))
* propogate BE error details to multisig app ([#2609](https://github.com/edgar-stacks-fixer-bot/mono/issues/2609)) ([e902bdb](https://github.com/edgar-stacks-fixer-bot/mono/commit/e902bdb0c9b692d570c696f67a1e3d78dc63e077))
* remove runes/ordinals pages from services/models ([#2358](https://github.com/edgar-stacks-fixer-bot/mono/issues/2358)) ([101bf28](https://github.com/edgar-stacks-fixer-bot/mono/commit/101bf2808285991f40d93e6eaad00f32c4435675))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* route bitflow readonly calls through hiro ([#2683](https://github.com/edgar-stacks-fixer-bot/mono/issues/2683)) ([9659a2f](https://github.com/edgar-stacks-fixer-bot/mono/commit/9659a2f1469e7e6d27428959e2d84264a23d7372))
* sbtc sweep fee weight ([#2914](https://github.com/edgar-stacks-fixer-bot/mono/issues/2914)) ([a783250](https://github.com/edgar-stacks-fixer-bot/mono/commit/a7832501dd27646562f81e7f28b397b871f272ec))
* **services:** filter SIP-9 collectibles that duplicate owned BNS names ([11e2171](https://github.com/edgar-stacks-fixer-bot/mono/commit/11e217153c38f4e38255de083754ec8a79ea78d7))
* **services:** keep sip10 balance when price lookup fails ([#2682](https://github.com/edgar-stacks-fixer-bot/mono/issues/2682)) ([50f7322](https://github.com/edgar-stacks-fixer-bot/mono/commit/50f7322f7c51886ad847955262b712ba1b64544e))
* **services:** limit NFT holdings pagination and narrow Gamma error handling ([e63bce2](https://github.com/edgar-stacks-fixer-bot/mono/commit/e63bce2a8f98f57c2372761fe77c907f46b0d302))
* **services:** mark owned inputs and outputs for fixed-address accounts ([#2664](https://github.com/edgar-stacks-fixer-bot/mono/issues/2664)) ([64965eb](https://github.com/edgar-stacks-fixer-bot/mono/commit/64965eba6cbd9f000d55f2c69ec7f588dca429f0))
* staking testnet network ([#2801](https://github.com/edgar-stacks-fixer-bot/mono/issues/2801)) ([20fe188](https://github.com/edgar-stacks-fixer-bot/mono/commit/20fe1889a867e9ecffb7c20ef7b5a2364e53b43b))
* swaps performance ([#2761](https://github.com/edgar-stacks-fixer-bot/mono/issues/2761)) ([797e1d1](https://github.com/edgar-stacks-fixer-bot/mono/commit/797e1d1b449f9f24fe8a1d2b7077f7afd19a7bb8))
* token details activity loading ([#2782](https://github.com/edgar-stacks-fixer-bot/mono/issues/2782)) ([a505cac](https://github.com/edgar-stacks-fixer-bot/mono/commit/a505cac16639b0e15437f46d14f0093784045dab))
* upgrade axios ([#2313](https://github.com/edgar-stacks-fixer-bot/mono/issues/2313)) ([9876bb2](https://github.com/edgar-stacks-fixer-bot/mono/commit/9876bb2a6cc764494fbcf9d57449ce5ccc821ab3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/bitcoin bumped to 0.43.0
    * @leather.io/constants bumped to 0.42.0
    * @leather.io/crypto bumped to 1.14.0
    * @leather.io/models bumped to 0.64.0
    * @leather.io/stacks bumped to 1.23.0
    * @leather.io/test-config bumped to 0.1.5
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/rpc bumped to 2.26.0
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/stacks: 1.23.0</summary>

## [1.23.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/stacks-v1.22.9...@leather.io/stacks-v1.23.0) (2026-11-13)


### Features

* add new postconditions ([#2422](https://github.com/edgar-stacks-fixer-bot/mono/issues/2422)) ([2416d06](https://github.com/edgar-stacks-fixer-bot/mono/commit/2416d0668a194e0de7ede0c724238b92cb361e81))
* build multisig transfer transactions ([#2418](https://github.com/edgar-stacks-fixer-bot/mono/issues/2418)) ([c72b145](https://github.com/edgar-stacks-fixer-bot/mono/commit/c72b1453cffbcbaa3d972823ce173bc10cb85731))
* **extension:** support originator post-condition mode ([#2324](https://github.com/edgar-stacks-fixer-bot/mono/issues/2324)) ([6e7d3e1](https://github.com/edgar-stacks-fixer-bot/mono/commit/6e7d3e11b5d18a576c72fe4886f5ead6376d9d16))
* multisig activity ([#2482](https://github.com/edgar-stacks-fixer-bot/mono/issues/2482)) ([864d9a6](https://github.com/edgar-stacks-fixer-bot/mono/commit/864d9a6774a758396c97bb6bca2923d0fef45960))
* multisig sip10 transfers ([#2502](https://github.com/edgar-stacks-fixer-bot/mono/issues/2502)) ([4550325](https://github.com/edgar-stacks-fixer-bot/mono/commit/455032542e11e1d13eb40b8567feddd060f528c7))
* multisig tx signing ([#2431](https://github.com/edgar-stacks-fixer-bot/mono/issues/2431)) ([1997d3d](https://github.com/edgar-stacks-fixer-bot/mono/commit/1997d3d8bb0314ef4fd4104fb3303a600a46b0e7))
* policy account state ([#2430](https://github.com/edgar-stacks-fixer-bot/mono/issues/2430)) ([01e4ea0](https://github.com/edgar-stacks-fixer-bot/mono/commit/01e4ea07d67a8dbf4209912aa1c14304b770d521))
* tx proposal in extension via rpc requests ([#2472](https://github.com/edgar-stacks-fixer-bot/mono/issues/2472)) ([ef5f7d2](https://github.com/edgar-stacks-fixer-bot/mono/commit/ef5f7d202e1d78862d350443fe622732db25961e))
* **web:** support custom private regtest network for multisig internal testing ([#2476](https://github.com/edgar-stacks-fixer-bot/mono/issues/2476)) ([143950b](https://github.com/edgar-stacks-fixer-bot/mono/commit/143950b3c49711ac643a3e04ae4b5bec6fa63572))
* **web:** transactions list + details, proposal + sign flow ([#2435](https://github.com/edgar-stacks-fixer-bot/mono/issues/2435)) ([a878d5f](https://github.com/edgar-stacks-fixer-bot/mono/commit/a878d5fe3d392b10c787d9a39f94553e59be018a))


### Bug Fixes

* add ledger derivation paths ([#2592](https://github.com/edgar-stacks-fixer-bot/mono/issues/2592)) ([94806ea](https://github.com/edgar-stacks-fixer-bot/mono/commit/94806eaffddabc4a2e1d6c29fa405979e8170c95))
* body-parser and undici audit ([#2912](https://github.com/edgar-stacks-fixer-bot/mono/issues/2912)) ([2bee4e7](https://github.com/edgar-stacks-fixer-bot/mono/commit/2bee4e772dd95fff8406822a62225854fb708fbd))
* clarity 6 contract deployment ([#2545](https://github.com/edgar-stacks-fixer-bot/mono/issues/2545)) ([2c04085](https://github.com/edgar-stacks-fixer-bot/mono/commit/2c0408553bdad021dad7430beb81d22cf565c95d))
* **mobile:** return sponsored contract calls to the app without error ([#2811](https://github.com/edgar-stacks-fixer-bot/mono/issues/2811)) ([0012105](https://github.com/edgar-stacks-fixer-bot/mono/commit/00121054e400c7de2302e205fbc30f14965cbce7))
* networks bug ([#2379](https://github.com/edgar-stacks-fixer-bot/mono/issues/2379)) ([01d0c87](https://github.com/edgar-stacks-fixer-bot/mono/commit/01d0c87860b18ff5952cac03a12f42f8f9b9165a))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/crypto bumped to 1.14.0
    * @leather.io/models bumped to 0.64.0
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
</details>

<details><summary>@leather.io/test-config: 0.1.5</summary>

## [0.1.5](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/test-config-v0.1.4...@leather.io/test-config-v0.1.5) (2026-11-13)


### Bug Fixes

* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/tokens: 0.29.0</summary>

## [0.29.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/tokens-v0.28.0...@leather.io/tokens-v0.29.0) (2026-11-13)


### Features

* **tokens:** add ink.text-secondary and use it for decision-critical copy ([#2853](https://github.com/edgar-stacks-fixer-bot/mono/issues/2853)) ([9b5ff8f](https://github.com/edgar-stacks-fixer-bot/mono/commit/9b5ff8fafad7c678cca5d7e25ef15115ea186fac))
* **web:** multisig vaults UI (create, view, invites) ([#2385](https://github.com/edgar-stacks-fixer-bot/mono/issues/2385)) ([8d55381](https://github.com/edgar-stacks-fixer-bot/mono/commit/8d55381d7a0d90a2ab36f70f528b174ae79d251f))


### Bug Fixes

* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* **tokens:** add missing caption.02 text style ([#2658](https://github.com/edgar-stacks-fixer-bot/mono/issues/2658)) ([5366529](https://github.com/edgar-stacks-fixer-bot/mono/commit/5366529da7e85abb209481257f0d7f422883ece3))
* **ui:** repair default callout contrast and link underline and focus states ([#2800](https://github.com/edgar-stacks-fixer-bot/mono/issues/2800)) ([32d87f8](https://github.com/edgar-stacks-fixer-bot/mono/commit/32d87f8973cb71e06ebe7fc55c7a47fa94a6557f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/tsconfig-config: 0.11.3</summary>

## [0.11.3](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/tsconfig-config-v0.11.2...@leather.io/tsconfig-config-v0.11.3) (2026-11-13)


### Bug Fixes

* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
</details>

<details><summary>@leather.io/ui: 1.120.0</summary>

## [1.120.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/ui-v1.119.4...@leather.io/ui-v1.120.0) (2026-11-13)


### Features

* add new activity list ([#2555](https://github.com/edgar-stacks-fixer-bot/mono/issues/2555)) ([7d5f88a](https://github.com/edgar-stacks-fixer-bot/mono/commit/7d5f88a8f5af565d381c231a401842462263c322))
* address verification ([#2549](https://github.com/edgar-stacks-fixer-bot/mono/issues/2549)) ([4965f2d](https://github.com/edgar-stacks-fixer-bot/mono/commit/4965f2d8e71b93a286f7cd1ab6f04493dbe7cfa8))
* distinguish multisig cancelled activity items ([#2660](https://github.com/edgar-stacks-fixer-bot/mono/issues/2660)) ([4dc3931](https://github.com/edgar-stacks-fixer-bot/mono/commit/4dc3931374c6529b833d7e98e231e23e0bd78b23))
* **extension:** bitcoin staking balances and positions UI ([#2715](https://github.com/edgar-stacks-fixer-bot/mono/issues/2715)) ([0af16a8](https://github.com/edgar-stacks-fixer-bot/mono/commit/0af16a8f1ac9509cf94a351f8f667ba5c2b85a83))
* **extension:** first token ([a945df1](https://github.com/edgar-stacks-fixer-bot/mono/commit/a945df1e5bef1f884d3a1c670f7f5485376d6d2b))
* **mobile:** token presets and a hidden tokens pill under the list ([#2859](https://github.com/edgar-stacks-fixer-bot/mono/issues/2859)) ([9e71d62](https://github.com/edgar-stacks-fixer-bot/mono/commit/9e71d6218aca02385ab98330c9ff90c8e85bd2fe))
* multisig activity ([#2482](https://github.com/edgar-stacks-fixer-bot/mono/issues/2482)) ([864d9a6](https://github.com/edgar-stacks-fixer-bot/mono/commit/864d9a6774a758396c97bb6bca2923d0fef45960))
* multiwallet UI ([#2356](https://github.com/edgar-stacks-fixer-bot/mono/issues/2356)) ([34e7419](https://github.com/edgar-stacks-fixer-bot/mono/commit/34e7419c4a870546500e3896d2ec2890fe309f33))
* **ui:** add popover web component ([a44473c](https://github.com/edgar-stacks-fixer-bot/mono/commit/a44473c136eb1946466527f2a4e4d8150b14847e))
* **ui:** add web version of numeric input ([ac33307](https://github.com/edgar-stacks-fixer-bot/mono/commit/ac33307dd5f41f79ea7733efaba8537dcf5ab222))
* **web:** launch polish for multisig onboarding, nav icon and install button ([#2729](https://github.com/edgar-stacks-fixer-bot/mono/issues/2729)) ([bc8e964](https://github.com/edgar-stacks-fixer-bot/mono/commit/bc8e9646bec9aa202b988db716e14d0d94f8899c))
* **web:** Leather Multisig UI (initial import, behind multisigEnabled flag) ([#2365](https://github.com/edgar-stacks-fixer-bot/mono/issues/2365)) ([872827d](https://github.com/edgar-stacks-fixer-bot/mono/commit/872827d28f3f848595958f197df22df6b580dd81))
* **web:** multisig design QA  list-item consistency + UI polish ([#2471](https://github.com/edgar-stacks-fixer-bot/mono/issues/2471)) ([79a4034](https://github.com/edgar-stacks-fixer-bot/mono/commit/79a403405eb7034d9856de09c1640d04efa55b84))
* **web:** multisig per-chain connection-status dropdown ([#2376](https://github.com/edgar-stacks-fixer-bot/mono/issues/2376)) ([98b810b](https://github.com/edgar-stacks-fixer-bot/mono/commit/98b810b51d8b9c9994978d10637cf30ecb7662d6))
* **web:** multisig vault details, accounts + balances ([#2403](https://github.com/edgar-stacks-fixer-bot/mono/issues/2403)) ([4a3fc3f](https://github.com/edgar-stacks-fixer-bot/mono/commit/4a3fc3f39bc10615952b4748cc26621a76febc5e))
* **web:** playground design surface + multisig content refinements ([#2527](https://github.com/edgar-stacks-fixer-bot/mono/issues/2527)) ([#2532](https://github.com/edgar-stacks-fixer-bot/mono/issues/2532)) ([6580b89](https://github.com/edgar-stacks-fixer-bot/mono/commit/6580b892a307bca0f66db2b159ea656d3998af19))
* **web:** staking UI pass  position rows, provider table, shared address chips ([#2568](https://github.com/edgar-stacks-fixer-bot/mono/issues/2568)) ([d98bd9a](https://github.com/edgar-stacks-fixer-bot/mono/commit/d98bd9a61b2f066041082b85256da9a96519d7b6))


### Bug Fixes

* add all balances settings tab ([#2552](https://github.com/edgar-stacks-fixer-bot/mono/issues/2552)) ([1ef1c33](https://github.com/edgar-stacks-fixer-bot/mono/commit/1ef1c33ecb393f6e2d87f0829773e88e7a59fcfa))
* bring back ordinal banners and make those dismissable ([#2615](https://github.com/edgar-stacks-fixer-bot/mono/issues/2615)) ([c085334](https://github.com/edgar-stacks-fixer-bot/mono/commit/c08533430f9b6bfd7c18f8e03b4151e2ec13cd91))
* clipboard in multisig vault invites ([#2530](https://github.com/edgar-stacks-fixer-bot/mono/issues/2530)) ([8e04bfb](https://github.com/edgar-stacks-fixer-bot/mono/commit/8e04bfbead39ff2d437385bb26667158103aff9d))
* **extension:** account picker, header & logo visual polish (LEA-3591, LEA-3589, LEA-3594) ([#2411](https://github.com/edgar-stacks-fixer-bot/mono/issues/2411)) ([9a54be2](https://github.com/edgar-stacks-fixer-bot/mono/commit/9a54be237891d601dc7110e106589c2c51f5d502))
* **extension:** correct disabled swap button outline and add explanatory tooltip ([#2429](https://github.com/edgar-stacks-fixer-bot/mono/issues/2429)) ([0b2bf4f](https://github.com/edgar-stacks-fixer-bot/mono/commit/0b2bf4ff2ebe55d33fb6d9acfc5168a16986c6ec))
* **extension:** keep update notice readable and add toast countdown ring ([#2861](https://github.com/edgar-stacks-fixer-bot/mono/issues/2861)) ([aa8c75a](https://github.com/edgar-stacks-fixer-bot/mono/commit/aa8c75a6fa6a0b87a720b3fbb0ed596af0aeef56))
* **extension:** make deposits pressable ([831a1f3](https://github.com/edgar-stacks-fixer-bot/mono/commit/831a1f3c2603ad9422d9bbe9008d72599ce24fa6))
* **extension:** refine collectibles tab typography and spacing ([509e784](https://github.com/edgar-stacks-fixer-bot/mono/commit/509e78416099d4e90f47bb89eacd4abc474ee84a))
* **extension:** refine token list typography, spacing, and hover radius ([05871e1](https://github.com/edgar-stacks-fixer-bot/mono/commit/05871e1686e292760caba72286afd8ecf24781bd))
* **extension:** tidy up the multi-wallet account row in approval views ([#2433](https://github.com/edgar-stacks-fixer-bot/mono/issues/2433)) ([8ff20d9](https://github.com/edgar-stacks-fixer-bot/mono/commit/8ff20d9fe5e34dff42e149926b823b91e54626a3))
* **extension:** update collectible design ([7902c68](https://github.com/edgar-stacks-fixer-bot/mono/commit/7902c68a97f6883c17b83f0935d125fa227ee78d))
* multisig pre-release design QA pass ([#2670](https://github.com/edgar-stacks-fixer-bot/mono/issues/2670)) ([c14d933](https://github.com/edgar-stacks-fixer-bot/mono/commit/c14d933f0c29778e8583fc64fd9273e10c27f764))
* remove runes/ordinals from ui packages ([#2353](https://github.com/edgar-stacks-fixer-bot/mono/issues/2353)) ([709dbb5](https://github.com/edgar-stacks-fixer-bot/mono/commit/709dbb53a38f221b2befc73191e44c952bee4c49))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* swaps ui improvements ([#2758](https://github.com/edgar-stacks-fixer-bot/mono/issues/2758)) ([be4e2cf](https://github.com/edgar-stacks-fixer-bot/mono/commit/be4e2cfa261d803c24eb504f675713f5e2235673))
* **ui:** improve switch on/off contrast and add focus ring ([e621993](https://github.com/edgar-stacks-fixer-bot/mono/commit/e6219935ea01f11a8928d284187a309ae4b0e098))
* **ui:** prevent avatar from shrinking in flex rows ([#2791](https://github.com/edgar-stacks-fixer-bot/mono/issues/2791)) ([00a23a3](https://github.com/edgar-stacks-fixer-bot/mono/commit/00a23a331e56593ad9394579bb478eda1bfd5537))
* **ui:** render item layout chevron direction with dedicated icons ([#2792](https://github.com/edgar-stacks-fixer-bot/mono/issues/2792)) ([aace9d8](https://github.com/edgar-stacks-fixer-bot/mono/commit/aace9d8a2061b9bd8d6fe094351b751c64237929))
* **ui:** repair default callout contrast and link underline and focus states ([#2800](https://github.com/edgar-stacks-fixer-bot/mono/issues/2800)) ([32d87f8](https://github.com/edgar-stacks-fixer-bot/mono/commit/32d87f8973cb71e06ebe7fc55c7a47fa94a6557f))
* **ui:** truncate long titles in item layout with ellipsis ([#2360](https://github.com/edgar-stacks-fixer-bot/mono/issues/2360)) ([58cf921](https://github.com/edgar-stacks-fixer-bot/mono/commit/58cf92115f5ccffa6c0bfd847ec85026e85d5880))
* **ui:** use blue.border instead of lightModeBlue.500 for switch focus ring ([a2da5b1](https://github.com/edgar-stacks-fixer-bot/mono/commit/a2da5b143fd942ba7c61214f0e1bd01abf09a9a1))
* **ui:** use correct spacings for numeric input elements ([5f91542](https://github.com/edgar-stacks-fixer-bot/mono/commit/5f9154259e841b5e2b043c17ae92417d9cd1f69a))
* **web:** rework staking payout selection, hover cards and form radii ([#2558](https://github.com/edgar-stacks-fixer-bot/mono/issues/2558)) ([612c860](https://github.com/edgar-stacks-fixer-bot/mono/commit/612c860fa18934819ddac0c14f25c01d31fee58d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/tokens bumped to 0.29.0
    * @leather.io/utils bumped to 0.56.0
  * devDependencies
    * @leather.io/features bumped to 1.9.0
    * @leather.io/models bumped to 0.64.0
    * @leather.io/panda-preset bumped to 0.16.7
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

<details><summary>@leather.io/utils: 0.56.0</summary>

## [0.56.0](https://github.com/edgar-stacks-fixer-bot/mono/compare/@leather.io/utils-v0.55.0...@leather.io/utils-v0.56.0) (2026-11-13)


### Features

* **extension:** new swaps flow with sBTC bridging ([#2554](https://github.com/edgar-stacks-fixer-bot/mono/issues/2554)) ([65c8518](https://github.com/edgar-stacks-fixer-bot/mono/commit/65c85186c847b2e99fd062d00997c81932268bc5))
* multisig fixed address account ([#2415](https://github.com/edgar-stacks-fixer-bot/mono/issues/2415)) ([964ff42](https://github.com/edgar-stacks-fixer-bot/mono/commit/964ff421f0b83ca688859f9bae7d2863adc9c183))
* multiwallet UI ([#2356](https://github.com/edgar-stacks-fixer-bot/mono/issues/2356)) ([34e7419](https://github.com/edgar-stacks-fixer-bot/mono/commit/34e7419c4a870546500e3896d2ec2890fe309f33))
* pin sBTC and USDCx after BTC and STX in token lists ([#2858](https://github.com/edgar-stacks-fixer-bot/mono/issues/2858)) ([12d4c39](https://github.com/edgar-stacks-fixer-bot/mono/commit/12d4c398445f690c714d16e4198b8a4ec47f9566))
* **services:** bitcoin staking balances and positions service ([#2714](https://github.com/edgar-stacks-fixer-bot/mono/issues/2714)) ([695400d](https://github.com/edgar-stacks-fixer-bot/mono/commit/695400d198c48641ec00395ffe33562cafd35f66))


### Bug Fixes

* enforce runtime circular dependency detection ([#2852](https://github.com/edgar-stacks-fixer-bot/mono/issues/2852)) ([857e0f7](https://github.com/edgar-stacks-fixer-bot/mono/commit/857e0f79d75025cc0da9f31a78c875fa64ed5eba))
* remove runes/ordinals pages from services/models ([#2358](https://github.com/edgar-stacks-fixer-bot/mono/issues/2358)) ([101bf28](https://github.com/edgar-stacks-fixer-bot/mono/commit/101bf2808285991f40d93e6eaad00f32c4435675))
* remove senseinode temporarily ([#2765](https://github.com/edgar-stacks-fixer-bot/mono/issues/2765)) ([6035d9b](https://github.com/edgar-stacks-fixer-bot/mono/commit/6035d9b5d68bcfd91959b671c6551b34c490ef4d))
* swaps performance ([#2761](https://github.com/edgar-stacks-fixer-bot/mono/issues/2761)) ([797e1d1](https://github.com/edgar-stacks-fixer-bot/mono/commit/797e1d1b449f9f24fe8a1d2b7077f7afd19a7bb8))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @leather.io/constants bumped to 0.42.0
    * @leather.io/models bumped to 0.64.0
  * devDependencies
    * @leather.io/prettier-config bumped to 0.9.2
    * @leather.io/test-config bumped to 0.1.5
    * @leather.io/tsconfig-config bumped to 0.11.3
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).