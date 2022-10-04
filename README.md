<h1>Defib</h1>
<span><img src="https://img.shields.io/badge/STATUS-ON%20DEVELOPMENT-yellow"></span> <span><img src="https://img.shields.io/badge/LICENSE-MIT-green"></span>
<h2>Description</h2>
Defib is an opensource webapp that can help to reduce heart attack’s mortality index. When someone suffers a cardiac arrest on the street, people always call emergency services while, perhaps, there’s a nearby public institution that owns a defibrillator. So, Defib’s main functionality is to find defibrillators near the incident (and gives the user the opportunity to contact those establishments). IMPORTANT: all of this process must be executed once called the emergency services.


<h2>System explanation</h2>
While one assistant is calling emergency services, another one can visit https://defib.onrender.com (provisional domain) to search for nearby defibrillators. The user must allow the website to access location services, because the app estimates the shift time between the incident and every defibrillator in the current town.

Once it has computed all the results, it’ll offer the user only the nearest ones (those that you can get in under 15 minutes). By clicking on a result, it’ll call the establishment that owns that defibrillator.

There’s also an additional service: from this link https://defib.onrender.com/volunteers (mainly thought for police, for example), users we’ll be able to see all recent incidents in a specific town.

To ensure the correct state of every defibrillator in our database, we’re planning to supply a defib-administrator account to every establishment that owns one. From there, they’ll be able to change the state of the defibrillator from active to inactive, select the vehicles they may have (to compute the time to arrive at the incident), the opening hours, etc. They’ll use this link: https://defib.onrender.com/defib



<h2>Technical explanation</h2>
When the user visits the main page, the server (the “index.js” file) renders the “get-location.ejs” file, one file that gets the user's current location (with user’s permission) and instantly saves the coords into the browser’s localstorage. Then, redirects the user to the same url, adding the coords params (via POST). The server detects this data and finds the nearest defibrillators, to render them to the user, using the “index.ejs” file. This main page contains a script that opens an incident in the real-time incidents database (“incidentschema”), via WebSockets. This’ll be used for showing all the open incidents in the volunteers page (we’ll talk about it in the “Volunteers” section).


As we said, to get the nearest defibs, we get them via the backend. All of this process is done in the “distance.js” file. Its main function (“getDefibs”), uses the coords of the user to search all the defibs in the MongoDB (“defibschema”). All this amount of data is collected from https://catalegdades.caib.cat/Salut/Registre-Any-2018-Desfibril-ladors-Semiautomatics-/ngxk-3kst, this is the official data bank from the Balearic Islands. IMPORTANT: this data is from 2018, they’re working to offer the most updated data. The “getDefibs” func gets only the defibs located in the same town (to get the town, we’re using OpenWeather Reverse Geocoding API, as MVP; we’ll try to create our own system in the future, to avoid depending on other projects) than the incident (we’re thinking to update it by mapping the entire world in hexagons, so instead of using towns -of different sizes- we would be using hexagons of the same size. Check H3 system:
https://datascience-alw.medium.com/lo-que-necesitas-saber-para-crear-visualizaciones-con-h3-en-r-y-analizar-datos-geo-espaciales-c223442d4367). Once it has all the defibrillators in the town, it computes the time to arrive to the incident of each one (it takes in account the nearest real route to arrive, and using the fastest vehicle that every establishment owns -this can be modified by defib administrators, we’ll talk about it at “Defib Admins” section), by using the Geoapify Routing API (this, as MVP; in the future, we’ll try to create our own system). Once it’s got all the results, it sorts and returns them to the server to render them to the final user. Protocol used: HTTP, GET method.


To manage the status of a defibrillator, the administrator must visit https://defib.onrender.com/defib. If the user hasn’t got registered, the backend redirects him/her to the login page (a simple log-in form that requests username and password). When the user is authenticated, the server gets the data from the device related to the user (every “userschema” has a field for username, for password and for the id of the corresponding defibrillator) and renders the “edit-defib.ejs” file, with all the fields with its respective data. When the admin makes some changes, we validate those changes to be correct in both frontend and backend, via regex. Those regular expressions are stored in the file “regex.js”, an object that contains the regex and an error message (in case of unmatch) for every name (of every input) in the “defib.ejs” form. Furthermore, we validate that the coordinates given coincide (more or less) with the address given (using the geocoding API of Geoapify). To handle the checkboxes value (to be true if checked and false if not) we use a script located in the “edit-defib.js” file, in the “html-js” folder. When the user saves the info, as we said, we validate it also in the backend and, if it’s correct, we overwrite it. If it’s not correct, we don’t save any information and notify the user using the “showFBPopup” function (that’s in the “feedback-popup.js” file, in the “html-js” folder).


