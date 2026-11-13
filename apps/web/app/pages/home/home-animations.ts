import type { AnimationSegment } from 'lottie-web';

import { homeAsset } from './home.data';

interface HomeAnimation {
  src: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
}

function animation(name: string, alt: string, width: number, height: number): HomeAnimation {
  return {
    src: homeAsset(`animations/${name}.lottie.json`),
    poster: homeAsset(`images/${name}-poster.png`),
    alt,
    width,
    height,
  };
}

export const ledgerAnimation = animation(
  'ledger',
  'A Ledger hardware wallet plugged into a cable',
  680,
  374
);

export const bringWalletsAnimation = animation(
  'bring-wallets',
  'A stack of wallet cards with their balances',
  580,
  432
);

export const nameWalletsAnimation = animation(
  'name-wallets',
  'A carousel of wallet icons with a custom wallet name',
  580,
  432
);

export const sendReceiveAnimation = animation(
  'send-receive',
  'The Leather send form with an amount and recipient',
  580,
  432
);

export const collectionAnimation = animation(
  'collection',
  'A grid of collectibles in the Leather wallet',
  580,
  432
);

export const btcNotificationsAnimation = animation(
  'btc-notifications',
  'Notifications for received Bitcoin',
  383,
  280
);

export const spamFilterAnimation = animation(
  'spam-filter',
  'A hide spam toggle above a list of spam tokens',
  390,
  280
);

export const reviewTransactionsAnimation = animation(
  'review-transactions',
  'A sign transaction screen with the assets about to move',
  530,
  380
);

export const spamFilterIdleSegment: AnimationSegment = [0, 175];
export const spamFilterActiveSegment: AnimationSegment = [200, 300];

export const coinRingScene = {
  scene: homeAsset('animations/coin-ring.splinecode'),
  poster: homeAsset('images/coin-ring-poster.png'),
  alt: 'Bitcoin, sBTC and Stacks coins tumbling in a ring',
  width: 600,
  height: 450,
};
