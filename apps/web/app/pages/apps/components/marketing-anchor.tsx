import { Link } from 'react-router';

import { type HTMLStyledProps, styled } from 'leather-styles/jsx';

const StyledRouterLink = styled(Link);

interface MarketingAnchorProps extends HTMLStyledProps<'a'> {
  href: string;
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

export function MarketingAnchor({ href, ...props }: MarketingAnchorProps) {
  if (isExternalHref(href))
    return <styled.a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  return <StyledRouterLink to={href} {...props} />;
}
