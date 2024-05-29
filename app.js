"use strict";

const express = require("express");
const session = require("express-session");
const multer = require("multer"); // https://www.npmjs.com/package/multer - used to parse various form types
const upload = multer();
const util = require("util");

const app = express();
const port = process.env.PORT || 3000;

const hf = require("./httpFunctions.js");

app.use(express.json()); // to parse json form data
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(upload.array()); // multer: for parsing multipart/form-data
app.use(express.static("public"));

app.use("/js", express.static(__dirname + "/js"));
app.use("/css", express.static(__dirname + "/css"));
app.disable("etag"); // IMPORTANT - NECESSARY TO MAINTAIN SESSION STATE

const AUTH_URL = `https://connect.tryfinch.com/authorize?&client_id=${process.env.C_CLIENT_ID}&products=company directory individual employment&redirect_uri=${process.env.C_REDIRECT_URL}&sandbox=true`;

/*

sandbox URL =>

https://connect.tryfinch.com/authorize?&client_id=f042fbea-cc32-460b-a726-d1437bf802cf&products=company directory individual employment benefits payment pay_statement&redirect_uri=http://localhost:3000/auth

DEV sandbox creds =>

login: largeco
pass: letmein

 curl https://api.tryfinch.com/employer/directory \
  -H 'Authorization: Bearer 7b7c51ef-4ab7-4a90-a67f-cf27e9deb275' \
  -H 'Content-Type: application/json' \
  -H 'Finch-API-Version: 2020-09-17'

*/

// CHECK ENVIRONMENT VARIABLES
if (!process.env.C_CLIENT_ID) {
  console.log(
    "CONFIG ERROR: Please set the C_CLIENT_ID environment variable (see envars.sh)"
  );
  return;
}

if (!process.env.C_REDIRECT_URL) {
  console.log(
    "CONFIG ERROR: Please set the C_REDIRECT_URL environment variable (see envars.sh)"
  );
  return;
}

if (!process.env.C_CLIENT_SECRET) {
  console.log(
    "CONFIG ERROR: Please set the C_CLIENT_SECRET environment variable (see envars.sh)"
  );
  return;
}

const oneDay = 1000 * 60 * 60 * 24;

app.use(
  session({
    secret: "thisismysecrctBHGHrty84fwir767",
    saveUninitialized: true,
    //   cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.get("/auth", async function (req, res) {
  //**  EXCHANGE AUTHORIZATION CODE FOR ACCESS TOKEN **
  // need authorization code in querystring here from OAuth

  var result;

  const auth_code = req.query.code;
  console.log(`Authorization code: ${auth_code}`);

  var API_URL = "https://api.tryfinch.com";
  var API_PATH = "/auth/token";
  var POST_DATA = `{"client_id" : "${process.env.C_CLIENT_ID}",
  "client_secret": "${process.env.C_CLIENT_SECRET}",
  "code": "${auth_code}",
  "redirect_uri": "${process.env.C_REDIRECT_URL}"
	  }`;

  try {
    result = await hf.makeAPIPostRequest(
      "POST",
      API_URL,
      API_PATH,
      POST_DATA,
      "none"
    );
    console.log(`access_token: ${result.access_token}`);
    req.session.access_token = result.access_token;
  } catch (err) {
    res.send(err);
    return;
  }

  if (req.session.access_token) {
    res.redirect("/");
  } else {
    res.redirect("/noauth");
  }
});

app.get("/", async function (req, res) {
  // NEED TO BE AUTHENTICATED HERE
  //  console.log(`req.session.access_token: ${req.session.access_token}`);

  if (req.session.access_token) {
    res.sendFile("index.html", { root: __dirname + "/" });
  } else {
    res.send(
      `To start a new Finch connection, please login <a href="${AUTH_URL}">HERE</a>`
    );
  }
});

// PROXIES AJAX REQUESTS TO API
app.post("/proxy", async (req, res) => {
  var API_URL = "https://api.tryfinch.com";
  const API_PATH = req.body.url_path;
  const METHOD = req.body.form_method;
  const INDIVIDUAL_ID = req.body.individual_id;
  var result = "";
  var REQUESTS = {};

  const responseObj = {
    code: "",
    message: "",
    data: "",
  };

  if (INDIVIDUAL_ID) {
    REQUESTS = {
      requests: [
        {
          individual_id: INDIVIDUAL_ID,
        },
      ],
    };
  }

  // NEED AN ACCESS TOKEN
  if (req.session.access_token) {
    try {
      result = await hf.makeAPIRequest(
        METHOD,
        API_URL,
        API_PATH,
        REQUESTS,
        req.session.access_token
      );

      if (result.status == 200) {
        responseObj.code = 200;
        responseObj.message = "Success";
        responseObj.data = result.data;
      } else {
        // SPECIAL CASE 404?
        responseObj.code = result.status;
        if (
          result.hasOwnProperty("data") &&
          result.data.hasOwnProperty("message")
        ) {
          responseObj.message = result.data.message;
        } else {
          responseObj.message = result.message;
        }

        responseObj.data = result.data;
      }
      res.send(responseObj);
    } catch (err) {
      console.log(`ERROR: ${util.inspect(err)}`);
      res.status(err.response.status).send(err.response.statusText);
    }
  } else {
    console.log(`Auth token missing, need to OAuth again`);
    responseObj.code = 401;
    responseObj.message =
      "Unauthorized: Missing or invalid authentication token";
    responseObj.data = `Sorry - your token has expired. Please login again <a href="${AUTH_URL}">HERE</a>`;

    res.send(responseObj);
  }
});

app.get("/noauth", async function (req, res) {
  res.send("OAUTH failed.  Please try again.");
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
