# Bixby Capsule Example

This project is a basic showcase for the [Jovo Bixby Integration](). This includes a Bixby Capsule inside the `platforms/` folder and the basic Jovo `Hello World` Application. With the Jovo Bixby Integration, you will be able to program highly scalable cross-platform voice applications for Bixby and use the countless integrations for the Jovo Framework, such as persistent user storage and Content-Management-Systems.

## Usage

If you are not familiar with developing for Bixby, you can find a guide [here]().

As mentioned, this project has two parts, a Jovo application and a Bixby capsule. The Jovo Bixby Integration works by using [remote-endpoints](). When an action is triggered, Bixby forwards the request to the specified webserver, in our case the Jovo app, which handles the request just like a regular intent and responds with your desired output. For this to work, go ahead and clone this repository to your workspace and start the Jovo app by running `jovo run [-w]` in the project's root folder's terminal.

Now, open Bixby Studio and open the capsule, located in `platforms/bixby`. You might notice that the file structure looks a bit different than usual. First, there is no `code/` folder. This is because all the code logic will be handled by our Jovo app. In `models/`, you will see a `Jovo/` folder, which contains all the necessary models for the integration to work, e.g. `JovoSessionData` for handling session data and `JovoResponse`, which will define our response structure.

Your own capsule begins with defining [Actions](). These models help Bixby understand, how to act upon a specific user prompt. In this project, you will see two already defined actions, `LaunchAction` and `MyNameIsAction`. As you can probably tell, these are intent-oriented, meaning that for every intent in your Jovo app, you have to define an action, defining what inputs and outputs to expect.

### Actions

#### LaunchAction

This action is the entry point to your voice application, so it won't expect any inputs. As for output, in most cases it will be sufficient to use `JovoResponse` here. However, if you want to return a more specific response, you can create a new structure and [extend]() the JovoResponse. If your own response does not add any attributes to the JovoResponse, use the [`role-of`]() feature.

#### MyNameIsAction

This action is more complicated, as it expects specific inputs to function correctly. `_JOVO_INPUT_name` defines the name input, which will be used to return a welcome message to your user. All capsule-dependent inputs have to be prefixed with `_JOVO_INPUT_`, followed by your input identifier. However, the action requires one more input property: `_JOVO_LAST_RESPONSE_` of type `JovoResponse`. This one is a bit tricky. 

To keep session data request-persistent, we need to include it in the conversation between Bixby and Jovo. That's why we have a `_JOVO_SESSION_DATA_` field in our `JovoResponse` model. To include those in a new request, we tell Bixby to require an input property of type `JovoResponse`. When Bixby receives a `JovoResponse`, it stores it into its own cache. Now, when the user triggers the `MyNameIsAction`, which tells Bixby to require an input property of type `JovoResponse`, Bixby will look for any available inputs matching this type. Since the user didn't provide it, Bixby takes it from our `LaunchAction`, hence including the then returned session data in the new request.

### Training

Read more about training [here]().

Just as you have to train language models for Amazon Alexa and Google Assistant, you have to train Bixby as well, only that it happens right in the Bixby Studio. Just add a new training phrase, specify your goal (for our case, this would be a specific action to trigger) and your desired inputs and you're good to go.

### Endpoints

Now that you defined your models and trained Bixby on how to understand specific user prompts, the last thing you have to do is define endpoints. While structures, primitives and actions tell Bixby what to expect, endpoints define where to execute code, once a specific action has been triggered by a training phrase. Normally, this would be a local javascript file. However, Bixby allows us to use [`remote-endpoints`](), which basically means that we can provide specific URIs from a webserver of some kind, in our case our Jovo endpoint. For this, take your endpoint uri and paste it into `resources/base/capsule.properties`. Keep in mind, that this has yet only been tested with a local webhook endpoint. Finally, in  `resources/en/endpoints.bxb`, we can define our endpoints. For this, reference the endpoint uri with `{remote.url}` and concatenate your desired intent as a query parameter. If no intent is given, the `LAUNCH` intent is triggered.