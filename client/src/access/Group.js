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

import Form from 'react-bootstrap/Form';

import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import ServerAPI from '../ServerAPI';
import Permissions from './Permissions';


class Group extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      group: {
        _id: this.props.match.params.groupId,
        name: '',
        apiKey: '',
        permissions: {
          createAllAudits: false,
          readAllAudits: true,
          deleteAllAudits: false,
          editUsersAndGroups: false,
          domains: [/*{
            name: String,
            read: Boolean,
            delete: Boolean,
            create: Boolean,
          }*/],
        },
      },
      error: null,
      success: null,
      allUsers: null,
      usersToAdd: null,
      selectedUser: null,
    };
  }
  
  async componentDidMount() {
    try {
      if (this.state.group._id != null) {
        const group = await this.props.server.getGroup(this.state.group._id);
        this.setState({ group });
      }
      const allUsers = await this.props.server.getUsers();
      this.setState({ allUsers });
      if (this.state.group.users != null)
        this.updateUsersToAdd();
    } catch (error) {
      this.setState({ error: error.message });
    }
    if (this.state.group._id == null)
      document.title = "New Group";
    else
      document.title = this.state.group.name ?
        "Group: " + this.state.group.name: "Group";
    if (this.state.group.name === '')
      document.getElementById('name').focus();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if ((this.state.error && !prevState.error) || (this.state.success && !prevState.success))
      // document.querySelector('.alert').focus();
      return;
  }
  
  updateUsersToAdd() {
    const usersToAdd = this.state.allUsers
      .filter((u) => !this.state.group.users.some((u2) => u2._id === u._id));
    this.setState({
      usersToAdd,
      selectedUser: usersToAdd.length === 0 ? '' : usersToAdd[0]._id,
    });
  }
  
  handleGroupChange(event) {
    const target = event.target;
    this.setState({
      group: {
        ...this.state.group,
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
  
  handlePermissionChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      group: {
        ...this.state.group,
        permissions: {
          ...this.state.group.permissions,
          [name]: value
        }
      }
    });
  }
  
  handleDomainChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name_parts = target.id.split('_', 3);
    const index = parseInt(name_parts[1]);
    const property = name_parts[2];
    const domains = this.state.group.permissions.domains.map((d, i) => {
      if (i !== index)
        return d;
      return {
        ...d,
        [property]: value,
      };
    });
    this.setState({
      group: {
        ...this.state.group,
        permissions: {
          ...this.state.group.permissions,
          domains: domains,
        }
      }
    });
  }
  
  async removeGroup() {
    try {
      await this.props.server.removeGroup(this.state.group._id);
      this.props.history.push('/groups/');
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  async saveGroup() {
    try {
      let group = null;
      if (this.state.group._id) {
        await this.props.server.updateGroup(this.state.group);
      } else {
        group = await this.props.server.createGroup(this.state.group);
        this.setState({ group });
        this.updateUsersToAdd();
      }
      this.setState({ success: "The group was successfully saved." });
      document.title = this.state.group.name ?
        "Group: " + this.state.group.name: "Group";
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  async removeUser(userId) {
    try {
      await this.props.server.removeGroupUser(this.state.group._id, userId);
      const group = await this.props.server.getGroup(this.state.group._id);
      this.setState({ group });
      this.updateUsersToAdd();
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
          <BreadcrumbLink href={'/groups/'}>Groups</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink current href={'#'}>{this.state.group.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }
  
  groupUserList() {
    if (this.state.group.users == null || this.state.group.name === 'Guests' ||
        this.state.group.name === 'Authenticated')
      return null;
    return this.state.group.users.map(user => (
      <Tr key={user._id}>
        <Td><Link to={'/users/'+user._id}>{user.username}</Link></Td>
        <Td>
          <Button title="Remove" variant="danger" size="xs"
              onClick={(e) => this.removeUser(user._id)}>
            <FontAwesomeIcon icon={faTrashAlt} title="Remove" />
          </Button>
        </Td>
      </Tr>
    ));
  }
  
  async addUser() {
    try {
      await this.props.server.addGroupUser(this.state.group._id,
        this.state.selectedUser);
      const group = await this.props.server.getGroup(this.state.group._id);
      this.setState({ group });
      this.updateUsersToAdd();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  addDomain() {
    const index = this.state.group.permissions.domains.length;
    this.setState({
      group: {
        ...this.state.group,
        permissions: {
          ...this.state.group.permissions,
          domains: [
            ...this.state.group.permissions.domains,
            {
              name: '',
              create: false,
              read: true,
              delete: false,
            }
          ]
        }
      }
    },
    () => document.querySelector(`input[id='domain_${index}_name']`).focus()
    );
  }
  
  removeDomain(index) {
    this.setState({
      group: {
        ...this.state.group,
        permissions: {
          ...this.state.group.permissions,
          domains: this.state.group.permissions.domains.filter((d, i) => i !== index),
        }
      }
    });
  }
  
  render() {
    if (this.props.permissions == null || !this.props.permissions.userAndGroupEditAllowed()) {
      return (
        <>
          {this.breadcrumbs()}
          <h1>Group</h1>
          <Alert mb="5" color={"#444"} status="info" variant="subtle">
            You are not allowed to edit groups.
          </Alert>
        </>
      );
    }
    const usersHTML = this.groupUserList();
    return (
      <>
        <Flex direction="column" h="100vh">
          <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

            <Box w="100%" mb="4">
              {this.breadcrumbs()}
              <Text mt="5" mb="5" isTruncated fontSize="5xl">{this.state.group._id ? "Group: " + this.state.group.name : "New Group"}</Text>

              <Alert mb="5" color={"#fff"} status="warning"
 show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
                {this.state.error}
              </Alert>
              <Alert show={this.state.success != null} variant="success" dismissible
            onClose={() => this.setState({ success: null })} tabIndex="0">
                {this.state.success}
              </Alert>

              <Form onSubmit={e => { e.preventDefault(); this.saveGroup(); } } className="form mt-3 border">
                <Stack spacing={5}>
                  <FormControl id="name">
                    <FormLabel column sm="5">Group Name</FormLabel>
                    <Input name="name" type="text"
              value={this.state.group.name} style={{ width:'auto' }}
              required onChange={e => this.handleGroupChange(e)}/>
                  </FormControl>
                  <FormControl id="apiKey">
                    <FormLabel>Group api key</FormLabel>
                    <Input name="apiKey" type="text" size="50"
                                  value={this.state.group.apiKey} style={{ width:'auto' }}
                           onChange={e => this.handleGroupChange(e)}/>
                  </FormControl>
                  <FormControl id="createAllAudits">
                    <Checkbox name="createAllAudits" type="checkbox"
              value={this.state.group.permissions.createAllAudits}
              onChange={e => this.handlePermissionChange(e)}
              checked={this.state.group.permissions.createAllAudits}>Create any audit</Checkbox>
                  </FormControl>
                  <FormControl id="readAllAudits">
                    <Checkbox name="readAllAudits" type="checkbox"
              value={this.state.group.permissions.readAllAudits}
              onChange={e => this.handlePermissionChange(e)}
              checked={this.state.group.permissions.readAllAudits}
                    >Read all audits</Checkbox>
                  </FormControl>
                  <FormControl id="deleteAllAudits">
                    <Checkbox name="deleteAllAudits" type="checkbox"
              value={this.state.group.permissions.deleteAllAudits}
              onChange={e => this.handlePermissionChange(e)}
              checked={this.state.group.permissions.deleteAllAudits}
              disabled={this.state.group.name === 'Guests'}
                    >Delete all audits</Checkbox>
                  </FormControl>
                  <FormControl id="editUsersAndGroups">
                    <Checkbox name="editUsersAndGroups" type="checkbox"
              value={this.state.group.permissions.editUsersAndGroups}
              onChange={e => this.handlePermissionChange(e)}
              checked={this.state.group.permissions.editUsersAndGroups}
              disabled={this.state.group.name === 'Guests'}
                    >Edit users and groups</Checkbox>
                  </FormControl>
                  <section>
                    <Text fontSize="3xl" mt="5" mb="0">Domains</Text>
                    {this.state.group.permissions.domains.length > 0 ?
                      <Table mt="5" id="domains" colorScheme="whiteAlpha" variant="simple">
                        <Thead>
                          <Tr><Th id="dname">Domain Name</Th><th>Create</th><th>Read</th><th>Delete</th><th></th></Tr>
                        </Thead>
                        <Tbody>
                          {this.state.group.permissions.domains.map((d, index) =>
                            <Tr key={index}>
                              <Td>
                                <FormControl>

                                  <Input id={`domain_${index}_name`} type="text"
                         value={d.name} required aria-labelledby="dname"
                        onChange={e => this.handleDomainChange(e)}/></FormControl>
                              </Td>
                              <Td><Checkbox id={`domain_${index}_create`} type="checkbox"
                        value={d.create} onChange={e => this.handleDomainChange(e)}
                        checked={d.create} label="Create"/></Td>
                              <Td><Checkbox id={`domain_${index}_read`} type="checkbox"
                        value={d.read} onChange={e => this.handleDomainChange(e)}
                        checked={d.read} label="Read"/></Td>
                              <Td><Checkbox id={`domain_${index}_delete`} type="checkbox"
                        value={d.delete} onChange={e => this.handleDomainChange(e)}
                        checked={d.delete} label="Delete"/></Td>
                              <Td><Button title="Remove" variant="danger" size="xs"
                        onClick={(e) => this.removeDomain(index)}>
                                <FontAwesomeIcon icon={faTrashAlt} title="Remove" />
                              </Button></Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                      :
                      <p>No domain-specific rule.</p>
                    }
                    <Button colorScheme="pink"
          size="lg" mt="5" mb="5"
                onClick={e => this.addDomain()}>
              Add a domain
                    </Button>
                  </section>
                  <div className="text-center">
                    <Button Button mb="5" mr="5" mt="5" colorScheme="pink"
          size="lg" type="submit">
              Save
                    </Button>
                    {this.state.group._id != null &&
          <Button mb="5" mt="5" colorScheme="blue"
          size="md" onClick={(e) => this.removeGroup()}>Remove group</Button>
                    }
                  </div>
                </Stack>
              </Form>
              {usersHTML &&
          <section className="border">
            <Text mt="5" mb="5" isTruncated fontSize="4xl">Users in this group</Text>
            <Table colorScheme="whiteAlpha" variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {usersHTML}
              </Tbody>
            </Table>
            {this.state.usersToAdd && this.state.usersToAdd.length > 0 &&
              <Form onSubmit={e => { e.preventDefault(); this.addUser(); } } inline>
                <FormControl id="selectedUser">
                  <FormLabel className="mr-1">Add a user:</FormLabel>
                  <Input name="selectedUser" as="select" value={this.state.selectedUser}
                      onChange={e => this.handleChange(e)}>
                    {this.state.usersToAdd
                      .map((u) =>
                        <option key={u._id} value={u._id}>{u.username}</option>
                      )}
                  </Input>
                </FormControl>
                <Button colorScheme="pink"
          size="lg" mt="5" mb="5">
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

Group.propTypes = {
  permissions: PropTypes.instanceOf(Permissions),
  server: PropTypes.instanceOf(ServerAPI).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      groupId: PropTypes.string, // this initial group id can be undefined for a new group
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default Group;
