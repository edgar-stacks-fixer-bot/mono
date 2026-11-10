import { type ReactElement, cloneElement } from 'react';

import { type HTMLStyledProps, styled } from 'leather-styles/jsx';
import { type ColorToken } from 'leather-styles/tokens';

import { type IconProps } from '../../icons/icon/create-icon.web';

export type InlineIconTone = 'inherit' | 'secondary' | 'subdued';
export type InlineIconSize = 'small' | 'medium';
export type InlineIconPlacement = 'start' | 'end' | 'standalone';

const toneColorMap: Record<InlineIconTone, ColorToken> = {
  inherit: 'current',
  secondary: 'ink.text-secondary',
  subdued: 'ink.text-subdued',
};

const InlineIconContainer = styled('span', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
  variants: {
    placement: {
      start: { mr: 'space.01' },
      end: { ml: 'space.01' },
      standalone: {},
    },
  },
  defaultVariants: {
    placement: 'standalone',
  },
});

export interface InlineIconProps extends Omit<HTMLStyledProps<'span'>, 'children'> {
  icon: ReactElement<IconProps>;
  tone?: InlineIconTone;
  size?: InlineIconSize;
  placement?: InlineIconPlacement;
}

export function InlineIcon({
  icon,
  tone = 'inherit',
  size = 'small',
  placement = 'standalone',
  ...props
}: InlineIconProps) {
  return (
    <InlineIconContainer aria-hidden placement={placement} {...props}>
      {cloneElement<IconProps>(icon, { variant: size, color: toneColorMap[tone] })}
    </InlineIconContainer>
  );
}
