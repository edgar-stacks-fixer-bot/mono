import { useState } from 'react';

import { Flex } from 'leather-styles/jsx';

import {
  BtcAvatarIcon,
  Button,
  ListContainer,
  SbtcAvatarIcon,
  StxAvatarIcon,
} from '@leather.io/ui';

import { ExplorationCanvas, ExplorationRow } from '../../shared/exploration/exploration-canvas';
import { ExplorationFrame } from '../../shared/exploration/exploration-frame';
import { type ExplorationContent } from '../../shared/exploration/exploration-params';
import { AddressQr } from '../../shared/recipes/address-qr';
import { AmountDisplay } from '../../shared/recipes/amount-display';
import { InlineInfo } from '../../shared/recipes/inline-info';
import { ListRow } from '../../shared/recipes/list-row';
import { PageActions } from '../../shared/recipes/page-actions';
import { PageHeader } from '../../shared/recipes/page-header';
import { PageNotice } from '../../shared/recipes/page-notice';
import { PopupPage } from '../../shared/recipes/popup-page';
import { ReceiveAssetIdentity } from '../../shared/recipes/receive-asset-identity';
import { ReviewSheet } from '../../shared/recipes/review-sheet';
import { SectionHeader } from '../../shared/recipes/section-header';
import { TabPage } from '../../shared/recipes/tab-page';
import {
  type RecipeTokenFixture,
  longRecipeReviewRows,
  longRecipeTokenFixtures,
  recipeAddress,
  recipeReviewRows,
  recipeTokenFixtures,
} from './recipes-fixtures';

function tokensForContent(content: ExplorationContent) {
  return content === 'long' ? longRecipeTokenFixtures : recipeTokenFixtures;
}

interface TokenAvatarProps {
  token: RecipeTokenFixture;
}

function TokenAvatar({ token }: TokenAvatarProps) {
  if (token.symbol === 'BTC') return <BtcAvatarIcon size="md" />;
  if (token.symbol === 'sBTC') return <SbtcAvatarIcon size="md" />;
  return <StxAvatarIcon size="md" />;
}

interface TokenRowsProps {
  tokens: readonly RecipeTokenFixture[];
  onSelect?(token: RecipeTokenFixture): void;
}

function TokenRows({ tokens, onSelect }: TokenRowsProps) {
  return (
    <ListContainer>
      {tokens.map(token => (
        <ListRow
          key={token.id}
          title={token.name}
          caption={token.caption}
          leading={<TokenAvatar token={token} />}
          value={
            <AmountDisplay
              amount={token.amount}
              symbol={token.symbol}
              size="medium"
              align="start"
            />
          }
          valueCaption={token.fiat}
          onSelect={onSelect ? () => onSelect(token) : undefined}
        />
      ))}
    </ListContainer>
  );
}

interface ContentExampleProps {
  content: ExplorationContent;
}

function PopupPageExample({ content }: ContentExampleProps) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <PopupPage
      header={<PageHeader title="Send" onBack={() => setSelected(null)} />}
      footer={
        <PageActions
          primary={{ label: 'Continue', disabled: selected === null }}
          secondary={{ label: 'Cancel', onClick: () => setSelected(null) }}
        />
      }
    >
      <Flex direction="column" gap="space.05">
        <AmountDisplay amount="0.04812300" symbol="BTC" fiat="$4,592.18" />
        <Flex direction="column" gap="space.02">
          <SectionHeader title="Choose a token" />
          <TokenRows tokens={tokensForContent(content)} onSelect={token => setSelected(token.id)} />
        </Flex>
        <InlineInfo>Fees are estimated on the next screen.</InlineInfo>
      </Flex>
    </PopupPage>
  );
}

function AddressQrExample() {
  return (
    <PopupPage header={<PageHeader title="Receive" />}>
      <Flex direction="column" alignItems="center" gap="space.05" pt="space.02">
        <ReceiveAssetIdentity
          avatar={<BtcAvatarIcon size="xl" />}
          name="Bitcoin"
          network="Bitcoin"
        />
        <AddressQr
          address={recipeAddress}
          caption="Only send Bitcoin network assets to this address."
        />
      </Flex>
    </PopupPage>
  );
}

