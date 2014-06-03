
/**
 * Objectÿve framework bêta
 *
 * @author      Thomas Josseau
 * @version     0.5.6
 * @date        2014.06.03
 * @link        https://github.com/tjosseau/objectyve
 *
 * @description
 *      JavaScript framework to simplify prototypes construction.
 *      (Second core bêta version)
 */

void function(jsCore) {
    // "use strict" ; // Strict mode - Disabled in production
    
//---------------------------------------------------------------------------------------------------------------------------//
//      Compatibility checking
//---------------------------------------------------------------------------------------------------------------------------//

    // Defines the global container and local reference to the framework.
    var root, ECMAScript, Objectyve, __Objectyve ;
    // Argument 'jsCore' as type of JavaScript core between a client (browser) and a server (here Node.js).
    switch (jsCore) {
        case 'client' : root = window ;       break ;     // Client side JavaScript
        case 'server' : root = GLOBAL ;       break ;     // Server side JavaScript (with Node.js)
        default :       root = {} ;           break ;     // Unknown context
    }

    if (typeof Object.setPrototypeOf === 'function') ECMAScript = 6 ;
    else if (typeof (function() {}).__proto__ === 'function') ECMAScript = 5 ;
    else ECMAScript = 4 ;

    // Stores the possibly already defined framework. Use `Objectyve.noConflict()` to get a concealed instance.
    __Objectyve = root.Objectyve ;

//---------------------------------------------------------------------------------------------------------------------------//
//      Constants
//---------------------------------------------------------------------------------------------------------------------------//

        // Version of Objectyve - accessible with `Objectyve.version()`
    var VERSION = [
            0,                      // Version of framework's Core
            5,                      // Updates - Modifications
            6,                      // Minor updates - Corrections
            new Date(
                2014,               // Year \
                6               -1, // Month >---- of last update
                3                   // Day  /
            )
        ],

        options = {
            silent : false,
            strict : 0,
            debug : 0
        },

        plugins = {
            requirejs : null
        },

        reserved = {
            constructor : 'initialize'
        },

        init = function() {
        // Preparing framework //

            Objectyve.options.strict = Objectyve.strict.LOW ;

            var to0n = function(num) { return num < 10 ? '0'+num : ''+num ; } ;
            // Generating a comprehensive version accessor of Objectÿve.
            Objectyve.version.core = VERSION[0] ;
            Objectyve.version.update = VERSION[1] ;
            Objectyve.version.correction = VERSION[2] ;
            // Build version of framework (i.e. 102034 means 1.2.34).
            Objectyve.version.build = 100000 * VERSION[0] + 1000 * VERSION[1] + VERSION[2] ;
            Objectyve.version.date = VERSION[3].getTime() ;
            // Adds a toString version of Objectÿve version.
            Objectyve.version.toString = function() {
                return 'Objectÿve version '
                    + Objectyve.version.core + '.'
                    + Objectyve.version.update + '.'
                    + Objectyve.version.correction
                    + ' (build ' + Objectyve.version() + ') dated ' + VERSION[3].getFullYear() + '.'
                                                                + to0n(VERSION[3].getMonth()+1) + '.'
                                                                + to0n(VERSION[3].getDate()) ;
            } ;

        // Exporting //
            // AMD compatibility, defines Objectÿve as a require-able module.
            if (typeof root.define === 'function') root.define(Objectyve) ;
            // Exports Objectÿve as a module for Node.js.
            if (jsCore === 'server') module.exports = Objectyve ;
            // Global access to Objectÿve.
            root.Objectyve = Objectyve ;
        },

    // Utilities //

        create = ECMAScript > 4 ?
            Object.create :
            (function() {
                var F = function() {} ;
                return function(o) {
                    F.prototype = o ;
                    return new F() ;
                } ;
            })(),
    
        // Reference to original method from Object prototype.
            // @param object <object> : Object to define a special property
            // @param property <string> : Name of property to alter
            // @param options <object> : Set of property options
        defineProperty = ECMAScript > 4 ?
            Object.defineProperty :
            function() {
                try { return Object.defineProperty.apply(arguments[0], arguments) ; }
                catch (e) {
                    if (Objectyve.options.debug >= Objectyve.debug.MEDIUM) warn(e) ;
                }
            },

        // Displays a message in the browser log as returning the first given argument.
        // This allows both echoing the value(s) and getting the first back
        // (i.e. 'return test ;' equals to 'return echo(test, ' is a variable.') ;' into the script).
        // This method can be silent if 'silent' option is set as true.
            // @param arguments* <any> : Given value(s) to display
            // @return <any> : If only one argument, first value given ; else all the arguments.
        echo = function()
        {
            if (!options.silent && typeof console !== 'undefined') {
                if (ECMAScript > 4) console.log.apply(console, arguments) ;
                else console.log(arguments[0]) ;
            }
            return arguments[0] ;
        },

        // Displays a warning message in the browser info.
            // @param string <string> : Message to warn
        warn = function(string)
        {
            if (!options.silent && typeof console !== 'undefined') console.info('/!\\ '+string) ;
        },

        // Set of type checking
            // @param o <any> : Variable to check type
            // @return <boolean>
        is = {
            object :        function(o) { return o != null && typeof o === 'object' && !is.array(o) ; },
            bool :          function(o) { return typeof o === 'boolean' ; },
            array :         function(o) { return Object.prototype.toString.call(o) === '[object Array]' ; },
            number :        function(o) { return typeof o === 'number' && !isNaN(parseFloat(o)) && isFinite(o) ; },
            string :        function(o) { return typeof o === 'string' ; },
            funct :         function(o) { return typeof o === 'function' ; },
            container :     function(o) { return is.object(o) || is.array(o) ; },
            empty :         function(o) { for (var p in o) if (o.propertyIsEnumerable(p)) return false ; return true ; },
            
            ofType : function(o) {
                if (typeof o === 'object') {
                    if (is.object(o)) return 'object' ;
                    else if (is.array(o)) return 'array' ;
                    else return 'null' ;
                }
                else if (typeof o === 'number') {
                    if (is.number(o)) return 'number' ;
                    else return 'nan' ;
                }
                else return typeof o ;
            }
        },

        has = {
            value :         function(v, a) { var i = a.length ; do if (a[i] === v) return true ; while(i--) ; return false ; }
        },

        // Clones an object for independant object copies.
            // @param object <object> : Object to clone
            // @return <object> : Cloned object
        clone = function(object)
        {
            var isPrimitive,
                cloned ;
            if (is.object(object)) isPrimitive = !(cloned = {}) ;
            else if (is.array(object)) isPrimitive = !(cloned = []) ;
            else {
                isPrimitive = true ;
                cloned = object ;
            }
            
            if (!isPrimitive) {
                for (var p in object) {
                    if (!object.propertyIsEnumerable(p)) continue ;

                    // Recursive cloning
                    if (is.container(object[p])) cloned[p] = clone(object[p]) ;
                    else cloned[p] = object[p] ;
                }
            }
            
            return cloned ;
        },

        // Simple copy (by reference if contains objects).
            // @param context <object> : Copy properties to
            // @param object <object> : Copy properties from
            // @return <object> : Copied object
        copy = function(context, object)
        {
            for (var p in object)
                if (object.propertyIsEnumerable(p))
                    context[p] = object[p] ;
            return context ;
        },

        copySafe = function(context, object)
        {
            for (var p in object)
                if (object.propertyIsEnumerable(p)) {
                    if (p in reserved)
                        context[reserved[p]] = object[p] ;
                    else
                        context[p] = object[p] ;
                }
            return context ;
        },

        list = function()
        {
            return [].concat.apply([], arguments).filter(function(el, i, self) {
                return el != null && self.indexOf(el) === i ;
            }) ;
        },

        applyFn = function(context, fn)
        {
            return function() {
                return fn.apply(context, arguments) ;
            } ;
        },

        configure = function(opts)
        {
            if (opts.silent != null) this.silent = !!opts.silent ;

            if (opts.debug != null) {
                if (opts.debug === false) this.debug = 0 ;
                else if (opts.debug === true) this.debug = 1 ;
                else if (opts.debug === 0) this.debug = 0 ;
                else if (opts.debug > 0 && opts.debug <= 3) this.debug = opts.debug ;
            }

            if (opts.strict != null) {
                if (opts.strict === false) this.strict = 0 ;
                else if (opts.strict === true) this.strict = 1 ;
                else if (opts.strict === 0) this.strict = 0 ;
                else if (opts.strict > 0 && opts.strict <= 2) this.strict = opts.strict ;
            }
        } ;

//---------------------------------------------------------------------------------------------------------------------------//
//      Objectyve Core
//---------------------------------------------------------------------------------------------------------------------------//

    Objectyve = {

    // Variables //
        ECMAScript : ECMAScript,

        debug : {
            SILENT : 0,
            MINIMAL : 1,
            MEDIUM : 2,
            ALL : 3
        },

        strict : {
            NONE : 0,
            LOW : 1,
            HIGH : 2
        },

    // Settings //

        options : options,

        plugins : plugins,

        noConflict : function()
        {
            root.Objectyve = __Objectyve ;
            return Objectyve ;
        },

        // Returns Objectyve's version information.
            // @return <int> : framework's build version
        version : function()
        {
            return this.version.build ;
        },

        configure : function(opts)
        {
            configure.call(options, opts) ;

            return this ;
        },

        plug : function(plugs)
        {
            copy(plugins, plugs) ;

            return this ;
        },
        
        globalize : function()
        {
            for (var m=0, ml=arguments.length ; m<ml ; m++)
                root[arguments[m]] = Objectyve[arguments[m]] ;

            return this ;
        },

    // Public Utilities //

        util : {
            is : is,
            has : has,
            create : create,
            clone : clone,
            copy : copy,
            copySafe : copySafe,
            list : list
        },

        echo : echo,
        warn : warn,

    // Engines //

        Skeleton : {
            modifiers : {
                public : {},
                hidden : {},
                shared : {},
                concealed : {},
                nested : {}
            },

            set : function(constructor, member, visibility)
            {
                constructor.__meta__.skeleton[visibility][member] = true ;
            },

            unset : function(constructor, member)
            {
                var meta = constructor.__meta__ ;
                for (var v in meta.skeleton) {
                    if (meta.skeleton[v][member]) {
                        if (meta.options.strict === Objectyve.strict.HIGH)
                            throw "Member named '"+member+"' is already defined as "+v+"." ;
                        else if (meta.options.strict === Objectyve.strict.LOW)
                            warn("Member named '"+member+"' is already defined as "+v+".") ;
                        else delete meta.skeleton[v][member] ;
                        break ;
                    }
                }
            }
        },
        
        Constructor : {
        // Getters //
            
            metadata : function()
            {
                return this.__meta__ ;
            },

            options : function()
            {
                return this.__meta__.options ;
            },

            plugins : function()
            {
                return this.__meta__.plugins ;
            },

        // Setters //

            create : function()
            {
                var instance = create(this.prototype) ;
                return Objectyve.Instance.init.call(instance, this, arguments) ;
            },

            module : function(fullname)
            {
                var tree = fullname.replace(/\./g, '/').split('/'),
                    size = tree.length,
                    _root = root ;
                
                for (var word, w=0, wl=size ; w<wl ; w++) {
                    word = tree[w] ;

                    if (_root[word] == null) _root[word] = {} ;
                    else if (this.options().strict >= Objectyve.debug.MEDIUM)
                        warn("Module root '"+fullname+"' has an already defined branch, it will be mutated.") ;

                    if (w < size-1) _root = _root[word] ;
                    else _root[word] = this ;
                }

                return this ;
            },

            extend : function(constructor)
            {
                this.prototype = create(constructor.prototype) ;
                if (constructor.__meta__ && constructor.__meta__.skeleton) {
                    copy(this.__meta__.skeleton.public, constructor.__meta__.skeleton.public) ;
                    copy(this.__meta__.skeleton.hidden, constructor.__meta__.skeleton.hidden) ;
                }
                this.parent = constructor ;
                this.prototype['super'] = constructor.prototype._constructor ;

                return this ;
            },

            mixin : function()
            {
                var args = list.apply(null, arguments),
                    constructor ;

                for (var c=0, cl=args.length ; c<cl ; c++) {
                    constructor = args[c] ;

                    if (constructor.prototype)
                        copy(this.prototype, constructor.prototype) ;
                    else if (is.object(constructor))
                        copy(this.prototype, constructor) ;
                    else throw "Cannot mixin '"+constructor+"' with a prototype. Mixins require a function or an object." ;

                    if (constructor.__meta__ && constructor.__meta__.skeleton) {
                        copy(this.__meta__.skeleton.public, constructor.__meta__.skeleton.public) ;
                        copy(this.__meta__.skeleton.hidden, constructor.__meta__.skeleton.hidden) ;
                    }
                }

                return this ;
            },

            augment : function()
            {
                this.mixin.apply(this, arguments) ;

                return this ;
            },

            public : function(properties)
            {
                properties = copySafe({}, properties) ;
                copy(this.prototype, properties) ;

                for (var p in properties) {
                    Objectyve.Skeleton.unset(this, p) ;
                    Objectyve.Skeleton.set(this, p, 'public') ;
                    defineProperty(this.prototype, p, {
                        writable : true,
                        enumerable : true,
                        configurable : true
                    }) ;
                }

                return this ;
            },

            hidden : function(properties)
            {
                properties = copySafe({}, properties) ;
                copy(this.prototype, properties) ;

                for (var p in properties) {
                    Objectyve.Skeleton.unset(this, p) ;
                    Objectyve.Skeleton.set(this, p, 'hidden') ;
                    defineProperty(this.prototype, p, {
                        writable : true,
                        enumerable : true,
                        configurable : true
                    }) ;
                }

                return this ;
            },

            shared : function(properties)
            {
                properties = copySafe({}, properties) ;
                copy(this.prototype, properties) ;

                for (var p in properties) {
                    Objectyve.Skeleton.unset(this, p) ;
                    Objectyve.Skeleton.set(this, p, 'shared') ;
                    defineProperty(this.prototype, p, {
                        writable : true,
                        enumerable : true,
                        configurable : true
                    }) ;
                }

                return this ;
            },

            concealed : function(properties)
            {
                properties = copySafe({}, properties) ;
                copy(this.prototype, properties) ;

                for (var p in properties) {
                    Objectyve.Skeleton.unset(this, p) ;
                    Objectyve.Skeleton.set(this, p, 'concealed') ;
                    defineProperty(this.prototype, p, {
                        writable : true,
                        enumerable : false,
                        configurable : true
                    }) ;
                }

                return this ;
            },

            static : function(properties)
            {
                copy(this, properties) ;

                return this ;
            },

            nest : function(nested)
            {
                for (var c in nested)
                    if (nested.propertyIsEnumerable(c))
                        this.__meta__.skeleton.nested[c] = clone(nested[c]) ;

                return this ;
            },
            
            initialize : function(fn)
            {
                this.public({
                    initialize : fn
                }) ;

                return this ;
            },
            
            constructor : function(fn)
            {
                this.initialize(fn) ;

                return this ;
            },

            main : function(fn)
            {
                this.static({
                    main : fn
                }) ;

                return this ;
            },

            plug : function(name, instance)
            {
                this.plugins()[name] = instance ;

                return this ;
            },

            configure : function(opts)
            {
                configure.call(this.options(), opts) ;

                return this ;
            },

            define : function(deps, callback)
            {
                if (this.plugins().requirejs) {
                    var _this = this ;
                    root.define(deps || [], function() {
                        if (is.funct(callback)) callback.apply(_this, arguments) ;
                        return _this ;
                    }) ;
                }
                else if (jsCore === 'server') {
                    var instances = [] ;
                    if (deps)
                        for (var d=0, dl=deps.length ; d<dl ; d++)
                            instances.push(require(deps[d])) ;
                    if (is.funct(callback)) callback.apply(this, instances) ;
                    module.exports = this ;
                }
                else if (this.options().debug >= Objectyve.debug.MINIMAL) {
                    warn("Constructor definition function 'define()' called without effect.") ;
                    if (is.funct(callback)) callback.call(this) ;
                }

                return this ;
            },
                
            // Updates Constructor prototype for old browsers.
            updatePrototype : function()
            {
                if (ECMAScript < 5) copy(this, Objectyve.Constructor) ;

                return this ;
            }
        },

        Instance : {
            perform : {
                ORDER : ['prototype', 'nested'],
                add : function(name, fn, position) {
                    if (name === 'ORDER' || name === 'add')
                        throw "Constructor perform function name '"+name+"' is reserved." ;
                    this[name] = fn ;

                    var length = this.ORDER.length,
                        p = -1,
                        a = 0,
                        order = [] ;

                    if (position) {
                        if (position === 'first') p = 0 ;
                        else if (position.indexOf('before:') === 0)
                            p = this.ORDER.indexOf(position.substring(7)) ;
                        else if (position.indexOf('after:') === 0)
                            p = this.ORDER.indexOf(position.substring(6))+1 ;
                    }
                    if (p === -1) p = length ;

                    for (var o=0, ol=length ; o<ol ; o++) {
                        if (o === p) a++ ;
                        order[o+a] = this.ORDER[o] ;
                    }
                    order[p] = name ;

                    this.ORDER = order ;
                },

                //////////////////////////////////////////////////////////////

                prototype : function(constructor) {
                    var property ;

                    for (var p in constructor.prototype) {
                        if (constructor.prototype.propertyIsEnumerable(p)) {
                            property = constructor.prototype[p] ;
                            if (is.funct(property)) continue ;

                            if (constructor.__meta__.skeleton.public[p]) {
                                this[p] = clone(property) ;
                            }
                            else if (constructor.__meta__.skeleton.hidden[p]) {
                                this[p] = clone(property) ;
                                defineProperty(this, p, {
                                    enumerable : false,
                                    configurable : true
                                }) ;
                            }
                        }
                    }

                    for (var pp in constructor.__meta__.skeleton.concealed) {
                        property = constructor.prototype[pp] ;
                        if (is.funct(property)) continue ;

                        this[pp] = clone(property) ;
                        defineProperty(this, pp, {
                            enumerable : false,
                            configurable : true
                        }) ;
                    }
                },

                nested : function(constructor) {
                    var property ;
                    for (var cl in constructor.__meta__.skeleton.nested) {
                        if (!is.object(this[cl])) this[cl] = {} ;
                        for (var clp in constructor.__meta__.skeleton.nested[cl]) {
                            property = constructor.__meta__.skeleton.nested[cl][clp] ;

                            if (is.funct(property)) this[cl][clp] = applyFn(this, property) ;
                            else this[cl][clp] = clone(property) ;
                        }
                    }
                }
            },

            init : function(constructor, args)
            {
                if (this.initialize === false)
                    throw "Prototype is static and cannot be instanciated." ;

                var performs = Objectyve.Instance.perform ;
                for (var p=0, pl=performs.ORDER.length ; p<pl ; p++)
                    performs[performs.ORDER[p]].call(this, constructor) ;
                
                if (constructor.__meta__.skeleton.public.initialize === true)
                    return this.initialize.apply(this, args) ;

                return this ;
            }
        },
        
        Prototype : function(args) {
            var Prototype = function() {
                return Objectyve.Instance.init.call(this, Prototype, arguments) ;
            } ;
            Prototype.__meta__ = {
                skeleton : clone(Objectyve.Skeleton.modifiers),
                options : clone(options),
                plugins : clone(plugins)
            } ;

            switch (ECMAScript) {
                case 6 :
                    Object.setPrototypeOf(Prototype, Objectyve.Constructor) ;
                    break ;
                case 5 :
                    Prototype.__proto__ = Objectyve.Constructor ;
                    break ;
                case 4 :
                    copy(Prototype, Objectyve.Constructor) ;
                    // Needs Prototype.updatePrototype() to be updated if new functions are added.
                    break ;
            }

            if (is.object(args)) {
                if (args.configure) {
                    Prototype.configure(args.configure) ;
                    delete args.configure ;
                }
                if (args.plug) {
                    Prototype.plug(args.plug) ;
                    delete args.plug ;
                }
                
                for (var a in args) {
                    if (Prototype[a])
                        Prototype[a](args[a]) ;
                    else if (Prototype.options().strict === Objectyve.strict.HIGH)
                        throw "Invalid call '"+a+"' while creating new Prototype." ;
                    else if (Prototype.options().strict === Objectyve.strict.LOW)
                        warn("Invalid call '"+a+"' while creating new Prototype.") ;
                }
            }

            if (is.funct(Prototype.main)) Prototype.main.call(Prototype, Prototype) ;
            
            return Prototype ;
        }
    } ;

    // Runs the now ready framework.
    init() ;
}(
    typeof window !== 'undefined' && window.document ? 'client'         // Web browser compatibility
  : typeof module !== 'undefined' && module.exports ? 'server'          // Node.js Server compatibility
  : 'undefined'                                                         // Undefined context
) ;
