
// This is an example of a simple prototype definition.

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
            return this.entities.length ; // Static property `entities` is inherited from Living.
        }
    },

    public:     // Here no need to seperate properties and prototype methods, will be treated automatically.
    {
        name : '',

        strength : 3,
        speed : 2,

        // Objects given as public are automatically deeply cloned.
        // If you don't want to clone it, use 'shared' modifier instead.
        elements : {
            fire : true
        },

        // Functions are automatically set as 'shared' properties, thus set to the prototype :

        initialize : function(name)      // `constructor` is already used and refers the `Dragon` function.
        {
            this.name = name || 'Dragon' ;
        },

        // walk : Augmented from Reptile.

        // fly : Augmented from Wingged.

        talk : function()
        {
            return 'rawr' ;
        },

        attack : function()
        {
            return this.strength ;
        }
    }
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

    //this.talk = function() {}... // Surely not !
} ;

Dragon.description = 'A legendary creature that features in the myths of many cultures.' ;

Dragon.describe = function()
{
    return new Wikipedia.def('Dragon').toString() ;
} ;

Dragon.count = function()
{
    return this.entities.length ;
} ;

Dragon.prototype = Object.create(Living) ; // Conventional way, instead of using `new Living`.

var p ;
for (p in Reptile.prototype)
    Dragon.prototype[p] = Reptile.prototype[p] ;
for (p in Wingged.prototype)
    Dragon.prototype[p] = Wingged.prototype[p] ;

Dragon.prototype.talk = function()
{
    return 'rawr' ;
} ;

Dragon.prototype.attack = function()
{
    return this.strength ;
} ;

var drg = new Dragon('Toothless') ;
drg.talk() ; // 'rawr'
