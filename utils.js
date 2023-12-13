const query_string = require("querystring");
const axios = require("axios");

// Google API endpoint to obtain an access token
const google_auth_token_endpoint =
	"https://accounts.google.com/o/oauth2/v2/auth";
const google_access_token_endpoint = "https://oauth2.googleapis.com/token";

const query_params = {
	client_id: process.env.CLIENT_APP_ID,
	redirect_uri: `http://localhost:4000${process.env.REDIRECT_URI}`,
};

const get_access_token = async (auth_code) => {
	const access_token_params = {
		...query_params,
		client_secret: process.env.CLIENT_APP_SECRET,
		code: auth_code,
		grant_type: "authorization_code",
	};
	return await axios({
		method: "post",
		url: `${google_access_token_endpoint}?${query_string.stringify(
			access_token_params,
		)}`,
	});
};

const get_profile_data = async (access_token) => {
	return await axios({
		method: "post",
		url: `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`,
	});
};

// this objects contains information that will be passed as query params to the auth // token endpoint
const oauth_config = {
	...query_params,
	response_type: "code",
};

// the scopes (portion of user's data) we want to access
const scopes = ["profile", "email", "openid"];

// a url formed with the auth token endpoint and the
const auth_token_url = `${google_auth_token_endpoint}?${query_string.stringify(
	oauth_config,
)}&scope=${scopes.join(" ")}`;

module.exports = {
	auth_token_url,
	get_access_token,
	get_profile_data,
};