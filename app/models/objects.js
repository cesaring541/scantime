
var mongoosePaginate=require('mongoose-paginate');
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var objectSchema = new Schema({
    year :String,
    idUser: String,
    price: String,
    city: String,
    brand: String,
    model: String,
    cyl: String,
    styleCar: String,
    priceNegotiable: String,
    colorFront: String, 
    colorBack: String,
    fuelCar: String,
    transmissionCar: String,
    kmCar: String,
    transmissionCar: String,
    doorCar: String,
    date: String,
		


});

objectSchema.plugin(mongoosePaginate);

// create the model for users and expose it to our app
module.exports = mongoose.model('Object', objectSchema);

