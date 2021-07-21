import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import MockServerAPI from '../ServerAPI';
import PageTable from './PageTable';

jest.mock('../ServerAPI');

it("renders with page information", async () => {
  const mockServer = new MockServerAPI();
  await mockServer.localLogin('user2', 'pass2');
  const domain = await mockServer.getDomain('did1');
  const { container } = render(<MemoryRouter><PageTable domain={domain}/></MemoryRouter>);
  const tr2 = container.querySelector('tr:nth-of-type(2)');
  const td1 = tr2.querySelector('td:nth-of-type(1)');
  const a = td1.querySelector('a');
  expect(a.textContent).toBe('purl2');
  expect(a.getAttribute('href')).toBe('/pages/pid2');
  const td2 = tr2.querySelector('td:nth-of-type(2)');
  expect(td2.textContent).toBe('nbViolations2');
});
