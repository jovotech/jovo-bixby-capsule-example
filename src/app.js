'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const { Bixby } = require('jovo-platform-bixby');

const app = new App();

app.use(
	new Alexa(),
	new Bixby(),
	new GoogleAssistant(),
	new JovoDebugger(),
	new FileDb()
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
	LAUNCH() {
		console.log('LAUNCH()');
		this.ask("Hello World! What's your name?", 'Please tell me your name.');
	},

	MyNameIsIntent() {
		console.log('MyNameIsIntent()');
		this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
	}
});

module.exports.app = app;
