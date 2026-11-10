import { useState } from 'react';

import { Flex } from 'leather-styles/jsx';

import { ListContainer, useClipboard } from '@leather.io/ui';
import { truncateMiddle } from '@leather.io/utils';

import { ClickThroughBar, useClickThrough } from '../../shared/exploration/click-through';
import { ExplorationCanvas, ExplorationRow } from '../../shared/exploration/exploration-canvas';
import { ExplorationFrame } from '../../shared/exploration/exploration-frame';
import { type ExplorationContent } from '../../shared/exploration/exploration-params';
import { AddressQr } from '../../shared/recipes/address-qr';
import { InlineInfo } from '../../shared/recipes/inline-info';
import { ListRow } from '../../shared/recipes/list-row';
import { PageActions } from '../../shared/recipes/page-actions';
import { PageHeader } from '../../shared/recipes/page-header';
import { PageNotice } from '../../shared/recipes/page-notice';
import { PopupPage } from '../../shared/recipes/popup-page';
import { ReceiveAssetIdentity } from '../../shared/recipes/receive-asset-identity';
import { ReviewSheet } from '../../shared/recipes/review-sheet';
import { SectionHeader } from '../../shared/recipes/section-header';
import { ReceiveAssetAvatar } from './receive-asset-avatar';
import {
  type ReceiveAssetFixture,
  defaultReceiveAsset,
  longReceiveAssetFixtures,
  receiveAssetFixtures,
} from './receive-example-fixtures';

const receiveSteps = [
  { id: 'choose-asset', label: 'Choose asset' },
  { id: 'address', label: 'Address' },
  { id: 'details', label: 'Address details' },
] as const;

const assetNetworks = ['Bitcoin', 'Stacks'] as const;

function assetsForContent(content: ExplorationContent) {
  return content === 'long' ? longReceiveAssetFixtures : receiveAssetFixtures;
}

interface ChooseAssetScreenProps {
  assets: readonly ReceiveAssetFixture[];
  onSelect(asset: ReceiveAssetFixture): void;
}

function ChooseAssetScreen({ assets, onSelect }: ChooseAssetScreenProps) {
  return (
    <PopupPage header={<PageHeader title="Receive" />}>
      <Flex direction="column" gap="space.04">
        {assetNetworks.map(network => (
          <Flex key={network} direction="column" gap="space.02">
            <SectionHeader title={network} />
            <ListContainer>
              {assets
                .filter(asset => asset.network === network)
                .map(asset => (
                  <ListRow
                    key={asset.id}
                    title={asset.name}
                    caption={asset.addressType}
                    leading={<ReceiveAssetAvatar avatar={asset.avatar} size="md" />}
                    onSelect={() => onSelect(asset)}
                  />
                ))}
            </ListContainer>
          </Flex>
        ))}
      </Flex>
    </PopupPage>
  );
}

interface AddressScreenProps {
  asset: ReceiveAssetFixture;
  hasCopied: boolean;
  hasCopyFailed: boolean;
  onBack(): void;
  onCopy(): void;
  onShowDetails(): void;
}

function AddressScreen({
  asset,
  hasCopied,
  hasCopyFailed,
  onBack,
  onCopy,
  onShowDetails,
}: AddressScreenProps) {
  return (
    <PopupPage
      header={<PageHeader title="Receive" onBack={onBack} />}
      footer={
        <PageActions
          primary={{ label: hasCopied ? 'Copied' : 'Copy address', onClick: onCopy }}
          secondary={{ label: 'Details', onClick: onShowDetails }}
        />
      }
    >
      <Flex direction="column" alignItems="center" gap="space.05" pt="space.02">
        <ReceiveAssetIdentity
          avatar={<ReceiveAssetAvatar avatar={asset.avatar} size="xl" />}
          name={asset.name}
          network={asset.network}
        />
        <AddressQr
          address={asset.address}
          caption={`Only send ${asset.network} network assets to this address.`}
        />
        {asset.notice ? (
          <PageNotice tone="info" title={asset.addressType}>
            {asset.notice}
          </PageNotice>
        ) : null}
        {hasCopyFailed ? (
          <PageNotice tone="error" title="Unable to copy address">
            Try again, or copy it from the address above.
          </PageNotice>
        ) : null}
        <InlineInfo>Each receive shows the same address until you add another account.</InlineInfo>
      </Flex>
    </PopupPage>
  );
}

export function ReceiveExamplePage() {
  const { current, goTo, steps } = useClickThrough(receiveSteps);
  const [selectedAsset, setSelectedAsset] = useState(defaultReceiveAsset);
  const { onCopy, hasCopied, hasCopyFailed } = useClipboard(selectedAsset.address);

  function selectAsset(asset: ReceiveAssetFixture) {
    setSelectedAsset(asset);
    goTo('address');
  }

  return (
    <ExplorationCanvas
      title="Receive example"
      description="A fixture-only Receive flow built from the recipes: choose an asset, show its address with a QR code, then review the address details in a sheet."
    >
      <ClickThroughBar steps={steps} current={current} onSelect={goTo} />
      <ExplorationRow
        title="Receive flow"
        caption="Click through the frames, or jump to a step above. Light and dark frames share the step."
      >
        <ExplorationFrame id="receive-flow" title="Receive">
          {({ content }) =>
            current === 'choose-asset' ? (
              <ChooseAssetScreen assets={assetsForContent(content)} onSelect={selectAsset} />
            ) : (
              <AddressScreen
                asset={selectedAsset}
                hasCopied={hasCopied}
                hasCopyFailed={hasCopyFailed}
                onBack={() => goTo('choose-asset')}
                onCopy={() => void onCopy()}
                onShowDetails={() => goTo('details')}
              />
            )
          }
        </ExplorationFrame>
      </ExplorationRow>
      <ReviewSheet
        isShowing={current === 'details'}
        title="Address details"
        rows={[
          { label: 'Network', value: selectedAsset.network },
          { label: 'Address type', value: selectedAsset.addressType },
          { label: 'Derivation path', value: selectedAsset.derivationPath },
          { label: 'Address', value: truncateMiddle(selectedAsset.address, 6) },
        ]}
        confirmLabel={hasCopied ? 'Copied' : 'Copy address'}
        cancelLabel="Close"
        onConfirm={() => void onCopy()}
        onClose={() => goTo('address')}
      />
    </ExplorationCanvas>
  );
}
