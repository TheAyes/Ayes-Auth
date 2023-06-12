import {authenticate, generateToken} from "../lib/index.js";

const token = generateToken({
	payload: {
		userId: "123",
	},
	secret: "secret",
	options: {
		expiresIn: "1h",
	},
});
const result = authenticate(token, "secret")
console.log(result);