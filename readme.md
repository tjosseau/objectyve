
# Objectÿve

Objectÿve is a light JavaScript framework to simplify your prototypes definition.

* **JS 1.3** : Compatible with ECMAScript 4 and higher `Modern browsers` **&** `Internet Explorer 8`

* **AMD** : Modules with AMD compatibility `RequireJS`

* **Node** : Server-side compatibility `Node.js`

----

# Examples

Here is a "template" example:

```javascript
var Dragon = Objectyve.Prototype
({
    extend: Living,                 // Can only extend one constructor.

    mixin: [Reptile, Wingged],      // Can be augmented with one or more constructors.

    static:
    {
        description : 'A legendary creature that features in the myths of many cultures.',

        describe : function()
        {
            return Wikipedia.def('Dragon').toString() ;
        },

        count : function()
        {
            return self.entities.length ; // Static property `entities` is inherited from Living.
        }
    },

    public:
    {
        // life : 10,       // Inherited from Living.
        name : '',

        strength : 3,
        speed : 2
    },

    hidden:
    {
        power : 3
    },

    shared:
    {
        initialize: function(name)
        {
            this.name = name || 'Dragon' ;

            self.entities.push(this) ;
        },

        // walk: Augmented from Reptile.

        // fly: Augmented from Wingged.

        talk: function()
        {
            return 'rawr' ;
        },

        attack: function()
        {
            return this.strength * (this.power--) ;
        }
    }
}) ;

var drg = new Dragon('Toothless') ;
drg.talk() ; // 'rawr'
```

To have an overview of how it may be used, I suggest you to take a look at those script examples below :

