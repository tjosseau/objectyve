
// This is an example of a default prototype definition.
// Though, newlines, spaces and indentation are meaningful.

Objectyve.Prototype(function(self, definition)
{
    definition
    ({
        module: 'Dragon',              // Creates a global variable called 'Dragon'

        extend: Living,                 // Can only extend one constructor.

        mixin: [Reptile, Wingged],      // Can be augmented with one or more constructors.

        static:
        {
            description : "A legendary creature that features in the myths of many cultures.",

            describe : function()
            {
                return Wikipedia.def('Dragon').toString() ;
            },

            count : function()
            {
                return self.entities.length ; // Static property `entities` is inherited from Living.
            }
        },

        shared:
        {
            home : 'cave'
        },

        attr:
        {
            // life : 10,       // Inherited from Living.
            name : '',

            strength : 3,
            speed : 2,

            // Objects given as public are automatically deeply cloned.
            // If you don't want to clone it, use 'shared' modifier instead.
            elements : {
                fire : true
            }
        },

        hidden:
        {
            power : 3
        },

        initialize: function(name)
        {
            this.name = name || 'Dragon' ;

            self.entities.push(this) ;
        },

        method: // Does the same as 'shared', but can be clearer this way.
        {
            // walk : Augmented from Reptile.
            // fly : Augmented from Wingged.

            talk : function()
            {
                return 'rawr' ;
            },

            attack : function()
            {
                return this.strength * (this.power--) ;
            }
        }
    }) ;
}) ;

var drg = new Dragon('Toothless') ;
drg.talk() ; // 'rawr'




////////////////////////////////////////////////////////////////
// Rough equivalent

var Dragon = function(name) {
    this.name = name || 'Dragon' ;

    this.strength = 3 ;
    this.speed = 2 ;

    this.elements = {
        fire : true
    } ;

    Object.defineProperty(this, 'power', {
        value : 3,
        enumerable : false,
        configurable : true
    }) ;
} ;

Dragon.description = "A legendary creature that features in the myths of many cultures." ;

Dragon.describe = function()
{
    return new Wikipedia.def('Dragon').toString() ;
} ;

Dragon.count = function()
{
    return Dragon.entities.length ;
} ;

Dragon.prototype = Object.create(Living) ; // Conventional way, instead of using `new Living`.

var p ;
for (p in Reptile.prototype)
    Dragon.prototype[p] = Reptile.prototype[p] ;
for (p in Wingged.prototype)
    Dragon.prototype[p] = Wingged.prototype[p] ;

Dragon.prototype.home = 'cave' ;

Dragon.prototype.talk = function()
{
    return 'rawr' ;
} ;

Dragon.prototype.attack = function()
{
    return this.strength * (this.power--) ;
} ;

var drg = new Dragon('Toothless') ;
drg.talk() ; // 'rawr'
