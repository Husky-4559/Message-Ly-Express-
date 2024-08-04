const express = require("express");
const Message = require("../models/message");
const {
	ensureLoggedIn,
	ensureCorrectUserOrRecipient,
} = require("../middleware/auth");
const router = new express.Router();

router.get(
	"/:id",
	ensureLoggedIn,
	ensureCorrectUserOrRecipient,
	async function (req, res, next) {
		try {
			const message = await Message.get(req.params.id);
			return res.json({ message });
		} catch (err) {
			return next(err);
		}
	}
);

router.post("/", ensureLoggedIn, async function (req, res, next) {
	try {
		const { to_username, body } = req.body;
		const from_username = req.user.username;
		const message = await Message.create({ from_username, to_username, body });
		return res.json({ message });
	} catch (err) {
		return next(err);
	}
});

router.post("/:id/read", ensureLoggedIn, async function (req, res, next) {
	try {
		const message = await Message.markRead(req.params.id);
		return res.json({ message });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
