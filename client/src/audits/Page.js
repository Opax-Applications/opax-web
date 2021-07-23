import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// import Breadcrumb from 'react-bootstrap/Breadcrumb';
// import Table from 'react-bootstrap/Table';
import { Box, Flex, Heading, SimpleGrid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Input, Checkbox, NumberInput, PinInput, Radio, Select, Slider, Switch, Textarea, Button, theme } from '@chakra-ui/react';
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
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ServerAPI from '../ServerAPI';


class Page extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      page: null,
      error: null,
    };
  }
  
  async componentDidMount() {
    try {
      const page = await this.props.server.getPage(this.props.match.params.pageId);
      document.title = "Accessibility Audit: " + page.url;
      this.setState({ page });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && !prevState.error)
      document.querySelector('.alert').focus();
  }
  
  render() {
    const impacts = new Map([
      ['minor', 0],
      ['moderate', 1],
      ['serious', 2],
      ['critical', 3],
    ]);
    return (
      <>
        <div className="container">
          <Flex direction="column" h="100vh">
            <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">

              <Box w="100%" mb="4">
                {this.state.page &&
            <>
              <Breadcrumb mb="5">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href={'/audits/'+this.state.page.auditId}>Audit</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href={'/domains/'+this.state.page.domainId}>Domain</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href={'#'}>Page</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>

            </>
                }

                <Text fontSize="xl" mt="5" mb="0">Results of page audit</Text>
                <Heading isTruncated fontSize="4xl" mt="0" mb="4">{this.state.page ? <span>{this.state.page.url}</span> : ''}</Heading>

                <Alert show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
                  {this.state.error}
                </Alert>
                {this.state.page &&
          <>
            <p className="text-center"><a href={this.state.page.url} target="_blank"
              rel="noopener noreferrer"> <Button colorScheme="pink"
          size="lg" mb="5"
              >
              Visit page
              </Button></a></p>
            {this.state.page.status && this.state.page.status !== '200' &&
              <Alert variant="danger">Page status: {this.state.page.status}</Alert>
            }
            {this.state.page.errorMessage &&
              <Alert variant="danger">Page error: {this.state.page.errorMessage}</Alert>
            }
            {this.state.page.violations.length === 0 &&
               <Text fontSize="lg" mt="5" mb="4">No violations detected</Text>
            }
            {this.state.page.violations
              .sort((v1, v2) => impacts.get(v2.impact) - impacts.get(v1.impact))
              .map(violation => (
                <Table mt="5" colorScheme="whiteAlpha">
                  <Tbody>
                    {/* <tr><th>Id</th><td>{violation.id}</td></tr> */}
                    <Tr><Th>Description</Th><Td>
                      {violation.description + ' '}
                      <Button variant="info" size="xs" title="Open rule description on Deque's website"
                          onClick={e => window.open(violation.descLink, '_blank')}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                      </Button>
                    </Td></Tr>
                    <Tr><Th>Impact</Th><Td className={violation.impact}>{violation.impact}</Td></Tr>
                    <Tr><Th>Category</Th><Td>{violation.category}</Td></Tr>
                    <Tr><Th>Nodes</Th><Td>
                      <Table colorScheme="whiteAlpha">
                        <Thead>
                          <Tr><Th>Target</Th><Th>HTML</Th></Tr>
                        </Thead>
                        <Tbody>
                          {violation.nodes.map(node => (
                            <Tr key={node._id}>
                              <Td>{node.target}</Td>
                              <Td>
                                <SyntaxHighlighter language="html" style={darcula}>{node.html}</SyntaxHighlighter></Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Td></Tr>
                  </Tbody>
                </Table>
              ))
            }
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

Page.propTypes = {
  server: PropTypes.instanceOf(ServerAPI).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      pageId: PropTypes.string.isRequired,
    })
  }),
};

export default Page;
