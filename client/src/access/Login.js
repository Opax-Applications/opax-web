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
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import PropTypes from 'prop-types';

import ServerAPI from '../ServerAPI';
import Permissions from './Permissions';


class Login extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      displayForm: false,
      error: null,
    };
  }
  
  login() {
    // the first Login button was clicked
    if (this.props.permissions.authenticationMethod === 'SAML')
      this.props.server.samlLogin();
    else
      this.displayForm();
  }
  

  async localLogin() {
    // the form login button was clicked
    try {
      await this.props.localLogin(this.state.username, this.state.password);
      this.setState({ error: null });
      this.hideForm();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  logout() {
    this.props.logout();
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }
  
  displayForm() {
    this.setState({ displayForm: true });
  }
  
  hideForm() {
    this.setState({ displayForm: false });
  }
  
  componentDidUpdate(prevProps, prevState) {
    // if (this.state.error && !prevState.error)
    //   document.querySelector('.alert').focus();
    // if (this.state.displayForm && !prevState.displayForm)
    //   document.getElementById('username').focus();
    // modal accessibility issue: see
    // https://github.com/dequelabs/axe-core/issues/1482#issuecomment-502392478
    // should we fix that here ?
  }
  
  render() {
    return (
      <>
        {(this.props.permissions && this.props.permissions.loggedIn()) ?
          <>
            <Button colorScheme="pink"
         variant="secondary" onClick={() => this.logout()} className="float-right">
              Log out
            </Button>
          </>
          :
          <Button colorScheme="pink"
          variant="secondary" onClick={() => this.login()}
              className="float-right">
            Login
          </Button>
        }
        {
          <>

            <Modal isOpen={this.state.displayForm} onClose={() => this.hideForm()}>
              <ModalOverlay />
              <ModalContent shadow={'xl'}
              px={{ base: 2, md: 4 }}
              background={'#1F2029'}
      py={'5'}
      border={'1px solid #222'}
      rounded={'lg'}>
                <Form onSubmit={(e) => { e.preventDefault(); this.localLogin(); }}>

                  <ModalHeader>Sign in</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
<Stack spacing={5}>

                    <FormControl id="firstURL">
                      <FormLabel column sm="5">Username</FormLabel>
                      <Input name="username" type="text" onChange={e => this.handleChange(e)} onChange={e => this.handleChange(e)}/>
                    </FormControl>
                     <FormControl id="firstURL">
                      <FormLabel column sm="5">Username</FormLabel>
                      <Input name="password" type="password" onChange={e => this.handleChange(e)} onChange={e => this.handleChange(e)}/>
                    </FormControl>
                    </Stack>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="grey" mr={3} onClick={() => this.hideForm()}>
              Close
                    </Button>
                    <Button colorScheme="pink" type="submit" >Log in</Button>

                  </ModalFooter>
                </Form>

              </ModalContent>
            </Modal>
          </>
          /*

        <Modal isOpen={this.state.displayForm} onClose={() => this.hideForm()}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Form onSubmit={(e) => { e.preventDefault(); this.localLogin(); }}>
                <Modal.Header closeButton>
                  <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Alert show={this.state.error != null} variant="danger" dismissible
                  onClose={() => this.setState({ error: null })} tabIndex="0">
                    {this.state.error}
                  </Alert>
                  <Form.Group controlId="username">
                    <Form.Label className="mx-2">Username</Form.Label>
                    <Form.Control className="mx-2" name="username" type="text" onChange={e => this.handleChange(e)}/>
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label className="mx-2">Password</Form.Label>
                    <Form.Control className="mx-2" name="password" type="password" onChange={e => this.handleChange(e)}/>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.hideForm()}>
                Cancel
                  </Button>
                  <Button type="submit">Log in</Button>
                </Modal.Footer>
              </Form>          </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => this.hideForm()}>
              Close
              </Button>
              <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal> */}
        {/* <Modal show={this.state.displayForm} onHide={() => this.hideForm()}>
          
        </Modal> */}
      </>
    );
  }
}

Login.propTypes = {
  server: PropTypes.instanceOf(ServerAPI).isRequired,
  permissions: PropTypes.instanceOf(Permissions),
  localLogin: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

export default Login;
