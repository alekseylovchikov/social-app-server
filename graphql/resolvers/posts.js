const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
	Query: {
		async getPosts() {
			try {
				const posts = await Post.find().sort({ createdAt: -1 });
				return posts;
			} catch (e) {
				throw new Error(e);
			}
		},
		async getPost(_, { postId }) {
			try {
				const post = await Post.findOne({ _id: postId });
				if (!post) {
					throw new Error('Запись с этим ID не найдена');
				} else {
					return post;
				}
			} catch (e) {
				throw new Error(e);
			}
		},
	},
	Mutation: {
		async createPost(_, { body }, context) {
			const user = checkAuth(context);

			if (!body.trim()) {
				throw new UserInputError('Текс записи обязателен');
			}

			const newPost = new Post({
				body,
				user: user._id,
				email: user.email,
			});
			const post = await newPost.save();
			context.pubsub.publish('NEW_POST', { newPost: post }); // cool feature
			return post;
		},
		async deletePost(_, { postId }, context) {
			const user = checkAuth(context);

			try {
				const post = await Post.findById(postId);
				if (post && user.email === post.email) {
					await post.delete();
					return 'Запись удалена';
				} else if (!post) {
					throw new Error('Запись не существует');
				} else {
					throw new AuthenticationError(
						'Запись не принадлежит вашей учетной записи'
					);
				}
			} catch (e) {
				throw new Error(e);
			}
		},
		async likePost(_, { postId }, context) {
			const { email } = checkAuth(context);

			const post = await Post.findById(postId);

			if (!post) {
				throw new UserInputError('Запись не найдена', {
					errors: {
						message: 'Запись не найден',
					},
				});
			} else {
				const likeIndex = post.likes.findIndex((e) => e.email === email);
				if (likeIndex > -1) {
					post.likes.splice(likeIndex, 1);
				} else {
					post.likes.unshift({
						email,
						createdAt: new Date().toISOString(),
					});
				}
				await post.save();
				return post;
			}
		},
	},
	Subscription: {
		newPost: {
			subscribe(_, __, { pubsub }) {
				return pubsub.asyncIterator('NEW_POST');
			},
		},
	},
};
