import { type ReactNode, useState } from 'react';

import { Box, Flex, Grid, HStack, Stack, styled } from 'leather-styles/jsx';

import { Badge, Button, Callout } from '@leather.io/ui';

const feeTiers = [
  { id: 'low', label: 'Low', stxFee: '0.0002 STX', sbtcFee: '0.00000300 sBTC', fiat: '$0.27' },
  {
    id: 'standard',
    label: 'Standard',
    stxFee: '0.0004 STX',
    sbtcFee: '0.00000600 sBTC',
    fiat: '$0.54',
  },
  { id: 'high', label: 'High', stxFee: '0.0009 STX', sbtcFee: '0.00001352 sBTC', fiat: '$1.22' },
] as const;

type FeeTierId = (typeof feeTiers)[number]['id'];

const sampleRecipient = 'SPXH3H…RKCB';
const sampleAmount = '0.00100000 sBTC';
const sampleMemo = 'invoice 42';

function getFeeTier(id: FeeTierId) {
  return feeTiers.find(tier => tier.id === id) ?? feeTiers[1];
}

interface PopupFrameProps {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}
function PopupFrame({ title, children, footer }: PopupFrameProps) {
  return (
    <Stack
      width="360px"
      minHeight="560px"
      borderWidth={1}
      borderColor="ink.border-default"
      borderRadius="md"
      bg="ink.background-primary"
      overflow="hidden"
    >
      <Box px="space.05" py="space.04" borderBottomWidth={1} borderColor="ink.border-default">
        <styled.span textStyle="label.01">{title}</styled.span>
      </Box>
      <Stack flex={1} gap="space.04" px="space.05" py="space.04">
        {children}
      </Stack>
      <Box px="space.05" pb="space.05">
        {footer}
      </Box>
    </Stack>
  );
}

interface DetailRowProps {
  label: string;
  value: ReactNode;
}
function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Flex justifyContent="space-between" gap="space.03">
      <styled.span textStyle="label.02" color="ink.text-subdued">
        {label}
      </styled.span>
      <styled.span textStyle="label.02" textAlign="right">
        {value}
      </styled.span>
    </Flex>
  );
}

interface FlowSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}
function FlowSection({ title, description, children }: FlowSectionProps) {
  return (
    <Stack gap="space.05">
      <Stack gap="space.02">
        <styled.h2 textStyle="heading.05">{title}</styled.h2>
        <styled.p textStyle="body.02" color="ink.text-subdued" maxWidth="720px">
          {description}
        </styled.p>
      </Stack>
      {children}
    </Stack>
  );
}

type SponsoredSendStep = 'form' | 'review' | 'requoted' | 'sent';

