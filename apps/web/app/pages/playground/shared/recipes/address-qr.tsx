import QRCode from 'react-qr-code';

import { Box, Flex } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';
import { CopyAddress } from '~/components/copy-address';

import { Caption } from '@leather.io/ui';

const qrSize = 168;

interface AddressQrProps {
  address: string;
  caption?: string;
}

export function AddressQr({ address, caption }: AddressQrProps) {
  return (
    <Flex direction="column" alignItems="center" gap="space.04" width="100%">
      <Box
        p="space.04"
        borderRadius="md"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="ink.border-transparent"
        bg="ink.background-primary"
        role="img"
        aria-label={`QR code for ${address}`}
      >
        <QRCode
          bgColor={token('colors.ink.background-primary')}
          fgColor={token('colors.ink.text-primary')}
          size={qrSize}
          style={{ height: 'auto', maxWidth: '100%', width: qrSize }}
          value={address}
          viewBox={`0 0 ${qrSize} ${qrSize}`}
        />
      </Box>
      <Box maxWidth="260px" textAlign="center">
        <CopyAddress addr={address} grouped />
      </Box>
      {caption ? <Caption textAlign="center">{caption}</Caption> : null}
    </Flex>
  );
}
