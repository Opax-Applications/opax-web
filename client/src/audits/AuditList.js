import React, { Component } from 'react';
import { Box, Flex, SimpleGrid, Text, theme } from '@chakra-ui/react';
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react';
import { Button, ButtonGroup } from "@chakra-ui/react";
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
// import Button from 'react-bootstrap/Button';
// import Table from 'react-bootstrap/Table';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from "@chakra-ui/react";
import { faTrashAlt, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import ImportButton from './ImportButton';
import Login from '../access/Login';
import Permissions from '../access/Permissions';
import ServerAPI from '../ServerAPI';


class AuditList extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      audits: null,
      username: null,
      password: null,
      error: null,
    };
  }
  
  async componentDidMount() {
    await this.getAudits();
    document.title = "Opax Monitor";
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && !prevState.error)
      document.querySelector('.alert').focus();
  }
  
  async getAudits() {
    try {
      const audits = await this.props.server.getAudits();
      this.setState({ audits });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  async localLogin(username, password) {
    await this.props.localLogin(username, password);
    this.getAudits();
  }
  
  async logout() {
    await this.props.logout();
    this.getAudits();
  }
  
  removeAudit(auditId) {
    this.props.server.removeAudit(auditId)
      .then(() => this.props.server.getAudits())
      .then((audits) => {
        this.setState({ audits });
      })
      .catch((error) => {
        this.setState({ error: "Remove audit: " + error });
      });
  }
  
  exportAudit(auditId) {
    this.props.server.exportAudit(auditId);
  }
  
  render() {
    if (!this.props.permissions)
      return null;
    let auditsHTML = null;
    const anyPermission = this.props.permissions.anyPermission();
    if (anyPermission && this.state.audits != null) {
      const sortedAudits = [...this.state.audits]
        .sort((a,b) => b.dateStarted - a.dateStarted);
      auditsHTML = sortedAudits.map(audit => (
        this.props.permissions.domainReadAllowed(audit.initialDomainName) &&
        <Tr key={audit._id}>
          <Td><Link to={'/audits/'+audit._id}>{audit.initialDomainName}</Link></Td>
          <Td>{(new Date(audit.dateStarted)).toLocaleDateString()}</Td>
          <Td isNumeric>{audit.nbCheckedURLs}</Td>
          <Td isNumeric>{audit.nbViolations}</Td>
          {this.props.permissions.domainDeleteAllowed(audit.initialDomainName) &&
            <Td>
              <Button title="Remove" variant="danger" size="xs" onClick={(e) => this.removeAudit(audit._id)}><FontAwesomeIcon icon={faTrashAlt} title="Remove" /></Button>
              {this.props.permissions.anyAuditCreateAllowed() &&
                <Button title="Export Results" variant="info" size="xs" onClick={(e) => this.exportAudit(audit._id)}><FontAwesomeIcon icon={faDownload} title="Export Results" /></Button>
              }
            </Td>
          }
        </Tr>
      ));
    }
    return (
      <>
        <Flex direction="column" h="100vh">
          <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

            <Box w="100%" mb="4">
              <Text fontSize="5xl" mb="4">Dashboard</Text>
              <HStack spacing="24px" mb="5">
               
                {!anyPermission &&
          <>
            <p>You do not currently have any permission.</p>
            {!this.props.permissions.loggedIn() &&
              <p>You might want to log in.</p>
            }
          </>
                }
                {this.props.permissions.anyAuditCreateAllowed() &&
          <>
            <LinkContainer to="/audits/create">
              <Button colorScheme="pink"
          size="lg">Start a new audit</Button>
            </LinkContainer>
            {' '}
            <ImportButton server={this.props.server} getAudits={
              () => this.getAudits()}/>
          </>
                }
                {this.props.permissions.userAndGroupEditAllowed() &&
          <>
            {' '}
            <LinkContainer to="/users/">
              <Button colorScheme="blue">Users</Button>
            </LinkContainer>
            {' '}
            <LinkContainer to="/groups/">
              <Button colorScheme="blue">Groups</Button>
            </LinkContainer>
          </>
                }
                <Login server={this.props.server} permissions={this.props.permissions}
          localLogin={(u,p) => this.localLogin(u,p)} logout={() => this.logout()}/>
              </HStack>
              {auditsHTML &&
          <Box mt="4">
            <Text fontSize="xl" mb="4">Saved Audits</Text>

            <Table colorScheme="whiteAlpha" variant="simple">
              <Thead>
                <Tr>
                  <Th>Domain</Th>
                  <Th>Date</Th>
                  <Th isNumeric>Checked URLs</Th>
                  <Th isNumeric>Violations</Th>
                  {this.props.permissions.anyAuditCreateAllowed() &&
                    <Th></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {auditsHTML}
              </Tbody>
            </Table>
          </Box>
              }
            </Box>
          </Flex>
        </Flex>
      </>
    );
  }
  
}

AuditList.propTypes = {
  permissions: PropTypes.instanceOf(Permissions),
  localLogin: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  server: PropTypes.instanceOf(ServerAPI).isRequired,
};

export default AuditList;
