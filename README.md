#Sign-X-Wave

How to run with model and login:

before running any terminals:
open xampp, (https://www.apachefriends.org/download.html)
start apache and mySQL,
open admin of mySQL,
go to import,
import signup.sql (inside the server file)

Terminal one:
cd server,
npm install,
python app.py

terminal two:
cd server,
npm install mysql2 (if you don't have it already),
node server.js

terminal three:
cd client,
npm install,
npm start
