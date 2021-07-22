import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Box, Flex, useColorModeValue, SimpleGrid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Input, Checkbox, NumberInput, PinInput, Radio, Select, Slider, Switch, Textarea, Button, theme } from '@chakra-ui/react';
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


import ServerAPI from '../ServerAPI';


class AuditStatus extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      status: {},
      running: false,
      requestedStop: false,
    };
    this.checkDelay = 1000;
    this.checkInterval = null;
  }
  
  componentDidMount() {
    this.checkInterval = setInterval(() => this.checkStatus(), this.checkDelay);
  }
  
  componentWillUnmount() {
    if (this.checkInterval != null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && !prevState.error)
      document.querySelector('.alert').focus();
  }
  
  checkStatus() {
    this.props.server.getAuditStatus(this.props.match.params.auditId)
      .then((data) => {
        if (!data.running && this.checkInterval != null) {
          clearInterval(this.checkInterval);
          this.checkInterval = null;
        }
        document.title = "Audit Status: " + data.initialDomainName;
        this.setState({
          status: data,
          running: data.running,
        });
      },
      error => {
        this.setState({
          error: error.message,
          status: null,
        });
      });
  }
  
  stopAudit() {
    this.setState({ requestedStop: true });
    this.props.server.stopAudit(this.props.match.params.auditId)
      .then((data) => {
        this.setState({
          running: false
        });
      },
      error => {
        this.setState({ error: error.message, requestedStop: false });
      });
  }
  
  render() {
    return (
      <>
        <Flex direction="column" h="100vh">
          <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

            <Box w="100%" mb="4">
              <Text fontSize="5xl" mb="5">{this.state.status && this.state.status.initialDomainName ?
                'Audit status for ' + this.state.status.initialDomainName : 'Loading...'}</Text>
              <Alert show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
                {this.state.error}
              </Alert>
             
              {this.state.status && this.state.status.running !== undefined &&
        
          <section>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>

              <Stat shadow={'xl'}
              px={{ base: 2, md: 4 }}
              background={'#1F2029'}
      py={'5'}
      border={'1px solid #222'}
      rounded={'lg'}>
                <StatLabel>Audit State</StatLabel>
                <StatNumber>{this.state.status.running ? "Running" : "Stopped"}</StatNumber>
                <StatHelpText>
                  {this.state.status.nbScanErrors} scan errors
                </StatHelpText>
              </Stat>
              <Stat shadow={'xl'}
              px={{ base: 2, md: 4 }}
              background={'#1F2029'}
      py={'5'}
      border={'1px solid #222'}
      rounded={'lg'}>
                <StatLabel>Checked URLs</StatLabel>
                <StatNumber>{this.state.status.nbCheckedURLs}</StatNumber>
                <StatHelpText>
                  {this.state.status.nbURLsToCheck} remaining
                </StatHelpText>
              </Stat>

              <Stat shadow={'xl'}
              px={{ base: 2, md: 4 }}
              background={'#1F2029'}
      py={'5'}
      border={'1px solid #222'}
      rounded={'lg'}>
                <StatLabel>Violations</StatLabel>
                <StatNumber>{this.state.status.nbViolations}</StatNumber>
                <StatHelpText>
                  
                </StatHelpText>
              </Stat>
            </SimpleGrid>
          </section>
              }
              <Box w="100%" mt="5">

               
                {this.state.status && this.state.status.running &&
            <>
              <LinkContainer to={'/audits/'+this.props.match.params.auditId}>

                <Button colorScheme="pink"
          size="lg">View audit results</Button>
              </LinkContainer>

              <Button colorScheme="pink"
          size="lg"
                onClick={e => this.stopAudit()}
                disabled={!this.state.running || this.state.requestedStop}>
              Stop the audit
              </Button>
            </>
                }
              </Box>
            </Box>
          </Flex>
        </Flex>
      </>
    );
  }
  
}

AuditStatus.propTypes = {
  server: PropTypes.instanceOf(ServerAPI).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      auditId: PropTypes.string.isRequired,
    })
  }),
};

export default AuditStatus;
