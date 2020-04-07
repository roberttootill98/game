// create a config

Remote play demo
================

This is a prototype for demonstrating a remote play implementation using node.js, through the use of sockets for two way connection.

By default this application runs on the local address

Setup
================

System requirements
----------------
This application must be run on a system with npm and mysql server installed.
Run npm install when in the root directory of this application in order to install all of the packages.

Config
----------------
A config.json must also be created within the server folder, it is structured as follows:

{
  "mysql": {
    "host": sql_hostname,
    "user": sql_username,
    "password": sql_password,
    "database": "gameDatabase"
  },
  "testConfig": {
    "bandwidth": test_bandwidth
  }
}

**test_bandwidth** is changed to measure the performance of the system

Database initialisation
-----------------
Once the config is created the database must be initialised, this is done by running **init_database**, followed by **populate_database**.

Running the application
-----------------
Once all of these steps are completed the server is run by using **npm start**.

Demo details
=================
There are two accounts created on the system that can be used.

User 1
-----------------
Username: Rob
Password: myPassword

User 2
-----------------
Username: Dylan
Password: myPassword1

More accounts can be added in the populate.sql file.

Testing
-----------------
There are 3 tests that can be run.

1. **artillery_test_local**, checks that artillery can reach the local address
2. **artillery_test**, tests a simple api call
3. **artillery_demo**, tests a typical use case of the system
