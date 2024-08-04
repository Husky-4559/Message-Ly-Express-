const express = require("express");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");
const router = new express.Router();

router.post("/login", async function (req, res, next) {
	try {
		const { username, password } = req.body;
		const isValid = await User.authenticate(username, password);

		if (isValid) {
			const token = jwt.sign({ username }, SECRET_KEY);
			await User.updateLoginTimestamp(username);
			return res.json({ token });
		} else {
			throw new ExpressError("Invalid username/password", 400);
		}
	} catch (err) {
		return next(err);
	}
});

router.post("/register", async function (req, res, next) {
	try {
		const { username, password, first_name, last_name, phone } = req.body;
		const newUser = await User.register({
			username,
			password,
			first_name,
			last_name,
			phone,
		});
		const token = jwt.sign({ username: newUser.username }, SECRET_KEY);
		await User.updateLoginTimestamp(newUser.username);
		return res.json({ token });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
