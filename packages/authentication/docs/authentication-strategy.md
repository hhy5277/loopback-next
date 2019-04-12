### Authentication strategy interface

```ts
import {Request} from '@loopback/rest';

export interface AuthenticationStrategy {
  name: string;
  authenticate(request: Request): Promise<UserProfile>;
}
```

An authentication strategy resolver can make use of the `name` property to `find` the registered authentication strategy.

The authentication strategy interface has an `authenticate` function which takes in a request and returns a user profile.

Authentication strategies that implement this interface can use dependency injection in the constructor to obtain **global** or **request-specific** `options` or any `services` it may require (a service to extract credentials from a request, for example).
