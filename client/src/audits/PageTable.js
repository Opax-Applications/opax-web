import React from 'react';
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
} from "@chakra-ui/react";import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


const PageTable = ({ domain }) => {
  return (
    <section>
      <Text fontSize="3xl" mt="5" mb="5">Scanned Pages</Text>

      <Table colorScheme="whiteAlpha" variant="simple">
        <Thead>
          <Tr><Th>URL</Th><Th className="text-right">Violations</Th></Tr>
        </Thead>
        <Tbody>
          {domain.pages.map(page => (
            <Tr key={page._id}>
              <Td className="code">
                <Link to={'/pages/'+page._id}>{page.url}</Link>
              </Td>
              <Td className="text-right">{page.nbViolations}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </section>
  );
};

PageTable.propTypes = {
  domain: PropTypes.object.isRequired,
};

export default PageTable;
