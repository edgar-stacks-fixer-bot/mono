import { type ReactNode } from 'react';

import { Box, Flex, styled } from 'leather-styles/jsx';

import { Button, ExpandIcon } from '@leather.io/ui';

import { ExplorationLightbox } from './exploration-lightbox';
import {
  type ExplorationContent,
  type ExplorationTheme,
  type ExplorationViewport,
  explorationViewports,
  themesForMode,
  useExplorationParams,
} from './exploration-params';
import { ExplorationRails } from './exploration-rails';

interface ExplorationFrameState {
  theme: ExplorationTheme;
  content: ExplorationContent;
  viewport: ExplorationViewport;
}

type ExplorationFrameContent = ReactNode | ((state: ExplorationFrameState) => ReactNode);

interface FrameSurfaceProps {
  title: string;
  state: ExplorationFrameState;
  rails: boolean;
  children: ExplorationFrameContent;
}

function renderContent(children: ExplorationFrameContent, state: ExplorationFrameState) {
  if (typeof children === 'function') return children(state);
  return children;
}

function FrameSurface({ title, state, rails, children }: FrameSurfaceProps) {
  const { width, height } = explorationViewports[state.viewport];
  return (
    <Flex direction="column" gap="space.02">
      <styled.span textStyle="caption.01" color="ink.text-subdued">
        {`${title} · ${state.theme} · ${width}×${height}`}
      </styled.span>
      <Box
        data-frame={state.theme}
        className={state.theme === 'dark' ? 'dark' : undefined}
        position="relative"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        borderRadius="md"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="ink.border-default"
        bg="ink.background-primary"
        color="ink.text-primary"
        style={{ width, height }}
      >
        {renderContent(children, state)}
        {rails ? <ExplorationRails /> : null}
      </Box>
    </Flex>
  );
}

interface ExplorationFrameProps {
  id: string;
  title: string;
  children: ExplorationFrameContent;
}

export function ExplorationFrame({ id, title, children }: ExplorationFrameProps) {
  const { params, setParams } = useExplorationParams();
  const themes = themesForMode(params.theme);
  const isFocused = params.focus === id;

  const surfaces = themes.map(theme => (
    <FrameSurface
      key={theme}
      title={title}
      rails={params.rails}
      state={{ theme, content: params.content, viewport: params.viewport }}
    >
      {children}
    </FrameSurface>
  ));

  return (
    <Flex direction="column" gap="space.03">
      <Flex alignItems="center" justifyContent="space-between" gap="space.03">
        <styled.h3 textStyle="label.02">{title}</styled.h3>
        <Button
          size="sm"
          variant="ghost"
          iconStart={ExpandIcon}
          onClick={() => setParams({ focus: id })}
        >
          Focus
        </Button>
      </Flex>
      <Flex gap="space.05" flexWrap="wrap" alignItems="flex-start">
        {isFocused ? null : surfaces}
      </Flex>
      {isFocused ? (
        <ExplorationLightbox title={title} onClose={() => setParams({ focus: null })}>
          {surfaces}
        </ExplorationLightbox>
      ) : null}
    </Flex>
  );
}