When a user enters in https://defib.onrender.com/volunteers, the server renders the “volunteers.ejs” file (it could perfectly be a plain html file, data is received and rendered asynchronously). Once there, the backend gets all the incidents stored in the MongoDB (“incidentschema”) and send to the page (using the “sendIncidents” function) all the current incidents via WebSockets and will render all of them, using the “renderIncidents” function (stored in the “volunteers.js” file, in the “js” folder). From now on, every time that another incident happens, the server will repeat the same process, to ensure that all of the “/volunteers” page’s clients get the lastest results. Furthermore, this incident will fire another socket event, containing its coords. The client will use this second event to show a notification to the user (if he/she has given the requested permission). To show notifications, we’re using the “notifyNewIncident” function.
When the user clicks on an incident, the page will open a Google Maps link with the fastest route to reach there, using the “openGoogleMaps” function. Then, the client will fire a socket event to the server notifying it that someone is going to that incident. The server will store that data into de MongoDB. After these changes, the server will repeat the process to offer to the clients the most updated info.


<h2>Corporative information</h2>
The title of the project is Defib. It’s an abbreviation of defibrillator, a word that I think it’s very difficult to pronounce.

The colors:
Light green (#00FF8C): this color is usually associated with hope and calm. I think both emotions can help in the stressful situation of a heart attack.

Yellow (#FFF714): I chose this color because I think it combines perfectly with the green I used. This color combination is usually used by Feid, a singer that I like and sometimes I listened to while creating the app.


<h2>How to access to the webapp</h2>
We have deployed a test version in Render.

To use the test version of the app, you may visit https://defib.onrender.com/. Maybe, you’ll have to wait around 10 seconds, to let the server run the app (those are Render politics for free tiers). Then, it’ll work fine. Only one thing, the current version is only available in catalan, so maybe you’ll have to turn on the translator.


<h2>App Explanation</h2>
<h3>Main app (splash screen)</h3>
<figure>
  <img src="https://raw.githubusercontent.com/GuillemBagur/GuillemBagur/main/pat-imgs/loading-main.png">
  <caption>
    This is what you see when you visit the webapp. It usually lasts by 5-15 secons, depending the city. In the final version, it'll be faster.
  </caption>
</figure>

<h3>Main app</h3>
  <figure>
  <img src="https://raw.githubusercontent.com/GuillemBagur/GuillemBagur/main/pat-imgs/main.png">

  <caption>
    1) Click to call 112 (European emergency phone number).<br />2) Cancel (to hide the popup). You can click it if you want to look over the app. If it's an actual emergency, please call first to 112.<br />3) Found nearby defibrillator. By clicking on any one (the first one is always the nearest so, in case of emergency, please click it) you'll be calling to their phone number, to let them know about the incident.<br />4) Estimated time to arrive (from the establishment -the defibrillator owner- to the incident).<br />5) Establishment's name.<br />6) Establishment's address.
    </caption>
 </figure>
 
 <h3>Volunteers' app</h3>
  <figure>
  <img src="https://raw.githubusercontent.com/GuillemBagur/GuillemBagur/main/pat-imgs/volunteers.png">

  <caption>
    1) Found incident. By clicking there, it'll open a Google Maps with the fastest route to reach there.<br />2) Time it ocurred.<br />3) Exact coordinates.<br />4) The number of volunteers that are already going to help (it counts the number of times that different people has clicked that incident).
    </caption>
 </figure>



<h2>How to clone and upgrade the project</h2>
To clone the project, you can type:
git clone https://github.com/GuillemBagur/patorrat.git
git clone git@github.com:GuillemBagur/patorrat.git
gh repo clone GuillemBagur/patorrat

Inside the repo, you’ll find a folder called “docs”. There, you have all the explanations of every function. It has been generated automatically using JSDoc so, any doubt you may have, please contact me.

<h3>Setup:</h3>
For the app to work, you must create an “.env” file. You can change the name of the “.sample_env” to “.env”, and then, create an account in every service and paste the respective keys there. Then, duplicate the sample database (you'll find the defibs database in the "data" folder) and deploy it on MongoDB Atlas. Finally, paste the link of the DB into the “.env” file.

<h3>Do not remove:</h3>
.env (you must create it first).<br />
.gitignore<br />
package-lock.json<br />
package.json<br />

<h3>Environment files (optional files):</h3>
.clocignore: a list of directories that cloc (a terminal tool for counting lines of code) must ignore.<br />
colors.txt: contains the hex of both colors: green and yellow.<br />
jsdoc.json: the configuration of the JSDoc tool (a tool for generating comment-based documentation automatically).<br />

<h3>App files:</h3>
index.js: the server<br />
src<br />
css: a folder that contains all the css files.<br />
html-js: a folder that contains all the client-side js files.<br />
js: a folder that contains all the server-side js files.<br />
schemas: a folder that contains all the MongoDB schemas.<br />
views: a folder that contains all ejs templates.<br />
<br />
IMPORTANT: sometimes, you’ll find some server-side js functions are called from the client side (or vice versa).
<br />

<h3>Tasks to do:</h3>
Our own routing API: currently, we’re using the Geoapify one. For more info, check the technical explanation section).<br />
Our own reverse geocoding API: currently, we’re using the OpenWeatherMap one. For more info, check the technical explanation section).<br />
<br />
If you want to create one of the tasks above, please, contact me. Before publishing any content of this project, please read the license.


<h2>Developers</h2>
At the moment, all of this work has been done by Guillem Bagur (https://github.com/GuillemBagur/).

Do you want to collaborate? Contact me!


<h2>License</h2>
Copyright 2022-now GUILLEM URIEL BAGUR MOLL

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
