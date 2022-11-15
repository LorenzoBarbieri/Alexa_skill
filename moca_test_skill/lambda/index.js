/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const color = ["red","blue","orange","green","yellow"];
const animal = ["dog","cat","elephant","snake","lion"];
const city = ["New York", "Los Angeles", "Chicago","San Francisco","Buffalo"];
const profession = ["doctor","lawyer","professor","engineer","farmer"];
const sport = ["basket","football","skating","rugby","volleyball"];


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const speakOutput = 'Welcome,i will tell you 5 words.Try to repeat them.';
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = await attributesManager.getSessionAttributes()|| {};
        const random = [color[Math.floor(Math.random()*color.length)],animal[Math.floor(Math.random()*animal.length)],city[Math.floor(Math.random()*city.length)],profession[Math.floor(Math.random()*profession.length)],sport[Math.floor(Math.random()*sport.length)]];
        //var words = color[Math.floor(Math.random()*color.length)];
        //const random =[Math.random(color),Math.random(animal),Math.random(city),Math.random(profession),Math.random(sport)];
        sessionAttributes.random_vect = random;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        let string = " ";
        for (let value of random) {
            string = string + value+" ";
        }
        const speakOutput2 = "Remember these five words:" +string;
        return handlerInput.responseBuilder
            .speak(speakOutput + speakOutput2)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const attentionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'attentionIntent';
    },
    async handle(handlerInput) {
        let score = 0;
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = await attributesManager.getSessionAttributes()|| {};
        const {intent} = requestEnvelope.request;
        const check_vector = sessionAttributes.random_vect;
        const color_slot = Alexa.getSlotValue(requestEnvelope, 'color');
        if (color_slot === check_vector[0]) { score = score +1; }
        
        const animal_slot = Alexa.getSlotValue(requestEnvelope, 'animal');
        if (animal_slot === check_vector[1]) { score = score +1; }
        
        const city_slot = Alexa.getSlotValue(requestEnvelope, 'city');
        if (city_slot === check_vector[2]) { score = score +1; }
        
        const profession_slot = Alexa.getSlotValue(requestEnvelope, 'profession');
        if (profession_slot === check_vector[3]) { score = score +1; }
        
        const sport_slot = Alexa.getSlotValue(requestEnvelope, 'sport');
        if (sport_slot === check_vector[4]) { score = score +1; }
        sessionAttributes.score = score;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
       const speakOutput = `Thank you. Your score is ${score}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const scoreIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'scoreIntent';
    },
    async handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = await attributesManager.getSessionAttributes()|| {};
        const {intent} = requestEnvelope.request;
        const score = sessionAttributes.score;
        const speakOutput = `Your score is ${score}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        attentionIntentHandler,
        scoreIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();