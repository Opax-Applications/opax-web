import React from 'react';
import { Flex, Link, Icon, Input, IconButton, useBreakpointValue } from '@chakra-ui/react';
import Login from './access/Login';

const Header = (props) => {

  const logout = async () => {
    await props.logout();
  };

  const localLogin = async (username, password) => {
    await props.localLogin(username, password);
  };

  
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
      py="2"
      px="4"
      ml="6"
      maxWidth={400}
      alignSelf="center"
      color="gray.200"
      position="relative"
      bg="gray.800"
      borderRadius="full"
        >
          <Login server={props.server} permissions={props.permissions}
          localLogin={(u,p) => localLogin(u,p)} logout={() => logout()}/>
        </Flex>
      </Flex>
    </Flex>
  </>
  );
};

export default Header;
