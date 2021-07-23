import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { faInfoCircle, faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import './ViolationStats.css';


class ViolationStats extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      seeItemsViolationId: null,
    };
  }
  
  seeItems(violationId) {
    if (this.state.seeItemsViolationId === violationId)
      this.setState({ seeItemsViolationId: null });
    else
      this.setState({ seeItemsViolationId: violationId });
  }
  
  itemTitle(id) {
    for (const item of this.props.items) {
      if (item._id === id)
        return item.url ? item.url : item.name;
    }
    return null;
  }
  
  violationItems(id) {
    return (
      <>
        {this.state.seeItemsViolationId === id &&
          <div className="violationItems">
            {this.props.stats[id][this.itemPlural]
              .sort((item1, item2) => {
                const cd = item2.count - item1.count;
                if (cd !== 0)
                  return cd;
                return this.itemTitle(item1.id).localeCompare(
                  this.itemTitle(item2.id));
              })
              .map(item =>
                <div key={item.id}>
                  <Link to={'/' + this.itemPlural + '/' + item.id}>{this.itemTitle(item.id)}</Link>
                  {' '}{item.count}
                </div>
              )
            }
          </div>
        }
      </>
    );
  }
  
  violationRow(id) {
    const v = this.props.stats[id];
    const withItems = this.props.items && v[this.itemPlural] &&
      v[this.itemPlural].length > 0;
    const expanded = this.state.seeItemsViolationId === id;
    return (
      <Tr key={id}>
        <Td className="code">
          {v.description}
          {withItems &&
            <>
              {' '}
              <Button variant="info" size="xs" onClick={e => this.seeItems(id)}
                  title={(expanded ? 'Hide' : 'See') + ' affected ' + this.itemPlural}>
                <FontAwesomeIcon icon={expanded ? faMinusSquare : faPlusSquare}/>
              </Button>
            </>
          }
          {' '}
          <Button variant="info" size="xs" title="Open rule description on Deque's website"
              onClick={e => window.open(v.descLink, '_blank')}>
            <FontAwesomeIcon icon={faInfoCircle}/>
          </Button>
          {withItems && this.violationItems(id)}
        </Td>
        <Td className={v.impact}>{v.impact}</Td>
        <Td className="text-right">{v.total}</Td>
      </Tr>
    );
  }
  
  render() {
    this.itemPlural = this.props.itemType + "s";
    const stats = this.props.stats;
    const impacts = new Map([
      ['minor', 0],
      ['moderate', 1],
      ['serious', 2],
      ['critical', 3],
    ]);
    return (
      <section>
        <SimpleGrid mb="5">
          <Text fontSize="3xl" mt="5" mb="5">Issues</Text>
          <Table colorScheme="whiteAlpha" variant="simple">
            <Thead>
              <Tr>
                <Th>description</Th>
                <Th>impact</Th>
                <Th>total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.keys(stats).length === 0 ?
                <Tr><Td colSpan="3">None</Td></Tr> :
                <>
                  {Object.keys(stats)
                    .sort((id1,id2) => {
                      let td = impacts.get(stats[id2].impact) -
                      impacts.get(stats[id1].impact);
                      if (td === 0)
                        td = stats[id2].total - stats[id1].total;
                      return td;
                    })
                    .map(id => this.violationRow(id))
                  }
                </>
              }
            </Tbody>
          </Table>
        </SimpleGrid>
      </section>
    );
  }
  
}

ViolationStats.propTypes = {
  stats: PropTypes.object.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    url: PropTypes.string,
  })).isRequired,
  itemType: PropTypes.string.isRequired,
};

export default ViolationStats;
