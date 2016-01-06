import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var schema = new Schema({
  user: String,				// User identifier
  key: String,				// the type of health behavior
  filter: String,			// allow for filtering (date)
  data: Schema.Types.Mixed,	// health behavior data (json)
});

export default mongoose.model('HealthBehavior', schema);