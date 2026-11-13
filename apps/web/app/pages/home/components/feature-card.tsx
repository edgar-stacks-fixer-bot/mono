import { type ReactNode } from 'react';

import { Flex, type FlexProps, styled } from 'leather-styles/jsx';

type FeaturePlatform = 'Mobile' | 'Extension';

interface FeatureCardProps extends Omit<FlexProps, 'title'> {
  title: string;
  description: string;
  platform?: FeaturePlatform;
  media: ReactNode;
}

export function FeatureCard({ title, description, platform, media, ...props }: FeatureCardProps) {
  return (
    <Flex
      flexDir="column"
      bg="ink.background-secondary"
      borderRadius="md"
      overflow="hidden"
      transition="transform 0.3s ease"
      _motionSafe={{ _hover: { transform: 'translateY(-4px)' } }}
      {...props}
    >
      <Flex
        position="relative"
        flex={1}
        alignItems="center"
        justifyContent="center"
        px="space.05"
        pt="space.05"
      >
        {media}
      </Flex>
      <styled.div p={['space.05', 'space.05', 'space.06']} pt="space.04">
        <Flex alignItems="center" gap="space.02" flexWrap="wrap" mb="space.02">
          <styled.h3 textStyle="heading.05" color="ink.text-primary">
            {title}
          </styled.h3>
          {platform && (
            <styled.span
              textStyle="caption.01"
              color="ink.text-subdued"
              border="1px solid"
              borderColor="ink.border-default"
              borderRadius="round"
              px="space.02"
              py="1px"
            >
              {platform}
            </styled.span>
          )}
        </Flex>
        <styled.p textStyle="body.02" color="ink.text-subdued">
          {description}
        </styled.p>
      </styled.div>
    </Flex>
  );
}
