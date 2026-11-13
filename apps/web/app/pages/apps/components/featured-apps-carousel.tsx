import { useRef } from 'react';

import { Box, Flex, styled } from 'leather-styles/jsx';

import { ArrowTopRightIcon, ChevronLeftIcon, ChevronRightIcon, IconButton } from '@leather.io/ui';

import { type FeaturedApp } from '../apps.data';
import { MarketingAnchor } from './marketing-anchor';

interface FeaturedAppCardProps {
  app: FeaturedApp;
}
function FeaturedAppCard({ app }: FeaturedAppCardProps) {
  return (
    <MarketingAnchor
      href={app.href}
      position="relative"
      display="flex"
      flexDir="column"
      justifyContent="flex-end"
      flexShrink={0}
      width={['85%', '300px']}
      aspectRatio="1 / 1"
      overflow="hidden"
      bg="black"
      color="white"
      scrollSnapAlign="start"
      className="group"
    >
      <styled.img
        src={app.imageSrc}
        alt=""
        width="1024px"
        height="512px"
        position="absolute"
        inset={0}
        w="100%"
        h="100%"
        objectFit="cover"
        transition="transform 0.3s ease"
        _groupHover={{ transform: 'scale(1.03)' }}
        _motionReduce={{ transition: 'none', _groupHover: { transform: 'none' } }}
      />
      <Box
        position="relative"
        p="space.05"
        background="linear-gradient(to top, rgba(0, 0, 0, 0.9) 60%, transparent)"
      >
        <styled.img
          src={app.logoSrc}
          alt=""
          width="40px"
          height="40px"
          borderRadius="round"
          mb="space.03"
        />
        <styled.h3 textStyle="label.01">{app.name}</styled.h3>
        <Flex alignItems="flex-end" gap="space.04" mt="space.02">
          <styled.p textStyle="caption.01" flex={1}>
            {app.description}
          </styled.p>
          <ArrowTopRightIcon variant="small" color="ink.background-primary" />
        </Flex>
      </Box>
    </MarketingAnchor>
  );
}

interface FeaturedAppsCarouselProps {
  apps: FeaturedApp[];
}
export function FeaturedAppsCarousel({ apps }: FeaturedAppsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByPage(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: 'smooth' });
  }

  return (
    <Box position="relative">
      <Flex
        ref={scrollerRef}
        gap="space.03"
        overflowX="auto"
        scrollSnapType="x mandatory"
        scrollbarWidth="none"
        _motionReduce={{ scrollBehavior: 'auto' }}
      >
        {apps.map(app => (
          <FeaturedAppCard key={app.name} app={app} />
        ))}
      </Flex>
      <Flex justifyContent="flex-end" gap="space.02" mt="space.03">
        <IconButton
          variant="ghost"
          icon={<ChevronLeftIcon variant="small" />}
          aria-label="Previous apps"
          onClick={() => scrollByPage(-1)}
        />
        <IconButton
          variant="ghost"
          icon={<ChevronRightIcon variant="small" />}
          aria-label="Next apps"
          onClick={() => scrollByPage(1)}
        />
      </Flex>
    </Box>
  );
}
