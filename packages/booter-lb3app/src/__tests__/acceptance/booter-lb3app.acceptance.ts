// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/booter-lb3app
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Client, expect} from '@loopback/testlab';
import {CoffeeApplication} from '../fixtures/src/application';
import {CoffeeRepository} from '../fixtures/src/coffee.repository';
import {givenCoffee, givenCoffeeShop, setupApplication} from '../test-helper';

describe('booter-lb3app', () => {
  let app: CoffeeApplication;
  let client: Client;
  let coffeeRepo: CoffeeRepository;

  before(async () => {
    ({app, client} = await setupApplication());
    await changeDataSourceConfig();
    await givenCoffeeRepository();
  });

  beforeEach(async () => {
    await coffeeRepo.deleteAll();
  });

  after('closes application', async () => {
    await app.stop();
  });

  it('gets the LoopBack 4 explorer', async () => {
    await client
      .get('/explorer/')
      .expect(200)
      .expect('content-type', /html/)
      .expect(/<title>LoopBack API Explorer/);
  });

  it('creates a LoopBack 4 Coffee instance', async () => {
    const coffee = givenCoffee();
    const response = await client
      .post('/coffees')
      .send(coffee)
      .expect(200);
    expect(response.body).to.containDeep(coffee);
    const result = await coffeeRepo.findById(response.body.id);
    expect(result).to.containDeep(coffee);
  });

  context('mounting full LoopBack 3 application', () => {
    it('creates and gets a LoopBack 3 CoffeeShop instance', async () => {
      const coffeeShop = givenCoffeeShop();
      const response = await client
        .post('/api/CoffeeShops')
        .send(coffeeShop)
        .expect(200);
      expect(response.body).to.containDeep(coffeeShop.__data);
      const result = await client.get(`/api/CoffeeShops/${response.body.id}`);
      expect(result.body).to.containDeep(coffeeShop.__data);
    });
  });

  context('open API spec endpoints', () => {
    it('includes LoopBack 4 endpoints in OpenApiSpec', () => {
      const apiSpec = app.restServer.getApiSpec();
      const paths = Object.keys(apiSpec.paths);
      expect(paths).to.containDeep([
        '/coffees',
        '/coffees/count',
        '/coffees/{id}',
      ]);
    });

    it('includes LoopBack 3 endpoints with `/api` base in OpenApiSpec', () => {
      const apiSpec = app.restServer.getApiSpec();
      const paths = Object.keys(apiSpec.paths);
      expect(paths).to.containDeep([
        '/api/CoffeeShops/{id}',
        '/api/CoffeeShops',
        '/api/CoffeeShops/count',
      ]);
    });
  });

  context('mounting routes only of LoopBack 3 application', () => {
    before(async () => {
      ({app, client} = await setupApplication({
        lb3app: {mode: 'restRouter', restApiRoot: '/coffees'},
      }));
    });

    it('creates and gets a LoopBack 3 CoffeeShop instance', async () => {
      const coffeeShop = givenCoffeeShop();
      const response = await client
        .post('/coffees/CoffeeShops')
        .send(coffeeShop)
        .expect(200);
      expect(response.body).to.containDeep(coffeeShop.__data);
      const result = await client.get(
        `/coffees/CoffeeShops/${response.body.id}`,
      );
      expect(result.body).to.containDeep(coffeeShop.__data);
    });
  });

  async function givenCoffeeRepository() {
    coffeeRepo = await app.getRepository(CoffeeRepository);
  }

  async function changeDataSourceConfig() {
    /**
     * Override default config for DataSource for testing so we don't write
     * test data to file when using the memory connector.
     */
    app.bind('datasources.config.ds').to({
      name: 'ds',
      connector: 'memory',
    });
  }
});
