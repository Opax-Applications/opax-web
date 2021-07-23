import React, { Component } from 'react';


import { Box, Alert, Flex, Heading, SimpleGrid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Input, Checkbox, NumberInput, PinInput, Radio, Select, Slider, Switch, Textarea, Button, theme } from '@chakra-ui/react';
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


import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import ServerAPI from '../ServerAPI';
import Permissions from './Permissions';


class User extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      user: {
        _id: this.props.match.params.userId,
        username: '',
        firstname: '',
        lastname: '',
        password: '',
      },
      error: null,
      success: null,
      allGroups: null,
      groupsToAdd: null,
      selectedGroup: null,
    };
  }
  
  async componentDidMount() {
    try {
      if (this.state.user._id != null) {
        const user = await this.props.server.getUser(this.state.user._id);
        user.password = '';
        this.setState({ user });
      }
      const allGroups = await this.props.server.getGroups();
      this.setState({ allGroups });
      if (this.state.user.groups != null)
        this.updateGroupsToAdd();
    } catch (error) {
      this.setState({ error: error.message });
    }
    if (this.state.user._id == null)
      document.title = "New User";
    else
      document.title = this.state.user.username ?
        "User: " + this.state.user.username: "User";
    if (this.state.user.username === '')
      document.getElementById('username').focus();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if ((this.state.error && !prevState.error) || (this.state.success && !prevState.success))
    return;
      // document.querySelector('.alert').focus();
  }
  
  updateGroupsToAdd() {
    const groupsToAdd = this.state.allGroups
      .filter((g) => g.name !== 'Guests' && g.name !== 'Authenticated' &&
        !this.state.user.groups.some((g2) => g2._id === g._id));
    this.setState({
      groupsToAdd,
      selectedGroup: groupsToAdd.length === 0 ? '' : groupsToAdd[0]._id
    });
  }
  
  handleUserChange(event) {
    const target = event.target;
    this.setState({
      user: {
        ...this.state.user,
        [target.name]: target.value
      }
    });
  }
  
  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }
  
  async removeUser() {
    try {
      await this.props.server.removeUser(this.state.user._id);
      this.props.history.push('/users/');
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  async saveUser() {
    try {
      let user = null;
      if (this.state.user._id) {
        await this.props.server.updateUser(this.state.user);
      } else {
        user = await this.props.server.createUser(this.state.user);
        user.password = '';
        this.setState({ user });
        this.updateGroupsToAdd();
      }
      this.setState({ success: "The user was successfully saved." });
      document.title = this.state.user.username ?
        "User: " + this.state.user.username: "User";
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  async removeGroup(groupId) {
    try {
      await this.props.server.removeUserGroup(this.state.user._id, groupId);
      const user = await this.props.server.getUser(this.state.user._id);
      user.password = '';
      this.setState({ user });
      this.updateGroupsToAdd();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  breadcrumbs() {
    return (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={'/users/'}>Users</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink current href={'#'}>{this.state.user.username}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }
  
  userGroupList() {
    if (this.state.user.groups == null)
      return null;
    return this.state.user.groups.map(group => (
      <tr key={group._id}>
        <td className="code"><Link to={'/groups/'+group._id}>{group.name}</Link></td>
        <td className="text-right">
          <Button  mb="5" mt="5" colorScheme="blue"
          size="md"
              onClick={(e) => this.removeGroup(group._id)}>
            <FontAwesomeIcon icon={faTrashAlt} title="Remove" />
          </Button>
        </td>
      </tr>
    ));
  }
  
  async addGroup() {
    try {
      await this.props.server.addUserGroup(this.state.user._id,
        this.state.selectedGroup);
      const user = await this.props.server.getUser(this.state.user._id);
      user.password = '';
      this.setState({ user });
      this.updateGroupsToAdd();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  render() {
    if (this.props.permissions == null || !this.props.permissions.userAndGroupEditAllowed()) {
      return (
        <>
          {this.breadcrumbs()}
          <h1>User</h1>
          <Alert variant="danger">
            You are not allowed to edit users.
          </Alert>
        </>
      );
    }
    const groupsHTML = this.userGroupList();
    return (
      <>
        <Flex direction="column" h="100vh">
          <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

            <Box w="100%" mb="4">
              {this.breadcrumbs()}
              <Text mt="5" isTruncated fontSize="5xl">{this.state.user._id ? "User: " + this.state.user.username : "New User"}</Text>

              <Alert show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
                {this.state.error}
              </Alert>
              <Alert show={this.state.success != null} variant="success" dismissible
            onClose={() => this.setState({ success: null })} tabIndex="0">
                {this.state.success}
              </Alert>
              {this.state.user._id != null &&
          <Button  mb="5"  colorScheme="blue"
          size="md"nClick={(e) => this.removeUser()}
              disabled={this.state.user._id === this.props.permissions.user._id}>
            Remove user
          </Button>
              }
              <Form onSubmit={e => { e.preventDefault(); this.saveUser(); } } className="form mt-3 border">
                <Stack spacing={5}>
                  <FormControl id="username">
                    <FormLabel>Username</FormLabel>
                    <Input name="username" type="text" value={this.state.user.username}
                  required onChange={e => this.handleUserChange(e)}/>
                  </FormControl>
                  <FormControl id="firstname">
                    <FormLabel>First name</FormLabel>
                    <Input name="firstname" type="text" value={this.state.user.firstname}
                  onChange={e => this.handleUserChange(e)}/>
                  </FormControl>
                  <FormControl id="lastname">
                    <FormLabel>Last name</FormLabel>
                    <Input name="lastname" type="text" value={this.state.user.lastname}
                  onChange={e => this.handleUserChange(e)}/>
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input name="password" type="password"
                  value={this.state.user.password}
                  onChange={e => this.handleUserChange(e)}
                  required={this.state.user._id == null}
                    />
                  </FormControl>
                  <div className="text-center">
                    <Button colorScheme="pink"
          size="lg" mt="5" mb="5" type="submit">
                Save
                    </Button>
                  </div>
                </Stack>
              </Form>
              {groupsHTML &&
            <section className="border">
                      <Text mt="5" isTruncated fontSize="2xl">Groups</Text>

            <Table colorScheme="whiteAlpha" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {groupsHTML}
                </Tbody>
              </Table>
              {this.state.groupsToAdd && this.state.groupsToAdd.length > 0 &&
                <Form onSubmit={e => { e.preventDefault(); this.addGroup(); } } inline>
                  <FormControl id="selectedGroup">
                    <FormLabel className="mr-1">Add a group:</FormLabel>
                    <Select name="selectedGroup" as="select" value={this.state.selectedGroup}
                        onChange={e => this.handleChange(e)}>
                      {this.state.groupsToAdd
                        .map((g) =>
                          <option key={g._id} value={g._id}>{g.name}</option>
                        )}
                    </Select>
                  </FormControl>
                  <Button colorScheme="pink"
          size="lg" mt="5" mb="5" type="submit">
                    Add
                  </Button>
                </Form>
              }
            </section>
              }
            </Box>
          </Flex>
        </Flex>
      </>
    );
  }
  
}

User.propTypes = {
  permissions: PropTypes.instanceOf(Permissions),
  server: PropTypes.instanceOf(ServerAPI).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string, // this initial user id can be undefined for a new user
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default User;
