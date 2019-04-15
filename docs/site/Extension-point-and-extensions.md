---
lang: en
title: 'Extension point and extensions'
keywords: LoopBack 4.0, LoopBack 4
sidebar: lb4_sidebar
permalink: /doc/en/lb4/Extension-point-and-extensions.html
---

## Extension point/extension pattern

[Extension Point/extension](https://wiki.eclipse.org/FAQ_What_are_extensions_and_extension_points%3F)
is a very powerful design pattern that promotes loose coupling and offers great
extensibility. There are many use cases in LoopBack 4 that fit into design
pattern. For example:

- `@loopback/boot` uses `BootStrapper` that delegates to `Booters` to handle
  different types of artifacts
- `@loopback/rest` uses `RequestBodyParser` that finds the corresponding
  `BodyParsers` to parse request body encoded in different media types
- `@loopback/core` uses `LifeCycleObserver` to observe `start` and `stop` events
  of the application life cycles.

## Tutorial

The
[greeter-extension example](https://github.com/strongloop/loopback-next/tree/master/examples/greeter-extension)
provides a walk-through on how to implement the extension point/extension
pattern using LoopBack 4's [Context](Context.md) and
[Dependency injection](Dependency-injection.md) container.
