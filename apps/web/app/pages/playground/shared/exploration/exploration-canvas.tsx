import { type ReactNode, useEffect } from 'react';

import { Flex, styled } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

import { dockClearance } from '../../components/playground-dock';
import {
  explorationContents,
  explorationThemeModes,
  explorationViewports,
  useExplorationParams,
} from './exploration-params';

const darkThemeClass = 'dark';

interface ControlGroupProps<T extends string> {
  label: string;
  options: readonly { id: T; label: string }[];
  selected: T;
  onSelect(id: T): void;
}

function ControlGroup<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: ControlGroupProps<T>) {
  return (
    <Flex alignItems="center" gap="space.02" role="group" aria-label={label}>
      <styled.span textStyle="caption.01" color="ink.text-subdued">
        {label}
      </styled.span>
      {options.map(option => (
        <Button
          key={option.id}
          size="sm"
          variant={option.id === selected ? 'solid' : 'outline'}
          aria-pressed={option.id === selected}
          onClick={() => onSelect(option.id)}
        >
          {option.label}
        </Button>
      ))}
    </Flex>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const themeOptions = explorationThemeModes.map(id => ({ id, label: capitalize(id) }));
const contentOptions = explorationContents.map(id => ({ id, label: capitalize(id) }));
const viewportOptions = (['popup', 'narrow'] as const).map(id => ({
  id,
  label: `${explorationViewports[id].label} ${explorationViewports[id].width}`,
}));
const railOptions = [
  { id: 'off', label: 'Off' },
  { id: 'on', label: 'On' },
] as const;

function useDocumentTheme(isDark: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const hadDarkClass = root.classList.contains(darkThemeClass);
    root.classList.toggle(darkThemeClass, isDark);
    return () => {
      root.classList.toggle(darkThemeClass, hadDarkClass);
    };
  }, [isDark]);
}

interface ExplorationCanvasProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ExplorationCanvas({ title, description, children }: ExplorationCanvasProps) {
  const { params, setParams } = useExplorationParams();
  useDocumentTheme(params.theme === 'dark');

  return (
    <Flex
      direction="column"
      gap="space.06"
      minHeight="100vh"
      px="space.06"
      pt="space.06"
      bg="ink.background-secondary"
      color="ink.text-primary"
      style={{ paddingBottom: dockClearance * 2 }}
    >
      <Flex direction="column" gap="space.02" maxWidth="720px">
        <styled.h1 textStyle="heading.03">{title}</styled.h1>
        <styled.p textStyle="body.02" color="ink.text-subdued">
          {description}
        </styled.p>
      </Flex>
      <Flex flexWrap="wrap" gap="space.05" alignItems="center">
        <ControlGroup
          label="Theme"
          options={themeOptions}
          selected={params.theme}
          onSelect={theme => setParams({ theme })}
        />
        <ControlGroup
          label="Viewport"
          options={viewportOptions}
          selected={params.viewport}
          onSelect={viewport => setParams({ viewport })}
        />
        <ControlGroup
          label="Content"
          options={contentOptions}
          selected={params.content}
          onSelect={content => setParams({ content })}
        />
        <ControlGroup
          label="Rails"
          options={railOptions}
          selected={params.rails ? 'on' : 'off'}
          onSelect={rails => setParams({ rails: rails === 'on' })}
        />
      </Flex>
      {children}
    </Flex>
  );
}

interface ExplorationRowProps {
  title: string;
  caption?: string;
  children: ReactNode;
}

export function ExplorationRow({ title, caption, children }: ExplorationRowProps) {
  return (
    <styled.section display="flex" flexDirection="column" gap="space.04">
      <Flex direction="column" gap="space.01">
        <styled.h2 textStyle="heading.05">{title}</styled.h2>
        {caption ? (
          <styled.p textStyle="caption.01" color="ink.text-subdued">
            {caption}
          </styled.p>
        ) : null}
      </Flex>
      <Flex gap="space.06" flexWrap="wrap" alignItems="flex-start">
        {children}
      </Flex>
    </styled.section>
  );
}
