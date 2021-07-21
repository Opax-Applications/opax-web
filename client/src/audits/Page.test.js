import React from 'react';
import { render, wait } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import MockServerAPI from '../ServerAPI';
import Page from './Page';

jest.mock('../ServerAPI');

const init = async (pageId) => {
  const mockServer = new MockServerAPI();
  const { container, getByText } = render(<MemoryRouter><Page server={mockServer} match={{params:{pageId:pageId}}}/></MemoryRouter>);
  await wait();
  return { container, getByText };
};

it("renders with violation information", async () => {
  const { container } = await init('pid1');
  // breadcrumbs
  expect(container.querySelector('nav').textContent).toBe('AuditsAuditDomainPage');
  // title
  expect(container.querySelector('h1').textContent).toBe('purl1');
  // violation table
  const violationTable = container.querySelector('table');
  expect(violationTable.querySelector('tr td').textContent).toContain('description1');
  // node table
  const nodeTable = violationTable.querySelector('table');
  expect(nodeTable.querySelector('tbody tr td').textContent).toContain('target1');
  expect(nodeTable.querySelector('tbody tr td:nth-of-type(2)').textContent).toContain('html1');
});
