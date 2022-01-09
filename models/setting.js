const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
	guildId: {
		type: String,
		unique: true,
		required: true
	},
	enable: {
		type: Boolean,
		default: true
	},
	burgers: {
		type: Number,
		default: 1
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("Setting", SettingSchema); 

