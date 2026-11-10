import { Box } from 'leather-styles/jsx';

export function ExplorationRails() {
  return (
    <Box position="absolute" inset={0} pointerEvents="none" zIndex={2} aria-hidden data-rails>
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left="space.05"
        width="1px"
        bg="blue.action-primary-default"
      />
      <Box
        position="absolute"
        top={0}
        bottom={0}
        right="space.05"
        width="1px"
        bg="blue.action-primary-default"
      />
      <Box
        position="absolute"
        left={0}
        right={0}
        top="popupHeaderHeight"
        height="1px"
        bg="blue.action-primary-default"
      />
    </Box>
  );
}
