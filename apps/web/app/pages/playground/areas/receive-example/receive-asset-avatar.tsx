import { type AvatarProps, BtcAvatarIcon, SbtcAvatarIcon, StxAvatarIcon } from '@leather.io/ui';

import { type ReceiveAssetAvatarId } from './receive-example-fixtures';

interface ReceiveAssetAvatarProps {
  avatar: ReceiveAssetAvatarId;
  size: AvatarProps['size'];
}

export function ReceiveAssetAvatar({ avatar, size }: ReceiveAssetAvatarProps) {
  if (avatar === 'btc') return <BtcAvatarIcon size={size} />;
  if (avatar === 'sbtc') return <SbtcAvatarIcon size={size} />;
  return <StxAvatarIcon size={size} />;
}
