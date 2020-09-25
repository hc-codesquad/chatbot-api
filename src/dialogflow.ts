const dialogflow = require('@google-cloud/dialogflow');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} sessionId The session to be used for identify chat
 * @param {string} message The message to be used for chat text
 * @param {string} languageCode The languageCode to be used for chat language
 */
export async function getIntent(
  sessionId: string,
  message: string = 'Oi',
  languageCode: string = 'pt-br',
) {
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.GOOGLE_PROJECT_ID,
    sessionId,
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode,
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return responses;
}