function PageNoticeExample() {
  return (
    <PopupPage header={<PageHeader title="Notices" />}>
      <Flex direction="column" gap="space.03">
        <PageNotice tone="info" title="Taproot address">
          Use this address for Ordinals and other inscriptions.
        </PageNotice>
        <PageNotice tone="warning" title="High fee">
          The network is busy, so this transaction costs more than usual.
        </PageNotice>
        <PageNotice tone="error" title="Unable to load balance">
          Check your connection and try again.
        </PageNotice>
        <PageNotice tone="success" title="Transaction sent" />
      </Flex>
    </PopupPage>
  );
}

function TabPageExample({ content }: ContentExampleProps) {
  return (
    <PopupPage header={<PageHeader title="Account" />}>
      <TabPage
        label="Account sections"
        tabs={[
          {
            id: 'tokens',
            label: 'Tokens',
            content: <TokenRows tokens={tokensForContent(content)} />,
          },
          {
            id: 'activity',
            label: 'Activity',
            content: <InlineInfo>No activity yet.</InlineInfo>,
          },
        ]}
      />
    </PopupPage>
  );
}

interface ReviewSheetLauncherProps {
  onOpen(): void;
}

function ReviewSheetLauncher({ onOpen }: ReviewSheetLauncherProps) {
  return (
    <PopupPage
      header={<PageHeader title="Review" />}
      footer={<PageActions primary={{ label: 'Open review sheet', onClick: onOpen }} />}
    >
      <InlineInfo>
        The review sheet opens over the page. Resize the window to 390×600 to check its footer.
      </InlineInfo>
    </PopupPage>
  );
}

export function RecipesPage() {
  const [isReviewShowing, setIsReviewShowing] = useState(false);
  const [reviewContent, setReviewContent] = useState<ExplorationContent>('default');

  function openReview(content: ExplorationContent) {
    setReviewContent(content);
    setIsReviewShowing(true);
  }

  return (
    <ExplorationCanvas
      title="Recipes"
      description="Reviewed compositions of @leather.io/ui components. Copy a recipe into a prototype instead of rebuilding it, and compare each in light, dark, narrow and long states."
    >
      <ExplorationRow title="Pages" caption="popup-page, page-header, page-actions, amount-display">
        <ExplorationFrame id="popup-page" title="Popup page">
          {({ content }) => <PopupPageExample content={content} />}
        </ExplorationFrame>
        <ExplorationFrame id="tab-page" title="Tab page">
          {({ content }) => <TabPageExample content={content} />}
        </ExplorationFrame>
      </ExplorationRow>
      <ExplorationRow title="Receive" caption="receive-asset-identity, address-qr">
        <ExplorationFrame id="address-qr" title="Address QR">
          <AddressQrExample />
        </ExplorationFrame>
      </ExplorationRow>
      <ExplorationRow title="Feedback" caption="page-notice, inline-info">
        <ExplorationFrame id="page-notice" title="Page notices">
          <PageNoticeExample />
        </ExplorationFrame>
      </ExplorationRow>
      <ExplorationRow title="Sheets" caption="review-sheet, list-row, section-header">
        <ExplorationFrame id="review-sheet" title="Review sheet">
          {({ content }) => <ReviewSheetLauncher onOpen={() => openReview(content)} />}
        </ExplorationFrame>
        <Flex direction="column" gap="space.03" alignItems="flex-start">
          <Button size="sm" variant="outline" onClick={() => openReview('default')}>
            Open review sheet
          </Button>
          <Button size="sm" variant="outline" onClick={() => openReview('long')}>
            Open long review sheet
          </Button>
        </Flex>
      </ExplorationRow>
      <ReviewSheet
        isShowing={isReviewShowing}
        title="Review details"
        summary={<AmountDisplay amount="0.00125000" symbol="BTC" fiat="$119.29" />}
        rows={reviewContent === 'long' ? longRecipeReviewRows : recipeReviewRows}
        notice={
          <PageNotice tone="warning" title="Check the address">
            Transactions can’t be reversed once they’re broadcast.
          </PageNotice>
        }
        confirmLabel="Confirm"
        onConfirm={() => setIsReviewShowing(false)}
        onClose={() => setIsReviewShowing(false)}
      />
    </ExplorationCanvas>
  );
}
