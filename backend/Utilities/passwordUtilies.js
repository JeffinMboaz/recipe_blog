
const bcrypt = require('bcryptjs');

// Hash a plain text password. Returns a promise so callers can use `await`.
const hashPassword = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) return reject(err);
			bcrypt.hash(password, salt, (err, hash) => {
				if (err) return reject(err);
				resolve(hash);
			});
		});
	});
};

// Compare a plain text password with a hashed password. Returns a promise<boolean>.
const checkPassword = (password, hashedPassword) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, hashedPassword, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

module.exports = { hashPassword, checkPassword };

