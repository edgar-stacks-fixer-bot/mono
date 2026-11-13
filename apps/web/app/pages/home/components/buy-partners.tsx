import { Flex, styled } from 'leather-styles/jsx';

import { buyPartners } from '../home.data';

export function BuyPartners() {
  return (
    <Flex
      mt="space.05"
      flexDir={['column', 'column', 'row']}
      alignItems={['flex-start', 'flex-start', 'center']}
      justifyContent="space-between"
      gap="space.05"
    >
      <styled.p textStyle="caption.01" color="ink.text-subdued" maxW="140px">
        Buy instantly through trusted partners.
      </styled.p>
      <styled.ul
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent={['flex-start', 'flex-start', 'flex-end']}
        gap={['space.05', 'space.05', 'space.09']}
        listStyle="none"
      >
        {buyPartners.map(partner => (
          <li key={partner.name}>
            <img
              src={partner.src}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              loading="lazy"
            />
          </li>
        ))}
      </styled.ul>
    </Flex>
  );
}