function SponsoredSendFlow() {
  const [step, setStep] = useState<SponsoredSendStep>('form');
  const [tierId, setTierId] = useState<FeeTierId>('standard');
  const tier = getFeeTier(tierId);

  if (step === 'form') {
    return (
      <PopupFrame
        title="Send sBTC"
        footer={
          <Button fullWidth onClick={() => setStep('review')}>
            Continue
          </Button>
        }
      >
        <DetailRow label="Amount" value={sampleAmount} />
        <DetailRow label="To" value={sampleRecipient} />
        <DetailRow label="Memo" value={sampleMemo} />
        <Stack gap="space.02">
          <HStack gap="space.02">
            <styled.span textStyle="label.02" color="ink.text-subdued">
              Fee
            </styled.span>
            <Badge label="Sponsored" variant="info" />
          </HStack>
          <HStack gap="space.02" flexWrap="wrap">
            {feeTiers.map(option => (
              <Button
                key={option.id}
                size="sm"
                variant={option.id === tierId ? 'solid' : 'outline'}
                onClick={() => setTierId(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </HStack>
          <DetailRow label={tier.label} value={`${tier.sbtcFee} (${tier.fiat})`} />
          <styled.p textStyle="caption.01" color="ink.text-subdued">
            No STX for the network fee, so the Leather sponsor pays {tier.stxFee} and you pay the
            fee in sBTC. No custom fee.
          </styled.p>
        </Stack>
      </PopupFrame>
    );
  }

  if (step === 'sent') {
    return (
      <PopupFrame
        title="Sent"
        footer={
          <Button fullWidth variant="outline" onClick={() => setStep('form')}>
            Start over
          </Button>
        }
      >
        <styled.span textStyle="heading.04">{sampleAmount}</styled.span>
        <DetailRow label="To" value={sampleRecipient} />
        <DetailRow label="Status" value="Pending" />
        <DetailRow label="Total spend" value={`${sampleAmount} + ${tier.sbtcFee}`} />
        <DetailRow label="Sending" value={sampleAmount} />
        <DetailRow label="Fee" value={tier.sbtcFee} />
        <DetailRow label="Memo" value={sampleMemo} />
      </PopupFrame>
    );
  }

  return (
    <PopupFrame
      title="Review"
      footer={
        <Stack gap="space.02">
          <Button fullWidth onClick={() => setStep('sent')}>
            Confirm and send transaction
          </Button>
          {step === 'review' && (
            <Button fullWidth variant="ghost" onClick={() => setStep('requoted')}>
              Simulate an expired quote
            </Button>
          )}
        </Stack>
      }
    >
      {step === 'requoted' && (
        <Callout variant="info" title="Fee quote updated">
          The sponsor updated the sBTC fee. Review the new fee and confirm again.
        </Callout>
      )}
      <styled.span textStyle="heading.04">{sampleAmount}</styled.span>
      <DetailRow label="To" value={sampleRecipient} />
      <DetailRow label="Total spend" value={`${sampleAmount} + ${tier.sbtcFee}`} />
      <DetailRow label="Sending" value={sampleAmount} />
      <DetailRow label="Fee" value={tier.sbtcFee} />
      <DetailRow label="Memo" value={sampleMemo} />
    </PopupFrame>
  );
}

type BundleStep = 'request' | 'review' | 'sent';

function ContractCallBundleFlow() {
  const [step, setStep] = useState<BundleStep>('request');
  const fee = getFeeTier('standard');

  if (step === 'request') {
    return (
      <PopupFrame
        title="Contract call"
        footer={
          <Button fullWidth onClick={() => setStep('review')}>
            Pay the fee in sBTC
          </Button>
        }
      >
        <DetailRow label="App" value="example.app" />
        <DetailRow label="Function" value="stake-sbtc" />
        <DetailRow label="Contract" value="SP2C2Y…pool-v1" />
        <Callout variant="info" title="Not enough STX for the fee">
          The sponsor can pay the STX fee if you pay {fee.sbtcFee} in a separate transfer.
        </Callout>
      </PopupFrame>
    );
  }

  if (step === 'sent') {
    return (
      <PopupFrame
        title="Submitted"
        footer={
          <Button fullWidth variant="outline" onClick={() => setStep('request')}>
            Start over
          </Button>
        }
      >
        <DetailRow label="Fee transfer" value="Pending, nonce 12" />
        <DetailRow label="Contract call" value="Pending, nonce 13" />
        <styled.p textStyle="caption.01" color="ink.text-subdued">
          The sponsor submits both transactions together and only sponsors the call once the fee
          transfer is in the same block or earlier.
        </styled.p>
      </PopupFrame>
    );
  }

  return (
    <PopupFrame
      title="Review bundle"
      footer={
        <Button fullWidth onClick={() => setStep('sent')}>
          Sign both transactions
        </Button>
      }
    >
      <Stack gap="space.02">
        <HStack gap="space.02">
          <styled.span textStyle="label.01">1. Fee transfer</styled.span>
          <Badge label="sBTC" variant="default" />
        </HStack>
        <DetailRow label="Pays" value={fee.sbtcFee} />
        <DetailRow label="To" value="Leather sponsor" />
      </Stack>
      <Stack gap="space.02">
        <HStack gap="space.02">
          <styled.span textStyle="label.01">2. Contract call</styled.span>
          <Badge label="Sponsored" variant="info" />
        </HStack>
        <DetailRow label="Function" value="stake-sbtc" />
        <DetailRow label="Network fee" value={`${fee.stxFee}, paid by the sponsor`} />
      </Stack>
    </PopupFrame>
  );
}

export function SbtcSponsorshipFlowsPage() {
  return (
    <Stack gap="space.09" p="space.07">
      <Stack gap="space.02">
        <styled.h1 textStyle="heading.03">sBTC sponsorship flows</styled.h1>
        <styled.p textStyle="body.02" color="ink.text-subdued" maxWidth="720px">
          Extension mocks with dummy data. Nothing here sends a request.
        </styled.p>
      </Stack>
      <Grid gridTemplateColumns={{ base: '1fr', xl: '1fr 1fr' }} gap="space.09">
        <FlowSection
          title="Send sBTC with a sponsored fee"
          description="With an sBTC balance and too little STX, the fee row offers low, standard and high fees in sBTC. One transfer-many call pays the recipient and the sponsor, and the sponsor submits it."
        >
          <SponsoredSendFlow />
        </FlowSection>
        <FlowSection
          title="Planned: sponsor any contract call"
          description="A two-transaction bundle: an sBTC fee transfer to the sponsor, then the sponsored contract call."
        >
          <ContractCallBundleFlow />
        </FlowSection>
      </Grid>
    </Stack>
  );
}
