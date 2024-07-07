Automation tests for "https://the-internet.herokuapp.com/". Used: Selenium-webdriver (chrome) & Jest.

Main file with tests ("https://the-internet.herokuapp.com/") located in: 
./tests/theInternetAppTests/internet.test.js

File with snapshot tests (snapshots from "http://webdriver.io") located in:
./tests/targetTests/snapshots/snapshots.spec.js


*Scripts for running various tests:*

**npm run test** - Run tests for "theInternetApp" ("jest ./tests/theInternetAppTests/internet.test.js");

**npm run test:blackbox** - Run blackbox tests for api routers/endpoints. **Attention**: Before running test - run your API, and configure endpoints path in test.doc ("jest ./tests/blackboxApitests/crud.blackbox.test.js")

**npm run test:blizz** - Run blackbox UI e2e tests for *blizzard.com* personal account. 

**npm run test:debug** - Debug mode for "theInternetApp" ("node --inspect node_modules/.bin/jest --watch --runInBand ./tests/theInternetAppTests/internet.test.js");

**npm run test:watch** -  Run tests for "theInternetApp" in --watch mode ("jest ./tests/theInternetAppTests/internet.test.js --watch --runInBand");

**npm run test:#auth** - Run tests with '#auth' tag in thier names: ("npm run test -- -t '#auth'");

**npm run test:#download** - Run tests with '#download' tag in their names: ("npm run test -- -t '#download'");

**npm run test"snapshots** - Run snapshot test from "https://webdriver.io/" ("wdio")

**npm run sendReport** - Send test report (passed/failed/skipped/etc...) to email address. Address can be changed in "nodemailer.js" doc. ("node nodemailer.js");
