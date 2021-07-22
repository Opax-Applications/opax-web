import React from 'react';
import ReactDOM from 'react-dom';

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from './styles/theme';

import App from './App';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ChakraProvider theme={theme}><App /></ChakraProvider>, document.getElementById('root'));

serviceWorker.unregister();
