const express = require("express");
const User = require("../models/user");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const router = new express.Router();

router.get("/", ensureLoggedIn, async function (req, res, next) {
	try {
		const users = await User.all();
		return res.json({ users });
	} catch (err) {
		return next(err);
	}
});

router.get(
	"/:username",
	ensureLoggedIn,
	ensureCorrectUser,
	async function (req, res, next) {
		try {
			const user = await User.get(req.params.username);
			return res.json({ user });
		} catch (err) {
			return next(err);
		}
	}
);

router.get(
	"/:username/to",
	ensureLoggedIn,
	ensureCorrectUser,
	async function (req, res, next) {
		try {
			const messages = await User.messagesTo(req.params.username);
			return res.json({ messages });
		} catch (err) {
			return next(err);
		}
	}
);

router.get(
	"/:username/from",
	ensureLoggedIn,
	ensureCorrectUser,
	async function (req, res, next) {
		try {
			const messages = await User.messagesFrom(req.params.username);
			return res.json({ messages });
		} catch (err) {
			return next(err);
		}
	}
);

module.exports = router;
