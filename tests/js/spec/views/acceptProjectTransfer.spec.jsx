import React from 'react';

import {mount} from 'enzyme';
import AcceptProjectTransfer from 'app/views/acceptProjectTransfer';

jest.mock('jquery');

describe('AcceptProjectTransfer', function() {
  beforeEach(function() {
    MockApiClient.clearMockResponses();

    MockApiClient.addMockResponse({
      url: '/accept-transfer/',
      method: 'GET',
      body: {
        project: TestStubs.Project(),
        organizations: [TestStubs.Organization({teams: [TestStubs.Team()]})],
      },
    });
  });

  it('renders', function() {
    let wrapper = mount(
      <AcceptProjectTransfer location={{}} />,
      TestStubs.routerContext()
    );

    expect(wrapper).toMatchSnapshot();
  });
});
