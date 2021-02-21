const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
	validateRegisterInput,
	validateLoginInput,
} = require('../../utils/validators');
const User = require('../../models/User');

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
		},
		process.env.SECRET,
		{ expiresIn: '1h' }
	);
}

module.exports = {
	Query: {},
	Mutation: {
		async login(_, { loginInput: { email, password } }) {
			const { valid, errors } = validateLoginInput(email, password);
			if (!valid) {
				throw new UserInputError('Проверьте вводимые данные', {
					errors,
				});
			}
			const user = await User.findOne({ email });
			if (!user) {
				throw new UserInputError('Пользователь не найден', {
					errors: {
						email: 'Пользователь не найден',
					},
				});
			}

			const match = await bcrypt.compare(password, user.password);

			if (!match) {
				throw new UserInputError('Не верный пароль', {
					errors: {
						password: 'Не верный пароль',
					},
				});
			}

			const token = generateToken(user);

			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
		async register(_, { registerInput: { email, password, confirmPassword } }) {
			const { valid, errors } = validateRegisterInput(
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError('Проверьте вводимые данные', {
					errors,
				});
			}
			const user = await User.findOne({ email });
			if (user) {
				throw new UserInputError('Пользователь с таким email уже существует', {
					errors: {
						email: 'Пользователь с таким email уже существует',
					},
				});
			}

			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				password,
			});

			const res = await newUser.save();
			const token = generateToken(res);

			return {
				...res._doc,
				id: res._id,
				token,
			};
		},
	},
};
