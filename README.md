# Bixby Capsule Example

This project is a basic showcase for the [Jovo Bixby Integration](https://github.com/jovotech/jovo-framework/pull/638). This includes a Bixby Capsule inside the `platforms/` folder and the basic Jovo `Hello World` Application. With the Jovo Bixby Integration, you will be able to program highly scalable cross-platform voice applications for Bixby and use the countless integrations for the Jovo Framework, such as persistent user storage and Content-Management-Systems.

## Usage

To use the example project with the Jovo Bixby Integration, go ahead and clone this repository to your workspace of choice. This will include both the Jovo example app and a Bixby capsule in `./platforms/`. The only thing you will need now is the integration itself. To achieve this, you need to clone the branch of the pull request and copy the integration from there (this progress is a bit hacky and work in progress, but will work for now). Use the command `git clone https://github.com/jovotech/jovo-framework.git -b feature/mongoose-support /my_clone` and copy the integration to the example project's `node_modules/` folder by using `cp ./jovo-framework/jovo-platforms/jovo-platform-bixby ./jovo-bixby-capsule-example/node_modules/ -r`.

Now that your files are all set, you can go ahead and run the Jovo instance by executing the [`run`]() command `jovo run [-w]`. This will start the Jovo application and give you a webhook uri. Go ahead and copy this uri, you will need it in a second.

Now, open Bixby Studio and open the capsule, located in `platforms/bixby/`. You might notice that the file structure looks a bit different than from a usual Bixby project. First, there is no `code/` folder. This is because all the code logic will be handled by our Jovo app. In `models/`, you will see a `Jovo/` folder, which contains all the necessary models for the integration to work, e.g. [`JovoSessionData`](#jovosessiondata) for handling session data and [`JovoResponse`](#jovoresponse), which will define our response structure.
Go ahead paste your webhook uri in `resources/base/capsule.properties` to define a remote endpoint for the capsule.

Almost done! The last thing to do is to compile the capsule and finally run your first command. For this, go to `resources/en/training` and hit the big `Compile NL Model` button. Open the Bixby simulator (`View`>`Open Simulator`, or `Ctrl+7` on Linux), type "Open Jovo Test Capsule" in the big box and hit `Run NL`.

Congrats, you successfully used the Jovo Bixby Integration. You can answer the returned question with something along the lines of "My name is {your name here}", which should present you with a neat welcoming message. Now you can experiment with more inputs, states, databases and many more Jovo features.

## Functionality

If you are not familiar with developing for Bixby, you can find a guide [here](https://bixbydevelopers.com/dev/docs/get-started).

The basic functionality of the integration is based on using [remote-endpoints for Bixby](https://bixbydevelopers.com/dev/docs/dev-guide/developers/actions.configuring-endpoints#remote-endpoints). When an action is triggered, Bixby forwards the request to a specified webserver, in our case the Jovo application, which handles the request just like a regular intent and responds with your desired output.

### Actions

Your own capsule begins with defining [Actions](https://bixbydevelopers.com/dev/docs/reference/type/action). These models help Bixby understand how to act upon a specific user prompt. In this project, you will see two already defined actions, `LaunchAction` and `MyNameIsAction`. As you can probably tell, these are intent-oriented, meaning that for every intent in your Jovo app, you have to define an action, defining what inputs and outputs to expect.

#### LaunchAction

This action is the entry point to your voice application, so it won't expect any inputs. As for its output, in most cases it will be sufficient to use [`JovoResponse`](#jovoresponse) here. However, if you want to return a more specific response, you can create a new structure and [`extend`](https://bixbydevelopers.com/dev/docs/reference/type/structure.extends) JovoResponse by adding your own structure properties. If your own response does not add any attributes to the JovoResponse, use the [`role-of`](https://bixbydevelopers.com/dev/docs/reference/type/name.role-of) feature.

#### MyNameIsAction

This action is a bit more complicated, as it expects specific inputs to function correctly. In our example app, `_JOVO_INPUT_name` defines the name input, which will be used to return a welcome message to your user. All capsule-dependent inputs have to be prefixed with `_JOVO_INPUT_`, followed by your input identifier. However, this action, in fact every action (except for the LaunchAction) requires one more input property: `_JOVO_LAST_RESPONSE_` of type `JovoResponse`. This one is a bit tricky.

To keep session data request-persistent, we need to include it in the conversation between Bixby and Jovo. That's why we have a `_JOVO_SESSION_DATA_` field in our `JovoResponse` model. To include those in a new request, we tell Bixby to require an input property of type `JovoResponse`. When Bixby receives a `JovoResponse`, it stores it into its own cache. Now, when the user triggers the `MyNameIsAction`, which tells Bixby to require an input property of type `JovoResponse`, Bixby will look for any available inputs matching this type. Since the user didn't provide it, Bixby takes it from our `LaunchAction`, hence including the then returned session data in the new request.

### Structures

Bixby structures are models, defining and requiring a certain amount of properties, which form a general concept. These properties have certain properties themselves, defining their requirement, cardinality and type, for example. You can think of structures as a description for a json object, describing it's keys and their respective properties.

#### JovoResponse

This structure describes the expected response from a Jovo application implementing the integration. So far, the only properties it requires are `_JOVO_SESSION_DATA_` of type [`JovoSessionData`](#jovosessiondata), `_JOVO_AUDIO_FILE` of type [`audioPlayer.AudioInfo`](https://bixbydevelopers.com/dev/docs/sample-capsules/samples/audio#build-an-audioinfo-model) for playing audio and `_JOVO_SPEECH_` for speech output.

#### JovoSessionData

`JovoSessionData` describes expected properties for session data for the current Jovo application. Required properties are `_JOVO_SESSION_ID_` and `_JOVO_STATE_`. Learn more about states [here](https://www.jovo.tech/docs/routing/states). Unfortunately, if you want to use your own session data attributes, you need to define them in the `JovoSessionData` structure, else they won't be included in the next request. In the example capsule, you can already find an added session attribute in the model.

### Training

Read more about training [here]().

Just as you have to train language models for Amazon Alexa and Google Assistant, you have to train Bixby as well, only that it happens right in the Bixby Studio. Just add a new training phrase, specify your goal (for our case, this would be a specific action to trigger) and your desired inputs and you're good to go.

### Endpoints

While structures, primitives and actions tell Bixby what to expect, endpoints define where to execute code, once a specific action has been triggered by a training phrase. Normally, this would be a local javascript file. However, Bixby allows us to use [`remote-endpoints`](https://bixbydevelopers.com/dev/docs/dev-guide/developers/actions.configuring-endpoints#remote-endpoints), which basically means that we can provide specific URIs from a webserver of some kind, in our case our Jovo endpoint. The current approach is to use query parameters in the URI to define what intent to trigger on the respective endpoint. If no intent is given, the `LAUNCH` intent will be triggered. Keep in mind, that this has yet only been tested with a local webhook endpoint, testing with host providers such as AWS Lambda and Azure are pending.