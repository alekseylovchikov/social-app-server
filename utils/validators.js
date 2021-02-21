const emailRegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

exports.validateRegisterInput = (email, password, confirmPassword) => {
	const errors = {};

	if (!email.trim()) {
		errors.email = 'Email не может быть пустым';
	} else {
		if (!email.match(emailRegEx)) {
			errors.email = 'Не верный формат email';
		}
	}
	if (!password.trim()) {
		errors.password = 'Пароль не может быть пустым';
	} else if (password !== confirmPassword) {
		errors.confirmPassword = 'Пароли не совпадают';
	}

	return {
		errors,
		valid: Object.keys(errors).length === 0,
	};
};

exports.validateLoginInput = (email, password) => {
	const errors = {};

	if (!email.trim()) {
		errors.email = 'Email не может быть пустым';
	} else {
		if (!email.match(emailRegEx)) {
			errors.email = 'Не верный формат email';
		}
	}
	if (!password.trim()) {
		errors.password = 'Пароль не может быть пустым';
	}

	return {
		errors,
		valid: Object.keys(errors).length === 0,
	};
};
