module.exports = {
	apps: [{
		name: "server",
		script: "www.js",
		env: {
			PORT: 8080,
			NODE_ENV: "production"
		}
	}]
}
