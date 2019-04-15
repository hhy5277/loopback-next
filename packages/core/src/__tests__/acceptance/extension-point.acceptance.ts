// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  BINDING_METADATA_KEY,
  Context,
  Getter,
  MetadataInspector,
} from '@loopback/context';
import {expect} from '@loopback/testlab';
import {addExtension, extensionPoint, extensions} from '../..';

describe('extension point', () => {
  describe('@extensionPoint', () => {
    it('specifies name of the extension point', () => {
      @extensionPoint('greeters')
      class GreetingService {
        @extensions()
        public greeters: Getter<Greeter[]>;
      }

      expect(
        MetadataInspector.getClassMetadata(
          BINDING_METADATA_KEY,
          GreetingService,
        ),
      ).to.eql({tags: {name: 'greeters'}});
    });
  });

  describe('@extensions', () => {
    let ctx: Context;

    beforeEach(givenContext);

    it('injects a getter function of extensions', async () => {
      @extensionPoint('greeters')
      class GreetingService {
        @extensions()
        public greeters: Getter<Greeter[]>;
      }

      ctx.bind('greeter-service').toClass(GreetingService);
      registerGreeters('greeters');
      const greeterService = await ctx.get<GreetingService>('greeter-service');
      const greeters = await greeterService.greeters();
      const languages = greeters.map(greeter => greeter.language);
      expect(languages).to.containEql('en');
      expect(languages).to.containEql('zh');
    });

    it('injects extensions based on the name tag of the extension point binding', async () => {
      class GreetingService {
        @extensions()
        public greeters: Getter<Greeter[]>;
      }
      ctx
        .bind('greeter-service')
        .toClass(GreetingService)
        .tag({name: 'greeters'}); // Tag the extension point with a name
      registerGreeters('greeters');
      const greeterService = await ctx.get<GreetingService>('greeter-service');
      const greeters = await greeterService.greeters();
      const languages = greeters.map(greeter => greeter.language);
      expect(languages).to.containEql('en');
      expect(languages).to.containEql('zh');
    });

    it('injects extensions based on the class name of the extension point', async () => {
      class GreetingService {
        @extensions()
        public greeters: Getter<Greeter[]>;
      }
      ctx.bind('greeter-service').toClass(GreetingService);
      registerGreeters(GreetingService.name);
      const greeterService = await ctx.get<GreetingService>('greeter-service');
      const greeters = await greeterService.greeters();
      const languages = greeters.map(greeter => greeter.language);
      expect(languages).to.containEql('en');
      expect(languages).to.containEql('zh');
    });

    it('injects extensions based on extension point name from @extensions', async () => {
      class GreetingService {
        @extensions('greeters')
        public greeters: Getter<Greeter[]>;
      }
      ctx.bind('greeter-service').toClass(GreetingService);
      registerGreeters('greeters');
      const greeterService = await ctx.get<GreetingService>('greeter-service');
      const greeters = await greeterService.greeters();
      const languages = greeters.map(greeter => greeter.language);
      expect(languages).to.containEql('en');
      expect(languages).to.containEql('zh');
    });

    function givenContext() {
      ctx = new Context();
    }

    function registerGreeters(extensionPointName: string) {
      addExtension(ctx, extensionPointName, EnglishGreeter, {
        namespace: 'greeters',
      });
      addExtension(ctx, extensionPointName, ChineseGreeter, {
        namespace: 'greeters',
      });
    }
  });

  interface Greeter {
    language: string;
    greet(name: string): string;
  }

  class EnglishGreeter implements Greeter {
    language = 'en';
    greet(name: string) {
      return `Hello, ${name}!`;
    }
  }

  class ChineseGreeter implements Greeter {
    language = 'zh';
    greet(name: string) {
      return `你好，${name}！`;
    }
  }
});
