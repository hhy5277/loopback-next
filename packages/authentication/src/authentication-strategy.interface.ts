import { Request } from '@loopback/rest';
import { UserProfile } from './types';


/**
 * Interface for the authentication strategy
 */
interface AuthenticationStrategy<O> {

  /**
   * Authenticates user credentials in the given request and returns a 'UserProfile'.
   * If 'authenticate' function fails, it should throw an error.
   *
   * @param {Request} request
   * @param {O} options - The request-specific options for the strategy that override
   *      the global options of the strategy. These request-specific options are obtained
   *      by the authentication action by reading the decorator meta-data on the controller function.
   */
  authenticate(request: Request, options: O): Promise<UserProfile>;

}
