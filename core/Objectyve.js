
/**
 * Objectÿve framework bêta
 *
 * @author      Thomas Josseau
 * @version     0.3.1
 * @date        2014.01.25
 * @link        https://github.com/tjosseau/objectyve
 *
 * @description
 *      JavaScript framework to simplify prototypes construction.
 *      (Second core bêta version)
 */

(function(jsCore) {
    // "use strict" ; // Strict mode - Disabled in production

    // Defines the global container and local reference to the framework.
    var global, Objectyve, __Objectyve ;
    // Argument 'jsCore' as type of JavaScript core between a client (browser) and a server (here Node.js).
    switch (jsCore) {
        case 'client' : global = window ;       break ;     // Client side JavaScript
        case 'server' : global = GLOBAL ;       break ;     // Server side JavaScript (with Node.js)
        default :       global = {} ;           break ;     // Unknown context
    }
    // Stores the possibly already defined framework. Use `Objectyve.noConflict()` to get a private instance.
    __Objectyve = global.Objectyve ;

//---------------------------------------------------------------------------------------------------------------------------//
//      Constants
//---------------------------------------------------------------------------------------------------------------------------//

        // Version of Objectyve - accessible with `Objectyve.version()`
    var VERSION = [
            0,                      // Version of framework's Core
            3,                      // Updates - Modifications
            1,                      // Minor updates - Corrections
            new Date(
                2014,               // Year \
                1               -1, // Month >---- of last update
                25                  // Day  /
            )
        ],

        options = {
            silent : false,
            debug : 0
        },

        plugins = {
            requirejs : null
        },

        boot = function() {
        // Preparing framework //

            var to0n = function(num) { return num < 10 ? '0'+num : ''+num ; } ;
            // Generating a comprehensive version accessor of ObjecScrypt.
            Objectyve.version.core = VERSION[0] ;
            Objectyve.version.update = VERSION[1] ;
            Objectyve.version.correction = VERSION[2] ;
            // Build version of framework (i.e. 102034 means 1.2.34).
            Objectyve.version.build = 100000 * VERSION[0] + 1000 * VERSION[1] + VERSION[2] ;
            Objectyve.version.date = VERSION[3].getTime() ;
            // Adds a toString version of Objectyve version.
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
            // Exports Objectyve as a module for Node.js.
            if (jsCore === 'server') module.exports = Objectyve ;
            // AMD compatibility, defines Objectyve as a require-able module.
            else if (typeof global.define !== 'undefined' && typeof global.define === 'function')
                global.define(Objectyve) ;
            
            global.Objectyve = Objectyve ;
        },

    // Utilities //
    
        // Reference to original method from Object prototype.
            // @param object <object> : Object to define a special property
            // @param property <string> : Name of property to alter
            // @param options <object> : Set of property options
        defineProperty = Object.defineProperty,

        // Displays a message in the browser log as returning the first given argument.
        // This allows both echoing the value(s) and getting the first back
        // (i.e. 'return test ;' equals to 'return echo(test, ' is a variable.') ;' into the script).
        // This method can be silent if 'silent' option is set as true.
            // @param arguments* <any> : Given value(s) to display
            // @return <any> : If only one argument, first value given ; else all the arguments.
        echo = function()
        {
            if (!options.silent && console) console.log.apply(null, arguments) ;
            return arguments.length === 1 ? arguments[0] : arguments ;
        },

        // Displays a warning message in the browser info.
            // @param string <string> : Message to warn
        warn = function(string)
        {
            if (!options.silent && console) console.info('/!\\ '+string) ;
        },

        // Set of type checking
            // @param o <any> : Variable to check type
            // @return <boolean>
        is = {
            object :        function(o) { return o != null && typeof o === 'object' && !is.array(o) ; },
            bool :          function(o) { return typeof o === 'boolean' ; },
            array :         function(o) { return Object.prototype.toString.call(o) === '[object Array]' ; },
            number :        function(o) { return !isNaN(parseFloat(o)) && isFinite(o) ; },
            string :        function(o) { return typeof o === 'string' ; },
            funct :         function(o) { return typeof o === 'function' ; },
            container :     function(o) { return is.object(o) || is.array(o) ; },
            empty :         function(o) { for (undefined in o) return false ; return true ; },
            constructor :   function(o) { return o === 'constructor' ; }
        },

        // Clones an object for independant object copies.
            // @param object <object> : Object to clone
            // @return <object> : Cloned object
        clone = function(object)
        {
            var newObject = {} ;
            for (var p in object) {
                // Recursive cloning
                if (is.object(object[p])) newObject[p] = clone(object[p]) ;
                else newObject[p] = object[p] ;
            }
            return newObject ;
        },

        // Simple copy (by reference if contains objects).
            // @param context <object> : Copy properties to
            // @param object <object> : Copy properties from
            // @return <object> : Copied object
        copy = function(context, object)
        {
            for (var p in object) context[p] = object[p] ;
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

        // Filters properties by type, also filling the cleaned body that will contain all properties, useful for loops.
            // @param rawBody <object> : Default body containing all original properties
            // @param body <object> : Tidy generating body receiving cleaned properties
            // @param type <string> : Type character/string (see Constant flags) used to filter properties by type
            // @return <object> : Filtered array
        filter = function(rawBody, body, type)
        {
            var filteredArray = {},
                subString = '' ;
            for (var property in rawBody) {
                if (property.indexOf(type) === 0) {
                    subString = property.substr(type.length, property.length-1) ;
                    body[subString] = filteredArray[subString] = rawBody[property] ;
                    delete rawBody[property] ;
                }
            }

            return filteredArray ;
        },

        defineMember = function(constructor, member, visibility)
        {
            if (constructor.__meta__.options.strict >= Objectyve.strict.HIGH && (
                    constructor.__meta__.public[member] ||
                    constructor.__meta__.protected[member] ||
                    constructor.__meta__.private[member]
                ))
                throw "Member named '"+member+"' is already defined." ;

            if (constructor.__meta__.protected[member] || constructor.__meta__.private[member]) {
                defineProperty(constructor.prototype, member, {
                    enumerable : true,
                    configurable : true
                }) ;
            }

            delete constructor.__meta__.public[member] ;
            delete constructor.__meta__.protected[member] ;
            delete constructor.__meta__.private[member] ;

            constructor.__meta__[visibility][member] = true ;
            if (visibility === 'private')
                defineProperty(constructor.prototype, member, {
                    enumerable : false,
                    configurable : true
                }) ;
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

        // Returns the framework to set in a variable instead of using the global access.
            // @return <object> : Objectÿve instance
        noConflict : function()
        {
            global.Objectyve = __Objectyve ;
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
        
        globalize : function()
        {
            for (var m=0, ml=arguments.length ; m<ml ; m++)
                global[arguments[m]] = Objectyve[arguments[m]] ;

            return this ;
        },

    // Public Utilities //

        util : {
            is : is,
            // has : has,
            // meta : meta,
            clone : clone,
            copy : copy,
            list : list,
            defineProperty : defineProperty,
            filter : filter
        },

        echo : echo,

        warn : warn,

    // Engines //
        
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

            module : function(fullname)
            {
                var tree = fullname.split('/'),
                    size = tree.length,
                    root = global ;

                tree.forEach(function(word, i) {
                    if (root[word] == null) root[word] = {} ;
                    else if (!is.object(root[word]) && this.__meta__.options.strict >= Objectyve.strict.LOW)
                        throw "Unvalid module root '"+root[word]+"' for '"+fullname+"'." ;

                    if (i < size-1) root = root[word] ;
                    else root[word] = this ;
                }.bind(this)) ;

                return this ;
            },

            extend : function(constructor)
            {
                this.prototype = Object.create(constructor.prototype) ;
                if (constructor.__meta__) {
                    copy(this.__meta__.public, constructor.__meta__.public) ;
                    copy(this.__meta__.protected, constructor.__meta__.protected) ;
                }
                this.parent = constructor ;

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
                    else throw "Cannot mixin '"+constructor+"' with a prototype." ;

                    if (constructor.__meta__) {
                        copy(this.__meta__.public, constructor.__meta__.public) ;
                        copy(this.__meta__.protected, constructor.__meta__.protected) ;
                    }
                }

                return this ;
            },

            public : function(properties)
            {
                for (var p in properties)
                    defineMember(this, p, 'public') ;

                copy(this.prototype, properties) ;

                return this ;
            },

            protected : function(properties)
            {
                for (var p in properties)
                    defineMember(this, p, 'protected') ;

                copy(this.prototype, properties) ;

                return this ;
            },

            private : function(properties)
            {
                for (var p in properties)
                    defineMember(this, p, 'private') ;

                copy(this.prototype, properties) ;

                return this ;
            },

            prototype : function(properties)
            {
                copy(this.prototype, properties) ;

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
                    this.__meta__.nested[c] = clone(nested[c]) ;

                return this ;
            },

            plug : function(name, instance)
            {
                this.__meta__.plugins[name] = instance ;

                return this ;
            },

            configure : function(opts)
            {
                configure.call(this.__meta__.options, opts) ;

                return this ;
            },

            define : function()
            {
                if (this.__meta__.plugins.requirejs)
                    global.define(function() {
                        return this ;
                    }.bind(this)) ;
                else if (jsCore === 'server')
                    module.exports = this ;
                else if (this.__meta__.options.debug >= Objectyve.debug.MEDIUM)
                    warn("Constructor definition function 'define()' called without effect.") ;

                return this ;
            }
        },

        Instance : {
            perform : {
                ORDER : ['class', 'nested'],
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

                class : function(constructor) {
                    var property ;

                    for (var p in constructor.prototype) {
                        property = constructor.prototype[p] ;
                        if (is.funct(property)) continue ;

                        if (constructor.__meta__.public[p]) {
                            if (is.object(property)) this[p] = clone(property) ;
                            else this[p] = property ;
                        }
                        else if (constructor.__meta__.protected[p]) {
                            if (is.object(property)) this[p] = clone(property) ;
                            else this[p] = property ;
                            defineProperty(this, p, {
                                enumerable : false,
                                configurable : true
                            }) ;
                        }
                    }

                    for (var pp in constructor.__meta__.private) {
                        property = constructor.prototype[pp] ;
                        if (is.funct(property)) continue ;

                        if (is.object(property)) this[pp] = clone(property) ;
                        else this[pp] = property ;
                        defineProperty(this, pp, {
                            enumerable : false,
                            configurable : true
                        }) ;
                    }
                },

                nested : function(constructor) {
                    for (var cl in constructor.__meta__.nested) {
                        if (!is.object(this[cl])) this[cl] = {} ;
                        for (var clp in constructor.__meta__.nested[cl])
                            if (is.funct(constructor.__meta__.nested[cl][clp]))
                                this[cl][clp] = applyFn(this, constructor.__meta__.nested[cl][clp]) ;
                    }
                }
            },

            init : function(constructor, args)
            {
                var performs = Objectyve.Instance.perform ;
                for (var p=0, pl=performs.ORDER.length ; p<pl ; p++)
                    performs[performs.ORDER[p]].call(this, constructor) ;
                
                if (Object.prototype.hasOwnProperty.call(this, 'constructor') && is.funct(this.constructor))
                    return this.constructor.apply(this, args) ;
            }
        },
        
        Prototype : function() {
            var constructor = function() {
                return Objectyve.Instance.init.call(this, constructor, arguments) ;
            } ;
            constructor.__meta__ = {
                definition : {},

                public : {},
                protected : {},
                private : {},
                nested : {},

                options : clone(options),
                plugins : clone(plugins)
            } ;
            copy(constructor, Objectyve.Constructor) ;

            return constructor ;
        }
    } ;

    // Runs the now ready framework.
    boot() ;
})(
    typeof window !== 'undefined' && window.document ? 'client'         // Web browser compatibility
  : typeof module !== 'undefined' && module.exports ? 'server'          // Node.js Server compatibility
  : 'undefined'                                                         // Undefined context
) ;
