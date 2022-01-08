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
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("Setting", SettingSchema); 

