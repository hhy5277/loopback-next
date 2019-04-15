// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  bind,
  BindingFromClassOptions,
  BindingSpec,
  BindingTemplate,
  Constructor,
  Context,
  createBindingFromClass,
  createViewGetter,
  filterByTag,
  inject,
} from '@loopback/context';
import {CoreTags} from './keys';

/**
 * Decorate a class as a named extension point. If the decoration is not
 * present, the name of the class will be used. For example:
 *
 * ```ts
 * import {extensionPoint} from '@loopback/core';
 *
 * @extensionPoint(GREETER_EXTENSION_POINT_NAME)
 * export class GreetingService {
 *   // ...
 * }
 * ```
 *
 * @param name Name of the extension point
 */
export function extensionPoint(name: string, ...specs: BindingSpec[]) {
  const tags = name ? {tags: {name}} : {};
  return bind(tags, ...specs);
}

/**
 * Shortcut to inject extensions for the given extension point. For example:
 *
 * ```ts
 * import {Getter} from '@loopback/context';
 * import {extensionPoint, extensions} from '@loopback/core';
 *
 * @extensionPoint(GREETER_EXTENSION_POINT_NAME)
 * export class GreetingService {
 *  constructor(
 *    @extensions() // Inject extensions for the extension point
 *    private getGreeters: Getter<Greeter[]>,
 *    // ...
 * ) {
 *   // ...
 * }
 * ```
 *
 * @param extensionPointName Name of the extension point. If not supplied, we use
 * the name from `@extensionPoint` or the class name of the extension point
 * class.
 */
export function extensions(extensionPointName?: string) {
  return inject('', {decorator: '@extensions'}, (ctx, injection, session) => {
    // Find the key of the target binding
    if (!session.currentBinding) return undefined;

    if (!extensionPointName) {
      extensionPointName = session.currentBinding.tagMap.name;
      if (!extensionPointName) {
        let target: Function;
        if (typeof injection.target === 'function') {
          // Constructor injection
          target = injection.target;
        } else {
          // Injection on the prototype
          target = injection.target.constructor;
        }
        extensionPointName = target.name;
      }
    }

    const bindingFilter = filterByTag({
      [CoreTags.EXTENSION_POINT]: extensionPointName,
    });
    return createViewGetter(ctx, bindingFilter, session);
  });
}

/**
 * A factory function to create binding template for extensions of the given
 * extension point
 * @param extensionPointName Name of the extension point
 */
export function extensionFor(extensionPointName: string): BindingTemplate {
  return binding => binding.tag({extensionPoint: extensionPointName});
}

/**
 * Register an extension for the given extension point to the context
 * @param context Context object
 * @param extensionPointName Name of the extension point
 * @param extensionClass Class or a provider for an extension
 * @param options Options Options for the creation of binding from class
 */
export function addExtension(
  context: Context,
  extensionPointName: string,
  extensionClass: Constructor<unknown>,
  options?: BindingFromClassOptions,
) {
  const binding = createBindingFromClass(extensionClass, options).apply(
    extensionFor(extensionPointName),
  );
  context.add(binding);
  return binding;
}
