import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import { Box, Heading, Alert, Flex, Tag, SimpleGrid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Text, Input, Checkbox, NumberInput, PinInput, Radio, Select, Slider, Switch, Textarea, Button, theme } from '@chakra-ui/react';
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
import DomainTable from './DomainTable';
import PageTable from './PageTable';
import ViolationStats from './ViolationStats';


class Audit extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      audit: null,
      domain: null, // used when there is only 1 domain for the audit
      error: null,
      statusLink: false,
    };
  }
  
  async componentDidMount() {
    try {
      const audit = await this.props.server.getAudit(this.props.match.params.auditId);
      document.title = "Accessibility Audit: " + audit.initialDomainName;
      this.setState({ audit });
      if (audit.domains && audit.domains.length === 1) {
        // load the domain when there is only 1 for the audit
        const domain = await this.props.server.getDomain(audit.domains[0]._id);
        this.setState({ domain });
      }
      if (!audit.complete) {
        try {
          const status = await this.props.server.getAuditStatus(this.props.match.params.auditId);
          if (status.running)
            this.setState({ statusLink: true });
        } catch (error) {
          // ignore this one (the audit is probably not in memory anymore)
        }
      }
    } catch (error) {
      this.setState({ error: error.message });
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.error && !prevState.error)
      document.querySelector('.alert').focus();
  }
  
  render() {
    const standardTitles = {
      wcag2a: "WCAG 2.0 Level A",
      wcag2aa: "WCAG 2.0 Level AA",
      wcag21aa: "WCAG 2.1 Level AA",
      section508: "Section 508",
    };
    return (
      <>
        <Flex direction="column" h="100vh">
          <Flex w="100%" maxWidth={1480} mx="auto" px="6">

            <Box w="100%" mt="5" mb="0">
             <Breadcrumb mt="1">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href={'#'}>Audit</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
              <Alert show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
                {this.state.error}
              </Alert>
              {/* <h1>{this.state.audit ?
                <span className="code">{this.state.audit.initialDomainName}</span>
                : ''}</h1> */}
              {this.state.audit &&
          <>
            {this.state.statusLink &&
            <>
              <Alert mb="5" color={"#444"} status="info" variant="subtle">
The audit is still running.  <Link to={'/audits/' + this.props.match.params.auditId + '/status'}>See status page</Link>.  </Alert>
            </>
            }
              <Text fontSize="xl" mt="5" mb="0">Audit Details</Text>
                <Heading isTruncated fontSize="4xl" mt="0" mb="4">{this.state.audit.initialDomainName}</Heading>
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
                <StatNumber>{this.state.audit.nbCheckedURLs}</StatNumber>
              </Stat>

              <Stat shadow={'xl'}
              px={{ base: 2, md: 4 }}
              background={'#1F2029'}
      py={'5'}
      border={'1px solid #222'}
      rounded={'lg'}>                <StatLabel>Issues found</StatLabel>
                <StatNumber>{this.state.audit.nbViolations}</StatNumber>
              </Stat>


              <Stat shadow={'xl'}
              px={{ base: 2, md: 4 }}
              background={'#1F2029'}
      py={'5'}
      border={'1px solid #222'}
      rounded={'lg'}>                <StatLabel>Standard</StatLabel>
                <StatNumber>{standardTitles[this.state.audit.standard]}</StatNumber>
              </Stat>

            </SimpleGrid>

            {/* <Table colorScheme="whiteAlpha" variant="simple">
              <Tbody>
                <Tr>
                  <Th>First URL</Th>
                  <Td className="code">{this.state.audit.firstURL}</Td>
                </Tr>
                <Tr>
                  <Th>Standard</Th>
                  <Td>{standardTitles[this.state.audit.standard]}</Td>
                </Tr>
                <Tr>
                  <Th>Check subdomains</Th>
                  <Td className="code">{this.state.audit.checkSubdomains ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Th>Maximum depth</Th>
                  <Td>{this.state.audit.maxDepth}</Td>
                </Tr>
                <Tr>
                  <Th>Maximum number of pages checked per domain</Th>
                  <Td>{this.state.audit.maxPagesPerDomain}</Td>
                </Tr>
                <Tr>
                  <Th>Use site maps</Th>
                  <Td className="code">{this.state.audit.sitemaps ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Th>Include only paths matching the regular expression</Th>
                  <Td className="code">{this.state.audit.includeMatch}</Td>
                </Tr>
                <Tr>
                  <Th>Web browser</Th>
                  <Td>{this.state.audit.browser}</Td>
                </Tr>
                <Tr>
                  <Th>Additional delay to let dynamic pages load (ms)</Th>
                  <Td>{this.state.audit.postLoadingDelay}</Td>
                </Tr>
                <Tr>
                  <Th>Date started</Th>
                  <Td>{(new Date(this.state.audit.dateStarted)).toLocaleString()}</Td>
                </Tr>
                <Tr>
                  <Th>Date ended</Th>
                  <Td>{this.state.audit.dateEnded &&
                      (new Date(this.state.audit.dateEnded)).toLocaleString()}</Td>
                </Tr>
                <Tr>
                  <Th>Audit completed</Th>
                  <Td>{this.state.audit.complete ? "Yes" : "No"}</Td>
                </Tr>
                <Tr>
                  <Th>Number of checked URLs</Th>
                  <Td>{this.state.audit.nbCheckedURLs}</Td>
                </Tr>
                <Tr>
                  <Th>Number of accessibility violations</Th>
                  <Td>{this.state.audit.nbViolations}</Td>
                </Tr>
                <Tr>
                  <Th>Number of scan errors</Th>
                  <Td>{this.state.audit.nbScanErrors}</Td>
                </Tr>
              </Tbody>
            </Table> */}
            { this.state.audit.categories &&
              <Categories categories={this.state.audit.categories}/>
            }
            {this.state.domain ?
              <>
                <ViolationStats stats={this.state.domain.violationStats}
                  items={this.state.domain.pages} itemType="page"/>
                <PageTable domain={this.state.domain}/>
              </>
              :
              <>
                <ViolationStats stats={this.state.audit.violationStats}
                  items={this.state.audit.domains} itemType="domain"/>
                <DomainTable audit={this.state.audit}/>
              </>
            }
          </>
              }
            </Box>
          </Flex>
        </Flex>
      </>
    );
  }
  
}

Audit.propTypes = {
  server: PropTypes.instanceOf(ServerAPI).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      auditId: PropTypes.string.isRequired,
    })
  }),
};

export default Audit;
