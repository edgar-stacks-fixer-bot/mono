import { Flex, styled } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

import { useExplorationParams } from './exploration-params';

interface ClickThroughStep<T extends string> {
  id: T;
  label: string;
}

export function useClickThrough<T extends string>(steps: readonly ClickThroughStep<T>[]) {
  const { params, setParams } = useExplorationParams();
  const firstStep = steps[0]?.id;
  const current = steps.find(step => step.id === params.step)?.id ?? firstStep;

  function goTo(step: T) {
    setParams({ step: step === firstStep ? null : step });
  }

  return { current, goTo, steps };
}

interface ClickThroughBarProps<T extends string> {
  steps: readonly ClickThroughStep<T>[];
  current: T | undefined;
  onSelect(step: T): void;
}

export function ClickThroughBar<T extends string>({
  steps,
  current,
  onSelect,
}: ClickThroughBarProps<T>) {
  return (
    <Flex alignItems="center" gap="space.02" flexWrap="wrap" role="group" aria-label="Flow steps">
      <styled.span textStyle="caption.01" color="ink.text-subdued">
        Steps
      </styled.span>
      {steps.map((step, index) => (
        <Button
          key={step.id}
          size="sm"
          variant={step.id === current ? 'solid' : 'outline'}
          aria-pressed={step.id === current}
          onClick={() => onSelect(step.id)}
        >
          {`${index + 1}. ${step.label}`}
        </Button>
      ))}
    </Flex>
  );
}
