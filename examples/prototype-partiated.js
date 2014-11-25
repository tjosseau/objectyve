
// This is an example of a partiated prototype definition.
// You can call Prototype functions and alter prototypes any time you want.

var Dragon = Objectyve.Prototype() ;

Dragon.public({
    name : ''
}) ;

Dragon.static({
    description : 'A legendary creature that features in the myths of many cultures.',

    describe : function()
    {
        return Wikipedia.def('Dragon').toString() ;
    },

    count : function()
    {
        return this.entities.length ; // Static property `entities` is inherited from Living.
    }
}) ;

// Chained functions
Dragon
    .public({
        strength : 3,
        speed : 2
    })
    .shared({
        talk: function()
        {
            return 'rawr' ;
        }
    })
    .extend(Living) ;

var d1 = new Dragon() ;
d1.talk() ; // 'rawr'
d1.attack() ; // Error: `undefined` is not a function.

Dragon.shared({
    attack : function()
    {
        return this.strength ;
    }
}) ;

d1.attack() ; // 3

// Be careful with public modification... :
d1.weight ; // undefined

Dragon.public({
    weight : 100
}) ;

d1.weight ; // undefined, this dragon is already instancied !
var d2 = new Dragon() ;
d2.weight ; // 100
