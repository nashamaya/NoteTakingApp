# Project Title : Note Taking App
A simple note-taking app built with Node.js, Express, and Bootstrap. 

# Description
This app is designed for a foundation or NGO. It allows users within the community to create and view each other’s notes, keeping everyone updated on projects, ideas, plans, meetings, celebrations, and concerns. 

# Installation Instructions
1. Clone the Repository
```JavaScript
git clone https://github.com/nashamaya/NoteTakingApp.git
```
2. Navigate to the project directory
3. Install Dependencies
  
```JavaScript
npm install 

"dependencies": {
    "bcrypt": "^5.1.1",
    "body-parser": "^1.20.2",
    "connect-mongo": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-flash": "^0.0.2",
    "express-session": "^1.18.0",
    "mongoose": "^8.5.2",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0"
  }
```
- Install nodemon as devDependencies
```JavaScript
npm install nodemon --save-dev

"devDependencies": {
    "nodemon": "^3.1.4"
  }
```
4. Specify app.js in 'package.json' and add a script t0 start your application with 'nodemon'
```JavaScript
"main": "app.js"

"scripts": {
    "start": "nodemon app.js",
  },
```
5. Set up environment variables
- create a .env file and add the following

```JavaScript
SESSION_SECRET=secret
PORT=
(if no `PORT` variable specified, it will default to 3080)
```
6. Start the application
```JavaScript
npm start
```
7. Access the application
Open a web browser and navigate to `http://localhost:PORT`, where PORT is specified in the environment's configuration (.env)

8. Connect to MongoDB
```JavaScript
mongoose.connect('mongodb://localhost:27017/notetakingDB')
```

# Usage Instructions

1. Go to the home page --->   `http://localhost:PORT`


![Home Page](images\HomePage.PNG)


2. First time user --->  Go to Sign up.
- username and password are required.
3. Automatically redirected to a Login page.


4. As a logged-in user, 'All Notes' and 'My Notes' page can be explored and a new note can be created from either of those pages.
5. Once logged in successfully, the greeting message is displayed on the top left.
6. Once a new note is created, it will display in 'All Notes' page.  

   If there are more than 100 characters in the notes, 'read more' will appear.


7. The user can edit and delete their own notes from 'My Notes' page.
8. Once there are more than 6 notes per page, a pagination button will be displayed to direct to see more notes on the next page. 

![Allnotes page](images\AllNotesPage.png)

![Mynotes Page](images\MyNotesPage.png)



# The app structure
![App structure](images\AppStructure.png)


<!--Note_Taking_App/
|_____ frontend/
|      |_____ allnotes-search/
|      |  |____ allnotessearch.css
|      |  |____ allnotessearch.js 
|      |  |____ index.html
|      |
|      |_____ dashboard/
|      |  |____ dashboard.css
|      |  |____ dashboard.js
|      |  |____ index.html
|      |
|      |_____ login/
|      |  |____ index.html
|      |  |____ login.css
|      |  |____ login.js
|      |
|      |_____ register/
|      |  |____ index.html
|      |  |____ register.css
|      |  |____ register.js
|      | 
|      |_____ usernotes/
|      |  |____ index.html
|      |  |____ mynotes.css
|      |  |____ mynotes.js
|      |
|      |_____ homepage.css
|      |_____ homepage.js
|      |_____ index.html
|
|_____images/
|  |____ AllNotesPage.PNG
|  |____ HomePage.PNG
|  |____ MyNotesPage.PNG
|
|_____ routes/
|  |____ allnotes.js
|  |____ mynotes.js
|  |____ search.js
|  |____ users.js
|
|__ .env
|__ .gitignore
|__ app.js
|__ models.js
|__ package-lock.json
|__ package.json
|__ passport-config.js
|__ README.md-->
