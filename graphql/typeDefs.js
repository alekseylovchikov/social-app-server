const gql = require('graphql-tag');

module.exports = gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		email: String!
		comments: [Comment]!
		likes: [Like]!
		likeCount: Int!
		commentCount: Int!
	}
	type Comment {
		id: ID!
		createdAt: String!
		email: String!
		body: String!
	}
	type Like {
		id: ID!
		createdAt: String!
		email: String!
	}
	type User {
		id: ID!
		email: String!
		token: String!
		createdAt: String!
	}
	input LoginInput {
		password: String!
		email: String!
	}
	input RegisterInput {
		password: String!
		confirmPassword: String!
		email: String!
	}
	type Query {
		getPosts: [Post]
		getPost(postId: ID!): Post
	}
	type Mutation {
		register(registerInput: RegisterInput): User!
		login(loginInput: LoginInput): User!
		createPost(body: String!): Post!
		deletePost(postId: ID!): String!
		createComment(postId: ID!, body: String!): Post!
		deleteComment(postId: ID!, commentId: ID!): Post!
		likePost(postId: ID!): Post!
	}
	type Subscription {
		newPost: Post!
	}
`;
