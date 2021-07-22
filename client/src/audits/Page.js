import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
// import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
// import Table from 'react-bootstrap/Table';
import { LinkContainer } from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";

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
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react';

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
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Audits</BreadcrumbLink>
            </BreadcrumbItem>
            {this.state.page &&
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={'/audits/'+this.state.page.auditId}>Audit</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={'/domains/'+this.state.page.domainId}>Domain</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>Page</BreadcrumbItem>
            </>
            }
          </Breadcrumb>
          <h1>
            {this.state.page ? <span className="code">{this.state.page.url}</span> : ''}
          </h1>
          <Alert show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
            {this.state.error}
          </Alert>
          {this.state.page &&
          <>
            <p className="text-center"><a href={this.state.page.url} target="_blank"
              rel="noopener noreferrer">Visit the page</a></p>
            {this.state.page.status && this.state.page.status !== '200' &&
              <Alert variant="danger">Page status: {this.state.page.status}</Alert>
            }
            {this.state.page.errorMessage &&
              <Alert variant="danger">Page error: {this.state.page.errorMessage}</Alert>
            }
            {this.state.page.violations.length === 0 &&
              <Alert variant="success">No violation</Alert>
            }
            {this.state.page.violations
              .sort((v1, v2) => impacts.get(v2.impact) - impacts.get(v1.impact))
              .map(violation => (
                <Table bordered size="sm" key={violation.id} className="data">
                  <Tbody>
                    {/*<tr><th>Id</th><td className="code">{violation.id}</td></tr>*/}
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
                      <Table bordered size="sm" className="data">
                        <Thead>
                          <Tr><Th>Target</Th><Th>HTML</Th></Tr>
                        </Thead>
                        <Tbody>
                          {violation.nodes.map(node => (
                            <Tr key={node._id}>
                              <Td className="code">{node.target}</Td>
                              <Td className="code">{node.html}</Td>
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
