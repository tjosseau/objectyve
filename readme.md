
# Objectÿve

Objectÿve is a light JavaScript framework to simplify your prototypes definition.

* **JS 1.3** : Compatible with ECMAScript 4 and higher `Internet Explorer >= 8`

* **AMD** : AMD compatibility `RequireJS`

* **Node** : Server-side compatibility `Node.js`

----

## Examples

To have an overview of how it may be used, I suggest you to take a look at those script examples below :

- Basic
- Simple
- Partiated

----

## API Documentation
 
### Prototype

* Definition

> **Definition:** "Prototype-based programming is a style of object-oriented programming in which behaviour reuse (known as inheritance) is performed via a process of cloning existing objects that serve as prototypes."
> http://en.wikipedia.org/wiki/Prototype-based_programming

In **Objectÿve**, a `Prototype` is prototype-based constructor which will instanciate objects the same way as by default in JavaScript.

* Creating a new Prototype

To build a new `Prototype`, just call the function as below :
```javascript
var A = Objectyve.Prototype() ;
```
> **Note :** Constructors are generally named with a capital letter first.

You can now instanciate multiple `A` objects the same way as commonly.

```javascript
var a = new A() ;
```

----

### Setting properties

* public / attr

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

* shared / methods

Shared members are attributes and methods set in the `prototype` of the constructor. This means that every object will inherit from/share that prototype.
```javascript
var A = Objectyve.Prototype() ;
A.shared({
    p : 1,
    getP : function() {
        return this.p ;
    }
}) ;
```

```javascript
var a = new A ;
a.p ; // 1
a.getP() ; // 1

a.p = 2 ;
var a2 = new A ;
a2.p ; // 2, as both a and a2 share the same property.
```

----

> **Note about _public_ and _shared_ properties :**

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

**1.** Objects given as _public_ parameter will be automatically _cloned_.

```javascript
var a = new A ;
a.obj.p = 2 ;

var a2 = new A ;
a2.obj.p ; // 1
```

**2.** Functions given as _public_ parameter will be automatically set as _shared_.

```javascript
var a = new A ;
a.fn() ; // true
a.constructor.prototype.fn ; // function
```
Thus you can give all your attributes and methods in the same `{}` parameter.

----

* hidden

Hidden members are similar to _public_, thus publically accessible, but not enumerable from the instance.

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

This prevents `console.log` to list properties that shouldn't be known/altered by users.

* concealed

Concealed members are similar to _shared_, but not enumerable from the prototype either.

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

* static

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

This is exactly the same as writing `A.s = true`, but allows you to set multiple static members and prevents overwriting reserved properties.

* nested

Nested members are objects where each methods inside refers to the instance.

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

> **Warning :** This feature uses `binding` process, setting a context to a function. Avoid using nested properties for large amounts of instances.

----

### Initializing

* initialize / constructor

To define the function called once the instance is created, just write :

```javascript
var A = Objectyve.Prototype() ;
A.methods({
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
A.methods({
    constructor: function() {
        console.log("new") ;
    }
}) ;
// Or...
A.constructor(function() {
    console.log("new") ;
}) ;
```

... but keep in mind that in JavaScript, `a.constructor` refers the function `A()` creating new instances.

* main

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

* create

The `create` function is another way to create a new instance of a constructor.

```javascript
var A = Objectyve.Prototype() ;

var a = A.create() ;
// instead of...
a = new A() ;
```

This allows you to avoid using `new A` which is against JavaScript's philosophy (for some developers) as it looks like a class-based way of instanciating.

----

### Inheritance & Augmentation

* extend

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

* mixin / augment

Besides inheritance, you can mixin a Prototype with multiple others. This will copy all shared properties to it.

```javascript
...
```

// See how to "augment" public and hidden members...

---------------------------------------
   ** shared / methods

   ** hidden

   ** concealed

   ** static

   ** nested
        /!\ Uses bind()

* Initializing

     ** initialize / constructor

     ** main

     ** create

* Inheritance & Augment

     ** extend

     ** mixin / augment

* AMD 

     ** module

     ** define

* Configuration

     ** plug

     ** configure

* Extras

     ** metadata

     ** options

     ** plugins

     ** updatePrototype
          Only for old browsers...

* Options & Utilities

     Attributes (read-only)
     ** ECMAScript

     ** debug

     ** strict

     ** options

     ** plugins

     Methods
     ** noConflict

     ** version

     ** configure

     ** plug

     ** globalize

     ** util
          *** is
          *** create // Object.create || polyfill
          *** clone
          *** copy
          *** copySafe // Copy except reserved keys
          *** list
          *** require

     ** echo

     ** warn

* Customization

* About




----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----
----


## First step

After having loaded the `Objectyve.js` script you are able to use it this way :

    ```javascript
    var Living = Objectyve.Prototype() ;
    
    new Living() ;
    ```

And here is the best way to create a complete prototype :

    ```javascript
    var Living = Objectyve.Prototype({
        static:
        {
            A : 1 ............................................................
        }
    }) ;
    ```

