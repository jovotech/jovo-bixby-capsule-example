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
        this.ask('Hello World! What\'s your name?', 'Please tell me your name.');
    },

    MyNameIsIntent() {
        console.log('MyNameIsIntent()');
        this.$bixbyCapsule.$layout.single = 'Hello World.';
        this.$session.$data.name = this.$inputs.name.value;
        this.tell('Hey ' + this.$inputs.name.value + ', nice to meet you!');
    },

    PlayAudioIntent() {
        console.log('PlayAudioIntent()');
        this.$bixbyCapsule.$audioPlayer
            .play({
                url: 'http://www.testsounds.com/track39.mp3',
                format: 'audio/mp3'
            })
            .setMetaData({
                id: 'jovo-audio',
                title: 'Drum Solo',
                artist: 'Random',
                albumArtUrl: 'test.png'
            })
            .setDisplayName('Jovo Audio - Drum Solo');
    },

    AudioPlayingIntent() {
        console.log('AudioPlayingIntent()');
        this.$layout.single = 'Playing audio - layout style!';
        this.tell('Playing audio.');
    }
});

module.exports.app = app;
