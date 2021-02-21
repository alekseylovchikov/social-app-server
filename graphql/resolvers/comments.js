const {
	UserInputError,
	ApolloError,
	ForbiddenError,
} = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
	Mutation: {
		async createComment(_, { postId, body }, context) {
			const { email } = checkAuth(context);

			if (!body.trim()) {
				throw new UserInputError('Коментарий не может быть пустым', {
					errors: {
						body: 'Коментарий не может быть пустым',
					},
				});
			}

			const post = await Post.findById(postId);

			if (post) {
				post.comments.unshift({
					body,
					email,
					createdAt: new Date().toISOString(),
				});
				await post.save();
				return post;
			} else {
				throw new UserInputError('Запись не найдена');
			}
		},
		async deleteComment(_, { postId, commentId }, context) {
			const { email } = checkAuth(context);

			const post = await Post.findById(postId);

			if (!post) {
				throw new ApolloError('Запись не найдена');
			}

			const commentIndex = post.comments.findIndex((e) => e.id === commentId);

			if (commentIndex > -1) {
				if (post.comments[commentIndex].email !== email) {
					throw new ForbiddenError('Вы не можете удалить чужой комментарий');
				}
				post.comments.splice(commentIndex, 1);
				await post.save();
				return post;
			} else {
				throw new ApolloError('Коментарий не найден');
			}
		},
	},
};
