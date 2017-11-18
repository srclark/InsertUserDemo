# InsertUserDemo
Demo of a single page web app using node.js, express, mysql, sequelize, and jade.  This app is a single page app that includes a rest api that allows for inserting users into a table and deleting the users.  My node version is 8.9.0.  All non-global packages have been saved to package.json.

## Clone and start

1.  Clone the repo
2.  In the command line, ```cd InsertUserDemo```
3.  Install the packages, ```npm install```
4.  Start the app, ```npm start```
5.  Go to localhost:3000 in your browser
6.  Have fun!

Note: You can install nodemon ```node install -g nodemon``` to keep the app running while debugging.  See https://www.npmjs.com/package/nodemon

## Express

I used express-generator to jump start the project, then modified the projects to meet my needs.  Express-generator creates jade files even though the template engine has been replaced by pug.  I have not replaced jade with pug.

## mysql/sequelize

I used MySQL 5.7 with the mysql2 and sequelize modules.  I used sequelize and express-validator to prevent SQL injection.  I installed sequelize-cli globally.

- I created a database called 'users' in mysql.  I did add a password, so your config might be slightly different than mine, see config/config.json
- Install sequelize-cli ```npm install -g sequelize-cli``` 
- Use the cli to do the sequelize setup ```sequelize init```
- Edit config/config.json to use the correct database, password, etc.
- Create the model: ```sequelize model:create --name users --attributes first_name:string,last_name:string,street_addr:string,city:string,state:string,zip:string```
- Set up the db tables ```sequelize db:migrate```
- I used the SequelPro app to give the fields, createdAt and updateAt (in the users table) a default value, CURRENT_TIMESTAMP

## bootstrap styling

Although I'm used to creating user interfaces from designer specs, I completely used Bootstrap styling for my app.

## Error Handling

Right now I'm handling all errors returned from sequelize with an alert.  For express-validator errors, I'm showing just the first error above the user insert form.
