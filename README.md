# TwitterBotWebhooks
A Twitter bot that interacts to chat and events (like follow) with rich interface (quick replies, buttons, media...).

************Twitter bot with auto registration of webhook and subscription************
 
What we are going to build, is a chatbot (using only direct messages and following back),
it has to follow back when someone follows the app and to respond when the app receives any message.
To build this chatbot, we are going to use the twitter API and node.js with an express server, and ngrok.
 
 1/Set up our environment 
First step is to set up our environment on Twitter (having an account is an obligation) : 
To make our twitter bot we need some determination and :
*)An approved Twitter developer account: you need to apply and answer all the questions easy and fast no worries.
*)You should have an account activity API : hover in your name right above and click on Dev Environments, 
you need to set up a dev environment — call it dev (dev environment label) for this project (just to make it easy when copying ;) ) 
*)A Twitter app with generated consumer keys and access tokens (Read,write and direct messages access) : 
hover in your name right above and click on Apps, choose your app then click on details then you will find this on clicking on Permissions 

2/install this project on your computer. 

3/run npm install 

4/Create a file ".env" in the main root and copy your consumer API keys, API secret key, access token & access token secret in the right place: 

here you can make a copy : 
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
TWITTER_WEBHOOK_ENV=dev
//in the code we choose the development label as "dev"

5/Now, you have to follow those steps : 
  *) Run the command : ngrok http 3000
  *) Copy the https URL provided by ngrok 
  *) Paste the URL in our app twitter configuration (Callback URL) with adding ‘/webhook/twitter’ (https://developer.twitter.com/en/apps/)
  *) Go to our project folder and execute the command : npm start 
  *) In another terminal, execute this command with passing as a parameter the URL provided by ngrok (https) : node registerWebhook.js the_provided_url 
  *) If the registration and subscription go well (make sure that you pass the url without ‘/webhook/twitter’) , run the command : node Auth.js and you will get the list of subscription (you can get your id) 
Check the terminal where you execute npm start, and you will start getting the events.

6/Now, if anyone follows you, the app will follows back and send a welcome message. 
If anyone send hello or hi it will respond, if anyone send "about" it will respond with buttons, ... 
You can try to send another media attachment : go to AddFile.js and change the path to your file and than run npm start.


Hope this project can help anyone. 


A big thanks to Marrouchi Mohamed and Nemlaghi Bechir =) 
