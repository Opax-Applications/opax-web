import React, { Component } from 'react';
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

import Alert from 'react-bootstrap/Alert';

import { faTrashAlt, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import ServerAPI from '../ServerAPI';
import Permissions from './Permissions';


class GroupList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      groups: null,
      error: null,
    };
  }
  
  async componentDidMount() {
    try {
      const groups = await this.props.server.getGroups();
      this.setState({ groups });
    } catch (error) {
      this.setState({ error: error.message });
    }
    document.title = "Groups";
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && !prevState.error)
      document.querySelector('.alert').focus();
  }
  
  removeGroup(groupId) {
    this.props.server.removeGroup(groupId)
      .then(() => this.props.server.getGroups())
      .then((groups) => {
        this.setState({ groups });
      })
      .catch((error) => {
        this.setState({ error: "Remove group: " + error });
      });
  }
  
  breadcrumbs() {
    return (
      <Breadcrumb mb="5">
        <BreadcrumbItem>
          <BreadcrumbLink href="/backend">Home</BreadcrumbLink>
        </BreadcrumbItem>


        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Groups</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }
  
  groupList() {
    if (this.state.groups == null)
      return null;
    const yesNoIcon = (b) =>
      (b ?
        <FontAwesomeIcon icon={faCheck} title="Yes"/>
        : <FontAwesomeIcon icon={faTimes} title="No"/>
      );
    return this.state.groups.map(group => (
      <Tr key={group._id}>
        <Td className="code"><Link to={'/groups/'+group._id}>{group.name}</Link></Td>
        <Td>{group.apiKey}</Td>
        <Td>{yesNoIcon(group.permissions.readAllAudits)}</Td>
        <Td>{yesNoIcon(group.permissions.createAllAudits)}</Td>
        <Td>{yesNoIcon(group.permissions.deleteAllAudits)}</Td>
        <Td>{yesNoIcon(group.permissions.editUsersAndGroups)}</Td>
        <Td>{group.permissions.domains.map(d => d.name).join(' ')}</Td>
        <Td className="text-right">
          <Button title="Remove" variant="danger" size="xs"
              onClick={(e) => this.removeGroup(group._id)}
              disabled={group.name === 'Guests' || group.name === 'Superusers'}>
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
          <h1>Groups</h1>
          <Alert variant="danger">
            You are not allowed to edit groups.
          </Alert>
        </>
      );
    }
    const groupsHTML = this.groupList();
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
              <LinkContainer to="/groups/create">
                <Button colorScheme="pink">Create a new group</Button>
              </LinkContainer>
              {groupsHTML &&
          <section>
            <Text fontSize="3xl" mt="5" mb="5">Groups</Text>
            <Table colorScheme="whiteAlpha" variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Api Key</Th>
                  <Th>Read all audits</Th>
                  <Th>Create new audits</Th>
                  <Th>Remove all audits</Th>
                  <Th>Edit users and groups</Th>
                  <Th>Domains</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {groupsHTML}
              </Tbody>
            </Table>
          </section>
              }
            </Box>
          </Flex>
        </Flex>
      </>
    );
  }
  
}

GroupList.propTypes = {
  permissions: PropTypes.instanceOf(Permissions),
  server: PropTypes.instanceOf(ServerAPI).isRequired,
};

export default GroupList;
