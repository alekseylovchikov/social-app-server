const { model, Schema } = require('mongoose');

const postSchema = new Schema({
	body: String,
	email: String,
	createdAt: String,
	comments: [
		{
			body: String,
			email: String,
			createdAt: String,
		},
	],
	likes: [
		{
			email: String,
			createdAt: String,
		},
	],
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
});

postSchema.pre('save', function () {
	this.createdAt = new Date().toISOString();
});

module.exports = model('Post', postSchema);
