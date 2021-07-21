import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';
import PropTypes from 'prop-types';
import { LinkContainer } from 'react-router-bootstrap';

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
        <Breadcrumb>
          <LinkContainer to="/audits/">
            <Breadcrumb.Item>Audits</Breadcrumb.Item>
          </LinkContainer>
          {this.state.domain &&
            <>
              <LinkContainer to={'/audits/'+this.state.domain.auditId}>
                <Breadcrumb.Item>Audit</Breadcrumb.Item>
              </LinkContainer>
              <Breadcrumb.Item active>Domain</Breadcrumb.Item>
            </>
          }
        </Breadcrumb>
        <Alert show={this.state.error != null} variant="danger" dismissible
            onClose={() => this.setState({ error: null })} tabIndex="0">
          {this.state.error}
        </Alert>
        <h1>{this.state.domain ? <span className="code">{this.state.domain.name}</span> : ''}</h1>
        {this.state.domain &&
          <>
            <section>
              <h2>Statistics</h2>
              <Table bordered size="sm" className="data">
                <tbody>
                  <tr><th>Number of checked URLs</th><td>{this.state.domain.nbCheckedURLs}</td></tr>
                  <tr><th>Number of accessibility violations</th><td>{this.state.domain.nbViolations}</td></tr>
                </tbody>
              </Table>
            </section>
            { this.state.domain.categories &&
              <Categories categories={this.state.domain.categories}/>
            }
            <ViolationStats stats={this.state.domain.violationStats}
              items={this.state.domain.pages} itemType="page"/>
            <PageTable domain={this.state.domain}/>
          </>
        }
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
