
# Objectÿve

Objectÿve is a light JavaScript framework to simplify your prototypes definition.

* **JS 1.8** : Compatible with client-side JavaScript 1.8 and higher `I.E. >= 9`

* **AMD** : AMD compatibility `RequireJS`

* **Node** : Server-side compatibility `Node.js`

## First step

After having loaded the `Objectyve.js` script you are able to use it this way :

```javascript
var Living = new Objectyve.Prototype() ;

new Living() ;
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

// This code is a simpler version of :
Living = function() {
    this.name = "" :
    this.age = 0 ;
} ;
Living.prototype = {
    speak : function() {
        return 'rawr' ;
    }
} ;
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
