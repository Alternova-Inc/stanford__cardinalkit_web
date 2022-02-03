---
home: false
title: Dashboard Deploy
footer: Stanford Byers Center for Biodesign
---

# Deploying the Web Dashboard

## 1. Configure Your Firebase Project

Before starting this section, you need to have configured a Firebase project and connected your CardinalKit iOS app to it. Please refer to 'Set up Application Infrastructure' if you haven't done this yet, then return to this section. If you have, then proceed to the next step:
 
 - Go to [firebase.google.com](https://firebase.google.com) and sign in with the same account that you set up for the mobile app.
 
 - Select the same Firebase project that you created previously.
 <br />
 <br />
 <img src="./images/project.png" alt="drawing" width="450"/>
 <br />
 <br />
 - Then select **Project Settings** in the configuration menu.
 <br />
 <br />
 <img src="./images/settings.png" alt="drawing" width="450"/>
 <br />
 <br />
 - Now select **Add app** to create a new web application and associate it with Firebase.
 <br />
 <br />
 <img src="./images/new-app.png" alt="drawing" width="775"/>
 <br />
 <br />
 - Click on the **web app** symbol.
 <br />
 <br />
 <img src="./images/webapp.png" alt="drawing" width="450"/>
 <br />
 <br />
  - Complete the Firebase form to register a new web app.
 <br />
 <br />
 <img src="./images/register1.png" alt="drawing" width="438"/>
 <br />
 <br />
  - Copy the generated Firebase configuration.
 <br />
 <img src="./images/register2.png" alt="drawing" width="650"/>
 <br />
 - Open the ***cardinal-kit-web/.env*** File and replace add the following Firebase config values.
 <br />
 <br />
   - `VUE_APP_FIREBASE_API_KEY = firebaseConfig.apiKey`
   - `VUE_APP_FIREBASE_AUTH_DOMAIN  = firebaseConfig.authDomain`
   - `VUE_APP_FIREBASE_DATABASE_URL  = firebaseConfig.databaseURL`
   - `VUE_APP_FIREBASE_PROJECT_ID  = firebaseConfig.projectId`
   - `VUE_APP_FIREBASE_STORAGE_BUCKET  = firebaseConfig.storageBucket`
   - `VUE_APP_FIREBASE_MESSAGING_SENDER_ID  = firebaseConfig.messagingSenderId` 
   - `VUE_APP_FIREBASE_APP_ID = firebaseConfig.appId` 


## 2. Deploy Firebase Functions

To automatically transform the data from Open mHealth format to FHIR format it is necessary to deploy the Firebase functions found in the project.

- Go to the [Firebase console](https://console.firebase.google.com/) and log in.
 - Install the Firebase command line package. You can follow the official documentation  [here](https://firebase.google.com/docs/cli?hl=es).

 ```bash
 npm install -g firebase-tools
 firebase login
  ```

###  Init Firebase Functions on "Firebase" folder

> Don't override any functions folder

```bash
firebase init
```
<br />

###  Then Deploy firebase functions

```bash
firebase Deploy --only functions
```

## 3. Run Vue Project

Once we have configured firebase complements, the next step is to run the service of your website locally.

```bash
 cd cardinal-kit-web
```

Once in the folder, the first thing is to install all the dependencies that the Vue project needs. For this we will use npm:

```bash
 npm install
```

After having everything installed and configured, we can run the project.

```bash
 npm run serve
```