import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';
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
import ServerAPI from '../ServerAPI';
import Categories from './Categories';
import PageTable from './PageTable';
import ViolationStats from './ViolationStats';


class Domain extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      domain: null,
      error: null,
    };
  }
  
  async componentDidMount() {
    try {
      const domain = await this.props.server.getDomain(this.props.match.params.domainId);
      document.title = "Accessibility Audit: " + domain.name;
      this.setState({ domain });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && !prevState.error)
      document.querySelector('.alert').focus();
  }
  
  render() {
    return (
      <>
        <div className="container">
          <Flex direction="column" h="100vh">
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

              <Box w="100%" mb="4">
              
                {this.state.domain &&
            <>
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href={'/audits/'+this.state.domain.auditId}>Audit</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href={'#'}>Domain</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            </>
                }
                <Alert show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
                  {this.state.error}
                </Alert>
                <Text fontSize="5xl" mb="4">{this.state.domain ? this.state.domain.name : ''}</Text>
                {this.state.domain &&
          <>
            <section>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>

                {/* <Stat shadow={'xl'}
              px={{ base: 2, md: 4 }}
              background={'#1F2029'}
      py={'5'}
      border={'1px solid #222'}
      rounded={'lg'}>
                <StatLabel>Root URL</StatLabel>
                <StatNumber>{this.state.audit.firstURL}</StatNumber>
              </Stat> */}


                <Stat shadow={'xl'}
              px={{ base: 2, md: 4 }}
              background={'#1F2029'}
      py={'5'}
      border={'1px solid #222'}
      rounded={'lg'}>                <StatLabel>Pages audited</StatLabel>
                  <StatNumber>{this.state.domain.nbCheckedURLs}</StatNumber>
                </Stat>

                <Stat shadow={'xl'}
              px={{ base: 2, md: 4 }}
              background={'#1F2029'}
      py={'5'}
      border={'1px solid #222'}
      rounded={'lg'}>                <StatLabel>Issues found</StatLabel>
                  <StatNumber>{this.state.domain.nbViolations}</StatNumber>
                </Stat>


           
              </SimpleGrid>
             
            </section>
            { this.state.domain.categories &&
              <Categories categories={this.state.domain.categories}/>
            }
            <ViolationStats stats={this.state.domain.violationStats}
              items={this.state.domain.pages} itemType="page"/>
            <PageTable domain={this.state.domain}/>
          </>
                }
              </Box>
            </Flex>
          </Flex>
        </div>
      </>
    );
  }
  
}

Domain.propTypes = {
  server: PropTypes.instanceOf(ServerAPI).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      domainId: PropTypes.string.isRequired,
    })
  }),
};

export default Domain;
