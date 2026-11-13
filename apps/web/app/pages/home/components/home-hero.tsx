import { useState } from 'react';

import { css } from 'leather-styles/css';
import { Box, Flex, styled } from 'leather-styles/jsx';

import { downloadLinks, heroWords, homeAsset } from '../home.data';

const heroWordDelayMs = 80;

const heroImages = {
  default: {
    desktop: homeAsset('images/hero-desktop.png'),
    mobile: homeAsset('images/hero-mobile.png'),
  },
  alternate: {
    desktop: homeAsset('images/hero-desktop-alt.png'),
    mobile: homeAsset('images/hero-mobile-alt.png'),
  },
};

export function HomeHero() {
  const [showAlternate, setShowAlternate] = useState(false);
  const images = showAlternate ? heroImages.alternate : heroImages.default;

  return (
    <styled.section pt={['space.06', 'space.06', 'space.09']}>
      <Flex
        flexDir={['column', 'column', 'column', 'row']}
        gap={['space.06', 'space.06', 'space.07']}
        justifyContent="space-between"
      >
        <styled.h1
          textStyle="display.02"
          fontSize={['3rem', '3.5rem', '4rem', '4.5rem']}
          lineHeight={['2.75rem', '3.25rem', '3.75rem', '4rem']}
          color="ink.text-primary"
          maxW="520px"
        >
          {heroWords.map((word, index) => (
            <styled.span
              key={word}
              display="inline-block"
              mr="0.2em"
              _motionSafe={{ animation: 'slideUpAndFade 0.6s ease both' }}
              style={{ animationDelay: `${index * heroWordDelayMs}ms` }}
            >
              {word}
            </styled.span>
          ))}
        </styled.h1>
        <Box maxW="540px">
          <styled.p textStyle={['label.01', 'label.01', 'heading.05']} color="ink.text-primary">
            Leather is a wallet for Bitcoin and Stacks, designed for security, clarity, and growth.
            Join 100,000+ users on your favorite platform.
          </styled.p>
          <Flex gap="space.03" mt="space.05" flexWrap="wrap">
            {downloadLinks.map(link => (
              <styled.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                display="inline-flex"
                alignItems="center"
                gap="space.02"
                height="48px"
                px="space.04"
                border="1px solid"
                borderColor="ink.border-default"
                borderRadius="round"
                textStyle="label.02"
                color="ink.text-primary"
                transition="background-color 0.2s"
                _hover={{ bg: 'ink.component-background-hover' }}
              >
                <img src={link.icon} alt="" width={24} height={24} />
                {link.label}
              </styled.a>
            ))}
          </Flex>
        </Box>
      </Flex>

      <Box
        position="relative"
        mt={['space.07', 'space.07', 'space.09']}
        bg="ink.background-secondary"
        borderRadius="md"
        overflow="hidden"
        pt={['space.07', 'space.07', 'space.09']}
        px={['space.05', 'space.05', 'space.09']}
      >
        <styled.button
          type="button"
          aria-pressed={showAlternate}
          aria-label="Switch wallet theme"
          onClick={() => setShowAlternate(value => !value)}
          position="absolute"
          top="space.04"
          right="space.04"
          width="44px"
          height="24px"
          borderRadius="round"
          bg={showAlternate ? 'ink.text-primary' : 'ink.border-default'}
          transition="background-color 0.2s"
          cursor="pointer"
          zIndex={1}
        >
          <styled.span
            display="block"
            width="20px"
            height="20px"
            borderRadius="round"
            bg="ink.background-primary"
            transition="transform 0.2s"
            style={{ transform: `translateX(${showAlternate ? 22 : 2}px)` }}
          />
        </styled.button>
        <picture>
          <source media="(min-width: 768px)" srcSet={images.desktop} width={2140} height={1142} />
          <img
            src={images.mobile}
            alt="The Leather wallet on desktop and mobile, showing balances and tokens"
            width={412}
            height={846}
            className={css({
              display: 'block',
              width: '100%',
              maxW: ['320px', '320px', '100%'],
              height: 'auto',
              mx: 'auto',
            })}
          />
        </picture>
      </Box>
    </styled.section>
  );
}
