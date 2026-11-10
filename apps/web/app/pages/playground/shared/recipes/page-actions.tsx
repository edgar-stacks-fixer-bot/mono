import { Flex } from 'leather-styles/jsx';

import { Button } from '@leather.io/ui';

interface PageAction {
  label: string;
  onClick?(): void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface PrimaryPageAction extends PageAction {
  type?: 'button' | 'submit';
  form?: string;
}

interface PageActionsProps {
  primary: PrimaryPageAction;
  secondary?: PageAction;
}

export function PageActions({ primary, secondary }: PageActionsProps) {
  return (
    <Flex gap="space.03" width="100%">
      {secondary ? (
        <Button
          type="button"
          variant="outline"
          flex={1}
          onClick={secondary.onClick}
          disabled={secondary.disabled}
          aria-busy={secondary.isLoading}
        >
          {secondary.label}
        </Button>
      ) : null}
      <Button
        type={primary.type ?? 'button'}
        form={primary.form}
        variant="solid"
        flex={1}
        onClick={primary.onClick}
        disabled={primary.disabled}
        aria-busy={primary.isLoading}
      >
        {primary.label}
      </Button>
    </Flex>
  );
}
