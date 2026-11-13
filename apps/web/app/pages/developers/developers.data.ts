interface DeveloperGuideLink {
  label: string;
  href: string;
}

export const developerGuideLinks: DeveloperGuideLink[] = [
  { label: 'Introduction to Leather APIs', href: '/posts/api-overview' },
  { label: 'getAddresses API method', href: '/posts/api-get-addresses' },
  { label: 'Open API method', href: '/posts/api-open' },
  { label: 'sendTransfer API method', href: '/posts/api-send-transfer' },
  { label: 'signMessage API method', href: '/posts/signmessage-api-method' },
  { label: 'signPsbt API method', href: '/posts/api-sign-psbt' },
  { label: 'stx_transferStx API method', href: '/posts/api-stx-transferstx' },
  { label: 'stx_signTransaction API method', href: '/posts/api-stx-signtransaction' },
  { label: 'stx_signMessage API method', href: '/posts/api-stx-signmessage' },
  {
    label: 'stx_signStructuredMessage API method',
    href: '/posts/stx-signstructuredmessage-api-method',
  },
  { label: 'stx_deployContract API method', href: '/posts/api-stx-deploycontract' },
  { label: 'stx_callContract API method', href: '/posts/api-stx-callcontract' },
  { label: 'Stacks libraries', href: '/posts/stacks-libraries' },
];

export const developerDocsUrl = 'https://leather.gitbook.io/developers/';
