import React, { Component } from 'react';

import Alert from 'react-bootstrap/Alert';
import { Box, Flex, SimpleGrid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Input, Checkbox, NumberInput, PinInput, Radio, Select, Slider, Switch, Textarea, Button, theme } from '@chakra-ui/react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';
import { Stack, HStack, VStack } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import ServerAPI from '../ServerAPI';
import Permissions from './Permissions';


class UserList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      error: null,
    };
  }
  
  async componentDidMount() {
    try {
      const users = await this.props.server.getUsers();
      this.setState({ users });
    } catch (error) {
      this.setState({ error: error.message });
    }
    document.title = "Users";
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && !prevState.error)
      document.querySelector('.alert').focus();
  }
  
  removeUser(userId) {
    this.props.server.removeUser(userId)
      .then(() => this.props.server.getUsers())
      .then((users) => {
        this.setState({ users });
      })
      .catch((error) => {
        this.setState({ error: "Remove user: " + error });
      });
  }
  
  breadcrumbs() {
    return (
      <Breadcrumb mb="5">
  <BreadcrumbItem>
    <BreadcrumbLink href="/backend">Home</BreadcrumbLink>
  </BreadcrumbItem>


  <BreadcrumbItem isCurrentPage>
    <BreadcrumbLink href="#">Users</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
    );
  }
  
  userList() {
    if (this.state.users == null)
      return null;
    return this.state.users.map(user => (
      <Tr key={user._id}>
        <Td className="code"><Link to={'/users/'+user._id}>{user.username}</Link></Td>
        <Td className="text-right">{user.firstname}</Td>
        <Td className="text-right">{user.lastname}</Td>
        <Td className="text-right">
          <Button title="Remove" variant="danger" size="xs"
              onClick={(e) => this.removeUser(user._id)}
              disabled={user._id === this.props.permissions.user._id}>
            <FontAwesomeIcon icon={faTrashAlt} title="Remove" />
          </Button>
        </Td>
      </Tr>
    ));
  }
  
  render() {
    if (this.props.permissions == null || !this.props.permissions.userAndGroupEditAllowed()) {
      return (
        <>
          {this.breadcrumbs()}
          <h1>Users</h1>
          <Alert variant="danger">
            You are not allowed to edit users.
          </Alert>
        </>
      );
    }
    const usersHTML = this.userList();
    return (
      <>
         <Flex direction="column" h="100vh">
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

              <Box w="100%" mb="4">
        {this.breadcrumbs()}
        <Alert show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
          {this.state.error}
        </Alert>
        <LinkContainer to="/users/create">
          <Button colorScheme="pink" >Create a new user</Button>
        </LinkContainer>
        {usersHTML &&
          <section>
          <Text fontSize="3xl" mt="5" mb="5">Users</Text>
            <Table colorScheme="whiteAlpha" variant="simple">
              <Thead>
                <Tr>
                  <Th>Username</Th>
                  <Th className="text-right">Firstname</Th>
                  <Th className="text-right">Lastname</Th>
                  <Th className="text-right"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {usersHTML}
              </Tbody>
            </Table>
          </section>
        }
          </Box>
          </Flex>
          </Flex>
        }
      </>
    );
  }
  
}

UserList.propTypes = {
  permissions: PropTypes.instanceOf(Permissions),
  server: PropTypes.instanceOf(ServerAPI).isRequired,
};

export default UserList;
