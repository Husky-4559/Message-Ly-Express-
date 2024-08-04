const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");
const Message = require("../models/message");

// Middleware to authenticate token
function authenticateJWT(req, res, next) {
	try {
		const token = req.body._token || req.query._token;
		if (token) {
			const payload = jwt.verify(token, SECRET_KEY);
			req.user = payload;
		}
		return next();
	} catch (err) {
		return next();
	}
}

// Middleware to ensure logged-in user
function ensureLoggedIn(req, res, next) {
	try {
		if (!req.user) throw new ExpressError("Unauthorized", 401);
		return next();
	} catch (err) {
		return next(err);
	}
}

// Middleware to ensure the correct user
function ensureCorrectUser(req, res, next) {
	try {
		if (req.user.username !== req.params.username) {
			throw new ExpressError("Unauthorized", 401);
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

// Middleware to ensure the user is either the sender or recipient of the message
async function ensureCorrectUserOrRecipient(req, res, next) {
	try {
		const message = await Message.get(req.params.id);
		if (
			req.user.username !== message.from_user &&
			req.user.username !== message.to_user
		) {
			throw new ExpressError("Unauthorized", 401);
		}
		return next();
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	authenticateJWT,
	ensureLoggedIn,
	ensureCorrectUser,
	ensureCorrectUserOrRecipient,
};
