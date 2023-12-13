const express = require("express");
const app = express();
const PORT = 4000;
require("dotenv").config();

const {
	auth_token_url,
	get_access_token,
	get_profile_data,
} = require("./utils.js");

app.get("/auth", async (req, res) => {
	try {
		res.redirect(auth_token_url);
	} catch (error) {
		res.sendStatus(500);
		console.log(error.message);
	}
});
app.get(process.env.REDIRECT_URI, async (req, res) => {
	const authorization_token = req.query;
	try {
		// get access token using authorization token
		const response = await get_access_token(authorization_token.code);

		// get access token from payload
		const { access_token } = response.data;

		// get user profile data
		const user = await get_profile_data(access_token);
		const user_data = user.data;

		res.send(`
      <h1> welcome ${user_data.name}</h1>
      <img src="${user_data.picture}" alt="user_image" />
    `);
	} catch (error) {
		console.log(error.message);
		res.sendStatus(500);
	}
});

let user = new Object();

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}/auth`);
});
