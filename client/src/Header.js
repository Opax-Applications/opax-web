import React from 'react';
import { Flex, Icon, Input, IconButton, useBreakpointValue } from '@chakra-ui/react';

const Header = () => {

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  return (<>
    <Flex
      as="header"
      w="100%"
      maxWidth={1480}
      h="20"
      mx="auto"
      mt="4"
      px="6"
      align="center"
    >
      <a href="/">
        <img alt="Opax" src="/logo-white.svg" width="150" />
      </a>
      <Flex align="center" ml="auto">
        <Flex
      as="label"
      flex="1"
      py="4"
      px="8"
      ml="6"
      maxWidth={400}
      alignSelf="center"
      color="gray.200"
      position="relative"
      bg="gray.800"
      borderRadius="full"
        >
          <Input
        color="gray.50"
        variant="unstyled"
        px="4"
        mr="4"
        placeholder="Search..."
        _placeholder={{ color: 'gray.400' }}
          />

        </Flex>
      </Flex>
    </Flex>
  </>
  );
};

export default Header;
