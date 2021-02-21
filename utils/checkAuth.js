const { AuthenticationError } = require('apollo-server');
const { verify } = require('jsonwebtoken');

module.exports = (context) => {
	const authHeader = context.req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];

		if (token) {
			try {
				const user = verify(token, process.env.SECRET);

				return user;
			} catch (e) {
				throw new AuthenticationError('Срок действия токена истек');
			}
		}
		throw new Error('Токен не верный или отсутствует');
	}
	throw new Error('Authorization header отсутствует');
};
