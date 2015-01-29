// To run the test cases:
//     With node.js:
//         > cd /path/to/dojox
//         > node node_modules/intern/bin/intern-client.js config=mvc/tests/intern/intern
//     With node.js and WebDriver:
//         > cd /path/to/dojox
//         > node node_modules/intern/bin/intern-runner.js config=mvc/tests/intern/intern reporters=runner reporters=lcovhtml
//     With browser:
//         Hit: http://server/path/to/dojox/node_modules/intern/client.html?config=mvc/tests/intern/intern
define((function(global){
	"use strict";

	// dojoConfig needs to be defined here, otherwise it"s too late to affect the dojo loader api
	global.dojoConfig = {
		async: true
	};

	return {
		loader: {
			baseUrl: typeof window !== "undefined" ? "../../.." : "..",
			packages: ["dojo", "dijit", "dojox"]
		},

		useLoader: {
			"host-node": "dojo/dojo",
			"host-browser": "../../../dojo/dojo.js"
		},

		proxyPort: 9000,

		proxyUrl: "http://localhost:9000/",

		capabilities: {
			"selenium-version": "2.44.0",
			"idle-timeout": 60
		},

		environments: [
			{browserName: "internet explorer"},
			{browserName: "firefox"},
			{browserName: "chrome"},
			{browserName: "safari"}
		],

		maxConcurrency: 3,

		useSauceConnect: false,

		webdriver: {
			host: "localhost",
			port: 4444
		},

		suites: ["dojox/mvc/tests/intern/all"],

		excludeInstrumentation: /^(node_modules|dojo|dijit|test)/
	};
})(this));
