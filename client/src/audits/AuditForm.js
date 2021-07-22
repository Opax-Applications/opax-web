import React from 'react';
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
// import Breadcrumb from 'react-bootstrap/Breadcrumb';
// import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { LinkContainer } from 'react-router-bootstrap';

import PropTypes from 'prop-types';

import ServerAPI from '../ServerAPI';
import Permissions from '../access/Permissions';
import './AuditForm.css';


class AuditForm extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      firstURL: '',
      standard: 'wcag2aa',
      checkSubdomains: true,
      maxDepth: 1,
      maxPagesPerDomain: 0,
      sitemaps: false,
      includeMatch: '',
      browser: 'firefox',
      postLoadingDelay: 0,
      auditId: null,
    };
    this.checkDelay = 1000;
    this.checkInterval = null;
  }
  
  componentDidMount() {
    document.title = "New Accessibility Audit";
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && !prevState.error)
      document.querySelector('.alert').focus();
  }
  
  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked :
      (target.type === 'number' ? parseInt(target.value) : target.value);
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  
  async startAudit() {
    this.setState({ error: null });
    try {
      const params = {
        firstURL: this.state.firstURL,
        standard: this.state.standard,
        checkSubdomains: this.state.checkSubdomains,
        maxDepth: this.state.maxDepth,
        maxPagesPerDomain: this.state.maxPagesPerDomain,
        sitemaps: this.state.sitemaps,
        includeMatch: this.state.includeMatch,
        browser: this.state.browser,
        postLoadingDelay: this.state.postLoadingDelay,
      };
      const audit = await this.props.server.startAudit(params);
      this.props.history.push('/audits/' + audit.id + '/status');
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  render() {
    if (!this.props.permissions || !this.props.permissions.anyAuditCreateAllowed())
      return <p>You are not allowed to create new audits.</p>;
    return (
      <>
        <Flex direction="column" h="100vh">
          <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

            <Box w="100%" mb="4">
            <Breadcrumb mb="5">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {this.state.page &&
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={'/audits/'}>Audit</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>Start a new audit</BreadcrumbItem>
            </>
                }
              </Breadcrumb>
              <Text fontSize="5xl" mb="4">Start A New Audit</Text>
              
            
              <Alert show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
                {this.state.error}
              </Alert>
              <Box w="50%" mb="4">

                <Form onSubmit={e => { e.preventDefault(); this.startAudit(); } }>
                  <Stack spacing={5}>

                    <FormControl id="firstURL">
                      <FormLabel column sm="5">Initial URL</FormLabel>
                      <Input name="firstURL" type="url" value={this.state.firstURL}
                onChange={e => this.handleChange(e)}/>
                    </FormControl>
                    <FormControl id="standard">
                      <FormLabel column sm="5">Standard</FormLabel>
                      <Select name="standard" value={this.state.standard}
                  onChange={e => this.handleChange(e)}>
                        <option value="wcag2a">WCAG 2.0 Level A</option>
                        <option value="wcag2aa">WCAG 2.0 Level AA</option>
                        <option value="wcag21aa">WCAG 2.1 Level AA</option>
                        <option value="section508">Section 508</option>
                      </Select>
                    </FormControl>
                    <FormControl id="checkSubdomains">
                      <Checkbox name="checkSubdomains" type="checkbox" value={this.state.checkSubdomains}
                onChange={e => this.handleChange(e)} checked={this.state.checkSubdomains}
                      >Check subdomains</Checkbox>
                    </FormControl>
                    <FormControl id="maxDepth">
                      <FormLabel column sm="5">Maximum crawling depth</FormLabel>
                      <Input name="maxDepth" type="number" value={this.state.maxDepth}
                onChange={e => this.handleChange(e)}/>
                    </FormControl>
                    <FormControl id="maxPagesPerDomain">
                      <FormLabel column sm="5">Maximum number of pages checked per domain (0 for no limit)</FormLabel>
                      <Input name="maxPagesPerDomain" type="number" value={this.state.maxPagesPerDomain}
                onChange={e => this.handleChange(e)}/>
                    </FormControl>
                    <FormControl id="sitemaps">
                      <Checkbox name="sitemaps" type="checkbox" value={this.state.sitemaps}
                onChange={e => this.handleChange(e)} checked={this.state.sitemaps}>Use site maps to discover pages</Checkbox>
                    </FormControl>
                    <FormControl id="includeMatch">
                      <FormLabel column sm="5">Include only paths matching the regular
              expression</FormLabel>
                      <Input name="includeMatch" value={this.state.includeMatch}
                onChange={e => this.handleChange(e)}/>
                    </FormControl>
                    <FormControl id="browser">
                      <FormLabel column sm="5">Browser</FormLabel>
                      <Select name="browser" value={this.state.browser}
                  onChange={e => this.handleChange(e)}>
                        <option value="firefox">Firefox</option>
                        <option value="chrome">Chromium</option>
                      </Select>
                    </FormControl>
                    <FormControl id="postLoadingDelay">
                      <FormLabel column sm="5">Additional delay to let dynamic pages load (ms)</FormLabel>
                      <Input name="postLoadingDelay" type="number" value={this.state.postLoadingDelay}
                onChange={e => this.handleChange(e)}/>
                    </FormControl>
                    <Button mt="5" colorScheme="pink"
          size="lg" type="submit">
              Start Audit
                    </Button>
                  </Stack>
                </Form>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </>
    );
  }
  
}

AuditForm.propTypes = {
  permissions: PropTypes.instanceOf(Permissions),
  server: PropTypes.instanceOf(ServerAPI).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default AuditForm;
