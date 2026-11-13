import { Link } from 'react-router';

import { Box, Flex, VStack, styled } from 'leather-styles/jsx';
import { Page } from '~/layouts/page/page';
import { HelpLinks } from '~/pages/developers/components/help-links';

import { Button } from '@leather.io/ui';

export function NotFound() {
  return (
    <Page>
      <Flex alignItems="center" justifyContent="center" flexDir="column" py="space.09">
        <VStack gap="space.06" alignItems="center" maxWidth="640px" textAlign="center">
          <styled.img
            src="/marketing/not-found/wrong-turn.png"
            alt=""
            width="200px"
            height="195px"
          />
          <styled.h1 textStyle="heading.04">
            Oops! Seems like
            <br />
            you took a wrong turn
          </styled.h1>
          <styled.div>
            <Link to="/">
              <Button variant="outline">Return home</Button>
            </Link>
          </styled.div>
        </VStack>
      </Flex>
      <Box mb="space.09">
        <HelpLinks />
      </Box>
    </Page>
  );
}
