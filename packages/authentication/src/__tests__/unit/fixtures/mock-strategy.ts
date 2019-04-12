// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Request} from '@loopback/rest';
import {AuthenticationStrategy, UserProfile} from '../../../types';

interface MockStrategyOptions {
  [key: string]: any;
}

/**
 * Test fixture for a mock asynchronous passport-strategy
 */
export class MockStrategy implements AuthenticationStrategy {
  name: 'MockStrategy';
  // user to return for successful authentication
  private mockUser: UserProfile;

  setMockUser(userObj: UserProfile) {
    this.mockUser = userObj;
  }

  /**
   * authenticate() function similar to passport-strategy packages
   * @param req
   */
  async authenticate(req: Request): Promise<UserProfile> {
    return await this.verify(req);
  }
  /**
   * @param req
   * mock verification function; usually passed in as constructor argument for
   * passport-strategy
   *
   * For the purpose of mock tests we have this here
   * pass req.query.testState = 'fail' to mock failed authorization
   * pass req.query.testState = 'error' to mock unexpected error
   */
  async verify(request: Request) {
    if (!request.header) throw new Error('Unauthorized User!');
    return this.returnMockUser();
  }

  returnMockUser(): UserProfile {
    return this.mockUser;
  }
}
