const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	createdAt: String,
});

userSchema.pre('save', function () {
	this.createdAt = new Date().toISOString();
});

module.exports = model('User', userSchema);