Then you may want to add some attributes and methods to it :

    ```javascript
    Living.public({
        name : '',
        age : 0,
    
        speak : function() {
            return 'rawr' ;
        }
    }) ;
    Living.prototype({
        randomValue : Math.random()
    }) ;
    Living.static({
        description : "Something alive."
    }) ;
    
    // This code is a simpler version of :
    
    Living = function() {
        this.name = "" :
        this.age = 0 ;
        // No function setting here, directly on the prototype.
    } ;
    Living.prototype = {
        randomValue : Math.random(),
        speak : function() {
            return 'rawr' ;
        }
    } ;
    Living.description = "Something alive." ;
    ```

You can also chain functions as promises to build your Prototype :

    ```javascript
    var Living = new Objectyve.Prototype()
    .static({
        description : "Something alive."
    })
    .prototype({
        randomValue : Math.random()
    })
    .public({
        name : '',
        age : 0,
    
        speak : function() {
            return 'rawr' ;
        }
    }) ;
    ```

## Usage and details

* **Building constructor and prototype**

    ```javascript
    var Machin = new Objectyve.Prototype() ;
    ```

    The `Machin` variable is now a constructor, having an empty prototype.

* **Public members**

    ```javascript
    Machin.public({
        a : 1,
        b : 2,

        test : function() {
            return 3 ;
        }
    }) ;
    ```

    The constructor will now set `a` and `b` for the next instances, and `test` has been added to the prototype.
    You are then able to add other attributes anytime you want :

    ```javascript
    Machin.public({
        c : 3
    }) ;

    console.log(new Machin()) ; // { a:1, b:2, c:3 }
    ```

* **Prototype attributes**

    You are able to set attributes to the prototype directly and not the instance :

    ```javascript
    Machin.prototype({
        d : 4
    }) ;

    var m = new Machin() ;
    console.log(m) ; // { a:1, b:2, c:3 }
    console.log(m.d) ; // 4
    console.log(m.prototype.d) ; // 4
    ```

* **Note : Public vs Prototype**

    The `.public({})` function set the non-function properties to the instance, whereas `.prototype({})` function set all the properties to the prototype. This means every instance will share the same properties defined in their prototype.

    ```javascript
    A.public({ pu : true }).prototype({ pr : true }) ;
    var a = new A() ;
    console.log(a) ; // { pu:true }
    console.log(a.pr) ; // true
    
    var a2 = new A() ;
    A.prototype({ pr : false }) ; // Prototype modification
    console.log(a2.pr) ; // false
    console.log(a.pr) ; // false
    
    a.pr = 123 ; // Instance (and not prototype) modification
    console.log(a.pr) ; // 123
    console.log(a2.pr) ; // false

    A.prototype({ pr : 456 }) ;
    console.log(a.pr) ; // 123
    console.log(a2.pr) ; // 456
    console.log(a) // { pu:true, pr:123 }
    console.log(a2) // { pu:true }
    ```

    That is why all methods have to be set in the prototype to be shared with all instances and not duplicated. However, attributes should be set in the constructor to be independant or in the prototype to refer a shared property.

* **Privacy**

    JavaScript permits objects to have hidden fields. Objectyve allows users to define both "hidden" and "concealed" members which means not allowing to enumerate the given properties.

    - **Hidden** are public accessible but not enumerable from the instance :

    ```javascript
    Machin.public({
        a : 1
    }).hidden({
        _a : 10
    }) ;
    
    var m = new Machin() ;
    console.log(m) ; // { a:1 }
    console.log(m._a) ; // 10
    console.log(m.prototype) ; // { a:1, _a:10 }

    var props = [] ;
    for (var p in m) props.push(p) ;
    console.log(props) ; // ["a"]
    ```

    - **Concealed** are public accessible but not enumerable from the instance neither from the prototype :

    ```javascript
    Machin.public({
        a : 1
    }).hidden({
        _a : 10
    }).concealed({
        __a : 100
    }) ;
    
    var m = new Machin() ;
    console.log(m) ; // { a:1 }
    console.log(m.__a) ; // 100
    console.log(m.prototype) ; // { a:1, _a:10 }

    var props = [] ;
    for (var p in m) props.push(p) ;
    console.log(props) ; // ["a"]

    props = [] ;
    for (p in m.prototype) props.push(p) ;
    console.log(props) ; // ["a", "_a"]
    ```

* **Static members**

    Static members are properties defined directly on the constructor :

    ```javascript
    Machin.static({
        m : 0,
        n : 1,

        mn : function() {
            return this.m + Machin.n ; // Both 'this' and 'Machin' refers the constructor (only for static methods).
        }
    }) ;

    console.log(Machin.m) ; // 0
    console.log(Machin.mn()) ; // 1
    ```

* **Inheritance and mixins**

    - **Extend** :
    Prototypes can inherit from one other prototype :

    ```javascript
    var Chose = new Objectyve.Prototype()
    .extend(Machin) ;

    var c = new Chose() ;
    console.log(c instanceof Machin) ; // true
    console.log(c.a) ; // 1
    ```

    - **Mixin** :
    Prototypes can mix in multiple prototypes or objects :

    ```javascript
    var Chose = new Objectyve.Prototype()
    .mixin(Machin, { aa : 2 }) ;

    var c = new Chose() ;
    console.log(c instanceof Machin) ; // false
    console.log(c.a) ; // 1
    console.log(c.aa) ; // 2
    ```

## Note

Readme in progress.
Further documentation coming soon !

