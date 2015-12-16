var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var schema = new Schema({
	user: String,//{ type: Schema.Types.ObjectId, index: true },
  key: String,
  data: Schema.Types.Mixed,
});

module.exports = mongoose.model('HealthBehavior', schema);