import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var schema = new Schema({
	user: String,//{ type: Schema.Types.ObjectId, index: true },
  key: String,
  data: Schema.Types.Mixed,
});

export default mongoose.model('HealthBehavior', schema);