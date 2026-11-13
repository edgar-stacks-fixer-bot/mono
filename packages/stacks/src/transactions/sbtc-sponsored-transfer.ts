import {
  AuthType,
  ClarityType,
  type ClarityValue,
  Pc,
  type StacksTransactionWire,
  bufferCVFromString,
  listCV,
  noneCV,
  principalCV,
  someCV,
  tupleCV,
  uintCV,
} from '@stacks/transactions';

import {
  getMemoString,
  getVerifiedSingleFungiblePostCondition,
} from './sip-10-contract-call.utils';

const sbtcContractName = 'sbtc-token';
const sbtcTransferManyFunctionName = 'transfer-many';
const sbtcSponsoredTransferEntryCount = 2;

type BaseUnitAmount = bigint | number | string;

interface BuildSbtcTransferManyArgsArgs {
  sender: string;
  recipient: string;
  amount: BaseUnitAmount;
  memo?: string;
  feeRecipient: string;
  fee: BaseUnitAmount;
}
export function buildSbtcTransferManyArgs({
  sender,
  recipient,
  amount,
  memo,
  feeRecipient,
  fee,
}: BuildSbtcTransferManyArgsArgs): ClarityValue[] {
  return [
    listCV([
      tupleCV({
        amount: uintCV(amount),
        sender: principalCV(sender),
        to: principalCV(recipient),
        memo: memo ? someCV(bufferCVFromString(memo)) : noneCV(),
      }),
      tupleCV({
        amount: uintCV(fee),
        sender: principalCV(sender),
        to: principalCV(feeRecipient),
        memo: noneCV(),
      }),
    ]),
  ];
}

interface BuildSbtcSponsoredTransferPostConditionArgs {
  sender: string;
  amount: BaseUnitAmount;
  fee: BaseUnitAmount;
  contractId: `${string}.${string}`;
  assetName: string;
}
export function buildSbtcSponsoredTransferPostCondition({
  sender,
  amount,
  fee,
  contractId,
  assetName,
}: BuildSbtcSponsoredTransferPostConditionArgs) {
  return Pc.principal(sender)
    .willSendEq(BigInt(amount) + BigInt(fee))
    .ft(contractId, assetName);
}

export interface SbtcSponsoredTransferDetails {
  contractId: string;
  assetName: string;
  sender: string;
  recipient: string;
  amount: bigint;
  memo?: string;
  feeRecipient: string;
  fee: bigint;
}

interface SbtcTransferEntry {
  amount: bigint;
  sender: string;
  to: string;
  memo?: string;
}

function getSbtcTransferEntry(value: ClarityValue): SbtcTransferEntry | null {
  if (value.type !== ClarityType.Tuple) return null;
  const { amount, sender, to, memo } = value.value;
  if (!amount || amount.type !== ClarityType.UInt) return null;
  if (!sender || sender.type !== ClarityType.PrincipalStandard) return null;
  if (!to) return null;
  if (to.type !== ClarityType.PrincipalStandard && to.type !== ClarityType.PrincipalContract)
    return null;
  if (!memo || (memo.type !== ClarityType.OptionalNone && memo.type !== ClarityType.OptionalSome))
    return null;
  return {
    amount: BigInt(amount.value),
    sender: sender.value,
    to: to.value,
    memo: getMemoString(memo),
  };
}

export function getSbtcSponsoredTransferDetails(
  tx: StacksTransactionWire
): SbtcSponsoredTransferDetails | null {
  if (tx.auth.authType !== AuthType.Sponsored) return null;
  if (!('functionName' in tx.payload)) return null;
  if (tx.payload.contractName.content !== sbtcContractName) return null;
  if (tx.payload.functionName.content !== sbtcTransferManyFunctionName) return null;
  if (tx.payload.functionArgs.length !== 1) return null;

  const [list] = tx.payload.functionArgs;
  if (list.type !== ClarityType.List) return null;
  if (list.value.length !== sbtcSponsoredTransferEntryCount) return null;

  const [transferEntry, feeEntry] = list.value.map(getSbtcTransferEntry);
  if (!transferEntry || !feeEntry) return null;
  if (transferEntry.sender !== feeEntry.sender) return null;

  const postCondition = getVerifiedSingleFungiblePostCondition(tx);
  if (!postCondition) return null;
  if (postCondition.principal !== transferEntry.sender) return null;
  if (postCondition.amount !== transferEntry.amount + feeEntry.amount) return null;

  return {
    contractId: postCondition.contractId,
    assetName: postCondition.assetName,
    sender: transferEntry.sender,
    recipient: transferEntry.to,
    amount: transferEntry.amount,
    memo: transferEntry.memo,
    feeRecipient: feeEntry.to,
    fee: feeEntry.amount,
  };
}