- [Default](https://github.com/tjosseau/objectyve/blob/master/examples/prototype-default.js "Default example") : Default and best way to create new prototypes.
- [Simple](https://github.com/tjosseau/objectyve/blob/master/example/prototype-simple.js "Simple example") : Simpler way to create prototypes.
- [Partiated](https://github.com/tjosseau/objectyve/blob/master/examples/prototype-partiated.js "Partiated example") : Partiated way to create and use prototypes.

----

# API Documentation
 
## Prototype

### Definition

> **Definition:** "Prototype-based programming is a style of object-oriented programming in which behaviour reuse (known as inheritance) is performed via a process of cloning existing objects that serve as prototypes."
> http://en.wikipedia.org/wiki/Prototype-based_programming

In **Objectÿve**, a `Prototype` is a prototype-based constructor which will instanciate objects the same way as by default in JavaScript.

### Creating a new Prototype

To build a new `Prototype`, just call the function as below :
```javascript
var Abc = Objectyve.Prototype() ;
```
> **Note :** Constructors generally have capitalized names.

You can now instanciate multiple `Abc` objects as normal.

```javascript
var a = new Abc() ;
// or
var a = Abc.create() ; // See section 'Initializing > create'
```

----

## Setting properties

### public / attr

Public members are opened to read and write properties.
```javascript
var A = Objectyve.Prototype() ;
A.public({
    a : 1,
    b : null,
    c : { p1 : 1, p2 : 2 }
}) ;
```

```javascript
var a = new A ;
a.a ; // 1
a.b ; // null
a.c ; // Object
a.d ; // undefined
```

### shared / method

Shared members are attributes and methods set in the `prototype` of the constructor. This means that every object will inherit from/share that prototype.
```javascript
var A = Objectyve.Prototype() ;
A.shared({
    p : 1,
    getP : function() {
        return this.p ;
    }
}) ;
// Or...
A.method({ ... }) ;
```

```javascript
var a = new A ;
a.p ; // 1
a.getP() ; // 1

a.p = 2 ;
var a2 = new A ;
a2.p ; // 2, as both a and a2 share the same property.
```

### **Note** about _public_ and _shared_ properties

```javascript
var A = Objectyve.Prototype() ;
A.public({
    obj : { p : 1 },
    fn : function() { return true ; }
}) ;
A.shared({
    prop : 1
}) ;
```

* Objects given as _public_ parameter will be automatically _cloned_.
    
    ```javascript
    var a = new A ;
    a.obj.p = 2 ;
    
    var a2 = new A ;
    a2.obj.p ; // 1
    ```

* Functions given as _public_ parameter will be automatically set as _shared_.

    ```javascript
    var a = new A ;
    a.fn() ; // true
    a.constructor.prototype.fn ; // function
    ```
    Thus you can give all your attributes and methods in the same `{}` parameter.

### hidden

Hidden members are similar to _public_, thus publicly accessible, but not enumerable from the instance.

```javascript
var A = Objectyve.Prototype() ;
A.public({
    p : 1
}) ;
A.hidden({
    _p : 2
}) ;
```

```javascript
var a = new A ;
a.p ; // 1
a._p ; // 2

var array = [] ;
for (var i in a) array.push(i) ;
array ; // ["p"]
a.constructor.prototype ; // ["p", "_p"]
```

This prevents `for-in` loops and `console.log` to list properties that shouldn't be altered/known by users.

### concealed

Concealed members are similar to _hidden_, but not enumerable from the prototype either.

```javascript
var A = Objectyve.Prototype() ;
A.public({
    p : 1
}) ;
A.concealed({
    _p : 2
}) ;
```

```javascript
var a = new A ;
a.p ; // 1
a._p ; // 2

var array = [] ;
for (var i in a) array.push(i) ;
array ; // ["p"]
a.constructor.prototype ; // ["p"]
```

This prevents `_p` to be inherited by another prototype.

### static

Static members are properties defined directly on the constructor.

```javascript
var A = Objectyve.Prototype() ;
A.static({
    s : true
}) ;
```

```javascript
A.s ; // true
var a = new A ;
a.s ; // undefined
```

This is exactly the same as writing `A.s = true`, but allows you to set multiple static members at once and prevents overwriting reserved properties.

### **Note** about _"private" shared/static_

There is no modifier function to perform a `private shared` or `private static` property, because there is no need. Just write a `var` in a private scope as seen here :

```javascript
var A = (function() {
    var privateVar = 123,
        constructor = Objectyve.Prototype() ;
    
    constructor.method({
        getVar : function() {
            return privateVar ;
        }
    }) ;
    
    return constructor ;
})() ;
```

### nested

Nested members are objects where each internal method refers to the instance.

```javascript
var A = Objectyve.Prototype() ;
A.public({
    p : 1
}) ;
A.nested({
    sub : {
        p : 2,
        getP : function() {
            return this.p ;
        },
        getSubP : function() {
            return this.sub.p ;
        }
    }
}) ;
```

```javascript
var a = new A ;
a.p ; // 1
a.sub.p ; // 2
a.sub.getP() ; // 1
a.sub.getSubP() ; // 2
```

This allows you to keep the `this` context into sub-objects so you can seperate properties into categories.

> **Warning :** This feature uses a `binding` process (but not `fn.bind()`), creating a function that will call the original one and setting a context to it. Avoid using nested properties for large amounts of instances.

----

## Initializing

### initialize / constructor

To define the function called once the instance is created, just write :

```javascript
var A = Objectyve.Prototype() ;
A.method({
    initialize : function() {
        console.log("new") ;
    }
}) ;
```

You can also call the `initialize` function...

```javascript
var A = Objectyve.Prototype() ;
A.initialize(function() {
    console.log("new") ;
}) ;
```

... or call the `constructor` function...

```javascript
var A = Objectyve.Prototype() ;
A.method({
    constructor: function() {
        console.log("new") ;
    }
}) ;
// Or...
A.constructor(function() {
    console.log("new") ;
}) ;
```

... but keep in mind that in JavaScript, `a.constructor` refers the function `A()` creating new instances. Though this will not alter the default `constructor` property but will set `initialize`.

### main

The `main` method is called a "static constructor", meaning a function called once the constructor is ready to use.

```javascript
var A = Objectyve.Prototype({
    static : {
        p : 1
    },
    main : function(self) {
        console.log(self.p) ;
    }
}) ; // 1
```

This is the same as setting a `constructor` method in a static class in Java.

### create

The `create` function is another way to create a new instance of a constructor.

```javascript
var A = Objectyve.Prototype() ;

var a = A.create() ;
// instead of...
a = new A() ;
```

This allows you to avoid using `new A` which for some reason looks against JavaScript's philosophy as it looks like a class-based way of instanciating.

----

## Inheritance & Augmentation

### extend

You are able to extend a Prototype with another, and only one, this way :

```javascript
var A = Objectyve.Prototype({
    public : {
        p : 1
    },
    static : {
        s : 2
    }
}) ;

var B = Objectyve.Prototype() ;
B.extend(A) ;

B.s ; // 2
var b = new B ;
b.p ; // 1
```

Though `concealed` properties cannot be inherited.

#### Parent accessors

* You can access the parent constructor with the `parent` static property.
    ```javascript
    var ParentOfB = B.parent ;
    // or
    var pb = new B.parent() ;
    ```

* You can also quickly access the parent prototype with the `super` static property.
    ```javascript
    var parentProto = B.super ;
    // or for old browsers
    var parentProto = B['super'] ;
    ```
    
    You can also access the `super`  to call its `initialize` method.
    ```javascript
    var B = Objectyve.Prototype() ;
    B.extend(A) ;
    B.initialize(function(arg1, arg2) {
        B.super.initialize.apply(this, arguments) ;
        // or
        B.super.initialize.call(this, arg1, arg2) ;
        
        // equals to
        A.prototype.initialize.apply(this, arguments) ;
    }) ;
    ```
    This equals to `super()` in Java.

    And finally, you can also call the parent's methods to apply on the instance.
    ```javascript
    B.method({
        perform : function(arg) {
            B.super.perform.call(this, arg) ;
        }
    }) ;
    ```


### mixin / augment

Beside inheritance, you can mix a Prototype in with multiple others. Though there are two different ways to perform a mixin.

* Deep mixin
    
    A deep mixin will copy all `shared`, `public` and `hidden` members. To perform this, just give the constructor as parameter :
    ```javascript
    var A = Objectyve.Prototype({
        public : {
            p : 1
        },
        hidden : {
            h : 2
        },
        shared : {
            fn : function() {
                return 123 ;
            }
        }
    }) ;
    
    var B = Objectyve.Prototype() ;
    B.mixin(A) ; // Deep mixin
    // or B.augment(A) ;
    
    var b = new B ;
    b.fn() ; // 123
    b.p ; // 1
    b.h ; // 2
    ```

* Basic mixin
    
    A basic mixin will copy all properties in the `constructor.prototype`, so only `shared` properties. This is the default mixin way in JavaScript. To perform this, give the `prototype` of the constructor as parameter :
    ```javascript
    // [...]
    
    var B = Objectyve.Prototype() ;
    B.mixin(A.prototype) ; // Basic mixin
    // or B.augment(A.prototype) ;
    
    var b = new B ;
    b.fn() ; // 123
    b.p ; // undefined
    b.h ; // undefined
    ```
    
    You can also mix in with any object :
    
    ```javascript
    var B = Objectyve.Prototype() ;
    B.mixin({
        a : 1,
        b : 2,
        c : 3
    }) ;
    ```

## Module & Dependency

### module

This is the first method for defining modules manually **without using AMD** dependency system.
This function will generate the "tree package" in the global scope to access the constructor.

```javascript
(function() {
    Objectyve.Prototype()
        .module('path.to.A')
        // or
        .module('path/to/A')
        .static({ s : 1 }) ;
}) ;

path.to.A.s ; // 1
```

If elements of the path already exist, they will be altered.

```javascript
path = {
    to : {}
} ;

Objectyve.Prototype()
    .module('path.to.A')
    .static({ s : 1 }) ;

path.to.A.s ; // 1
```

This means you'll have to be careful to not overwrite your modules.

```javascript
Objectyve.Prototype().module('A/B').static({ b : 1 }) ;
Objectyve.Prototype().module('A').static({ a : 1 }) ; // overwrites A !

A.B ; // undefined
```

* Client-side, modules root is `window`.
* Server-side, modules root is `GLOBAL`.

### define

This is the second method for defining modules **with AMD** dependency system.

* Client-side, you will have to plug [RequireJS](http://requirejs.org/ "RequireJS home page") (or another AMD library) in order to have a module loader and use this method.
  _See section 'Configuration > plug'._
    
    ```javascript
    // A.js
    Objectyve.Prototype()
        .static({ s : 1 })
        .define() ;
    ```
    
    ```javascript
    // main.js
    require(['A'], function(A) {
        A.s ; // 1
        var a = new A() ;
    }) ;
    ```
    
    If you need to specify a path manually, just give the path as parameter.
    
    ```javascript
    // compiled.js
    Objectyve.Prototype()
        .static({ s : 1 })
        .define('path/to/A') ;
    ```
    
    If you use `module` too, just give `true` to automatically give the module name as parameter.
    
    ```javascript
    Objectyve.Prototype()
        .module('path.to.A')
        .define(true) ; // same as `.define('path/to/A')`
    ```

* Server-side, this will use the default dependency manager (`module.export`).
    
    ```javascript
    // A.js
    Objectyve.Prototype()
        .static({ s : 1 })
        .define() ;
    ```
    
    ```javascript
    // main.js
    var A = require('./A') ;
    
    A.s ; // 1
    var a = new A() ;
    ```

## Configuration

### plug

**Objectÿve** has a `plug` function that allows you to include extra libraries to it.

```javascript
Objectyve.plug({
    name : value
}) ;
```

The `name` key is the library name to plug (see list below), the `value` could be a _boolean_ or directly the _instance of the library_.

> **Available plugins :**
> 
> * **amd** : _boolean_
>     Will use `require()` or `define()` function for your modules dependencies.
>     _Usable with [RequireJS](http://requirejs.org/ "RequireJS home page")._

### configure

You can configure the framework with various settings :
```javascript
Objectyve.configure({
    option : value
}) ;
```

> **Available options :**
> 
> * **silent** : _boolean_
>     Enables/Disables all `echo` console logs. _See section 'Extra > echo'._
>     - Default value : _false_
>     - Example : `{ silent : false }`
> 
> * **strict** (bêta) : _number_
>     Set the strict level, _doing nothing_ / _sending warnings_ / _throwing errors_ depending on conditions.
>     - Values : **NONE** | **LOW** | **HIGH**
>     - Default value : _NONE_
>     - Example : `{ strict : Objectyve.strict.NONE }`
> 
> * **debug** (bêta) : _number_
>     Set the debug value, logging various information.
>     - Values : **NONE** | **MEDIUM** | **ALL**
>     - Default value : _NONE_
>     - Example : `{ strict : Objectyve.debug.NONE }`

### **Note** about _plug_ and _configure_

Those two functions are also available directly on your Prototypes, giving exclusive configuration.
```javascript
var A = Objectyve.Prototype() ;
A.plug({
    amd : true
}) ;
A.configure({
    debug : Objectyve.debug.ALL
}) ;

// or directly
var A = Objectyve.Prototype({
    plug : {
        amd : true
    },
    configure : {
        debug : Objectyve.debug.ALL
    }
}) ;
```

By default, every Prototype option refers to the global framework options.
This will overwrite configurations only for the Prototype `A`.


## Extras

### metadata

Retrieves your Prototype metadata.
When you set properties with different modifiers (`public`, `hidden`, etc.), those are stored in a hidden object called `__metadata__` as the skeleton of your Prototype.
```javascript
var A = Objectyve.Prototype()
    .public({ p : 1 }) ;

console.log(A.metadata()) ; // Object
```

### options

Retrieves your Prototype options.
```javascript
var A = Objectyve.Prototype()
    .configure({
        strict : Objectyve.strict.HIGH
    }) ;

console.log(A.options()) ; // Object, see section 'Configuration > configure'
```

### plugins

Retrieves your Prototype plugins.
```javascript
var A = Objectyve.Prototype()
    .plug({
        amd : true
    }) ;

console.log(A.plugins()) ; // Object, see section 'Configuration > plug'
```

### updatePrototype

For old browsers such as _Internet Explorer 8_ (under ECMAScript 4), if you alter the default Prototype constructor's prototype (where all the API methods are), you'll have to update every Prototype you've created in order to get the new functions.

```javascript
var A = Objectyve.Prototype() ;

// Adding new 'private()' modifier function
Objectyve.Constructor.private = function(props) { ... } ;

A.private({
    p : 1
}) ; // Will fail with old browsers.

A.updatePrototype() ;
A.private({
    p : 1
}) ; // Will work for all browers.
```

_See section 'Customization'._

## Objectÿve { }

### Attributes

* **ECMAScript**
  Detected JavaScript version, from 4 to 6.

----

* **debug**
  Debug level constants.
  - NONE
  - MINIMAL
  - ALL

* **strict**
  Strict level constants.
  - NONE
  - LOW
  - HIGH

* **options**
  Global options.

* **plugins**
  Global plugins.

_See section 'Configuration > configure'._

----

### Methods

#### noConflict

Returns the instance of itself and retrieve the original one.
```javascript
var _Objectyve = Objectyve.noConflict() ;
// Now the framework is no more accessible outside this scope.
```

#### version

Returns the build version of the framework.
```javascript
Objectyve.version() ; // 102003
// Example for version 1.2.3
```

You can also get custom information about the version :

> **Version information :**
> 
> * **core** : _number_
>   Core version of the framework, meaning major upgrade of the framework.
>   Example : _For version 1.2.34, `Objectyve.version.core` returns **1**._
> 
> * **update** : _number_
>   Update version, meaning major updates made to the framework.
>   Example : _For version 1.2.34, `Objectyve.version.update` returns **2**._
> 
> * **correction** : _number_
>   Correction version, meaning minor modifications.
>   Example : _For version 1.2.34, `Objectyve.version.correction` returns **34**._
> 
> * **build** : _number_
>   Build version, giving the exact version number.
>   Example : _For version 1.2.34, `Objectyve.version.build` returns **102034**._
> 
> * **date** : _Date_
>   Date of the version release. Use `.getTime()` to get a timestamp of it.
>   Example : _`Objectyve.version.date.getTime()` returns **1416149334958**._
> 
> * **toString** : _function_
>   Returns a whole version description.
>   Example : _`Objectyve.version.toString()` returns **Objectÿve version 1.2.3 (build 102003) dated 2014.11.16 / ECMAScript 6 detected**._

This information can be useful if you need to know which version of the framework is used and if it is compatible with your application.

#### configure

Configures the framework. _See section 'Configuration > configure'._

#### plug

Plugs libraries to the framework. _See section 'Configuration > plug'._

#### echo

Echoes given values to the console and returns it.

```javascript
// Without echo
console.log(value) ;
if (value) { /*...*/ }

// With echo
var echo = Objectyve.echo ;
// Or just globalize it, see section 'Objectÿve { } > methods > globalize'.

if (echo(value)) { /*...*/ }
```

_Inspired of the shell command `echo`._

#### warn

Sends a warning to the console, equals to `console.warn`.

```javascript
Objectyve.warn("An error occured somewhere.") ;
// /!\ An error occured somewhere.
```

#### globalize

Allows you to set global references to the framework.
```javascript
var A = Objectyve.Prototype() ;
Objectyve.echo(A) ;

// Globalizing
Objectyve.globalize('Prototype', 'echo') ;

var A = Prototype() ;
echo(A) ;
```

#### util

A set of various utility functions :

> **Objectyve.util :**
> 
> * **is.\*()** : _boolean_
>   Returns if the given parameter is of the asked type.
>   Example : `Objectyve.util.is.object(o)`
>   - **object** : Returns if `o` is an object strictly (and not an array or null).
>   - **bool** : Returns if `o` is a boolean.
>   - **array** : Returns if `o` is an array.
>   - **number** : Returns if `o` is a valid number.
>   - **string** : Returns if `o` is a string.
>   - **funct** : Returns if `o` is a function.
>   - **container** : Returns if `o` is an object or an array.
>   - **empty** : Returns if `o` is empty (for an array or an object).
>   - **ofType** : Returns the exact type of `o`, as a string (`"object"`, `"boolean"`, `"array"`, `"function"`, `"number"`, `"nan"`, `"function"`, `"string"`, `"null"`, `"undefined"`).
> 
> * **create** : _object_
>   Returns an instance of a raw function with a given prototype. This function equals to `Object.create` or is a polyfill for old browsers.
>   Example : `var a = Objectyve.util.create(A.prototype) ;`
> 
> * **clone** : _any_
>   Clones the given parameter. If it is an object or an array, it will clone all its properties to remove all references.
>   Example : `var clone = Objectyve.util.clone(obj) ;`
> 
> * **copy** : _any_
>   Copy all properties present in the source to the target, and returns the target (though the target will be altered anyway).
>   Example : `Objectyve.util.copy(toTarget, fromSource) ;`
> 
> * **copySafe** : _any_
>   Same as `copy` but change the key for reserved properties.
>   Example : `Objectyve.util.copySafe(target, { constructor : fn }) ;`
>   - "**constructor**" will be renamed as "**initialize**".
> 
> * **list** : _array_
>   Flattens given arrays and objects into one array.
>   Example : `var flat = Objectyve.util.list(obj, [1, 2, 3], ['a', 'b']) ;`
> 
> * **require** : _null_
>   Loads modules from a given array or object, stores them to an array or object and sends it to the callback function.
>   Example with **array** :
>   `Objectyve.util.require(['path/to/A'], function(deps) { var A = deps[0] }) ;`
>   Example with **object** :
>   `Objectyve.util.require({ A:'path/to/A' }, function(deps) { var A = deps.A }) ;`
>   - **Client-side**, this requires to plug an **AMD loader** (such as [RequireJS](http://requirejs.org/ "RequireJS home page")) or it won't store anything.
>   - **Server-side**, this will call the default `require()` function (except if [RequireJS](http://requirejs.org/ "RequireJS home page") is plugged in).

Note that some utilities are meant to be used for customization. _See section 'Customization'._

## Customization

Readme in progress.
Further documentation in this section coming soon !

## About

**Objectÿve** is my first JavaScript library, started as a personal project in 2012. It has known multiple deep changes and philosophy as I was learning more and more advanced JavaScript.

First I wanted to bring the classic object-oriented way of coding into JS, but then I realized it was a mistake. Classes, abstraction and privacy are not meant to be used in a prototypal language. However I think that some features and way-of-coding of that framework can bring a plus to the common way of making prototypes.
