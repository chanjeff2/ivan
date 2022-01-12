const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WallGameSchema = new Schema({
	guildId: {
		type: String,
		unique: true,
		required: true
	},
	isPlaying: {
        type: Boolean,
        default: false,
    },
	highScore: {
		type: Number,
        default: 0,
	},
	score: {
		type: Number,
        default: 0,
	},
}, {
	timestamps: true
});

module.exports = mongoose.model("wallGameStats", WallGameSchema); 

