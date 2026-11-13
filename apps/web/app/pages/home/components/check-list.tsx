import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

import { CheckmarkCircleIcon } from '@leather.io/ui';

interface CheckListProps extends HTMLStyledProps<'ul'> {
  items: string[];
}

export function CheckList({ items, ...props }: CheckListProps) {
  return (
    <styled.ul display="flex" flexWrap="wrap" gap="space.03" listStyle="none" {...props}>
      {items.map(item => (
        <styled.li
          key={item}
          display="flex"
          alignItems="center"
          gap="space.02"
          textStyle="body.01"
          color="ink.text-subdued"
        >
          <CheckmarkCircleIcon variant="small" color="green.action-primary-default" />
          {item}
        </styled.li>
      ))}
    </styled.ul>
  );
}
