import { type ReactNode } from 'react';

import { Flex, styled } from 'leather-styles/jsx';

interface PopupPageProps {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function PopupPage({ header, children, footer }: PopupPageProps) {
  return (
    <Flex direction="column" height="100%" width="100%" bg="ink.background-primary">
      {header}
      <styled.main flex={1} minHeight={0} overflowY="auto" px="space.05" pb="space.05">
        {children}
      </styled.main>
      {footer ? (
        <styled.footer flexShrink={0} px="space.05" py="space.04" boxShadow="contentOverflowFade">
          {footer}
        </styled.footer>
      ) : null}
    </Flex>
  );
}
