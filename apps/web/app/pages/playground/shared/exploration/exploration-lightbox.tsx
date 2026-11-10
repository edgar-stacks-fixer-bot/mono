import { type ReactNode, useEffect } from 'react';

import { Box, Flex, styled } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

interface ExplorationLightboxProps {
  title: string;
  children: ReactNode;
  onClose(): void;
}

export function ExplorationLightbox({ title, children, onClose }: ExplorationLightboxProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label={title}
      position="fixed"
      inset={0}
      zIndex={1200}
      bg="overlay"
      overflow="auto"
      onClick={onClose}
    >
      <Flex
        direction="column"
        alignItems="center"
        gap="space.04"
        minHeight="100%"
        p="space.06"
        justifyContent="center"
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          gap="space.04"
          width="100%"
          maxWidth="fullPageMaxWidth"
          px="space.04"
          py="space.03"
          borderRadius="md"
          bg="ink.background-primary"
          onClick={event => event.stopPropagation()}
        >
          <styled.h2 textStyle="heading.05" color="ink.text-primary">
            {title}
          </styled.h2>
          <Button size="sm" variant="solid" onClick={onClose}>
            Close
          </Button>
        </Flex>
        <Flex
          gap="space.06"
          flexWrap="wrap"
          justifyContent="center"
          onClick={event => event.stopPropagation()}
        >
          {children}
        </Flex>
      </Flex>
    </Box>
  );
}
