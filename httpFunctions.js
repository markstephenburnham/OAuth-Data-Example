"use strict";
const axios = require("axios").default;
var util = require("util");

async function makeAPIPostRequest(
  method,
  base_url,
  url_path,
  form_data,
  access_token
) {
  var rawData = "";

  const axiosConfig = {
    method: method,
    baseURL: base_url,
    url: url_path,
    data: form_data,
    port: 443,
    headers: {
      "Content-Type": "application/json",
      "Finch-API-Version": "2020-09-17",
    },
  };

  axiosConfig.headers.Authorization = access_token;

  try {
    rawData = await axios(axiosConfig);

    return rawData.data;
  } catch (err) {
    console.log(`makeAPIPostRequest ERROR - axiosConfig.url: ${url_path}`);
    console.log(`makeAPIPostRequest ERROR - axiosConfig.baseURL: ${base_url}`);

    throw `makeAPIPostRequest FAIL: (${err}) - ${util.inspect(axiosConfig)}`;
  }
}

async function makeAPIRequest(
  method,
  base_url,
  url_path,
  form_data,
  access_token
) {
  var rawData = "";
  var response = "";

  const axiosConfig = {
    method: method,
    baseURL: base_url,
    url: url_path,
    // data: {
    //   requests: [{ individual_id: "3f112ab2-8f0c-4096-9d66-ac5a8c4e7f6a" }],
    // },
    data: form_data,
    port: 443,
    headers: {
      "Content-Type": "application/json",
      "Finch-API-Version": "2020-09-17",
    },
  };

  // TRYING TO GENERALIZE THE CASE WHERE YOU DON'T HAVE THE ACCESS TOKEN YET,
  // YOU'RE TRYING TO OBTAIN IT
  if (access_token != "none") {
    console.log(`makeAPIRequest - access_token: ${access_token}`);
    axiosConfig.headers.Authorization = `Bearer ${access_token}`;
  }

  try {
    response = await axios(axiosConfig);

    console.log(`[makeAPIRequest]  TRY: RESPONSE STATUS:  ${response.status}`);
    // IF NOT 200, RETURN CUSTOM ERROR MESSAGE TO MATCH RESPONSE BELOW
    if (response.status != 200) {
      const simErrorResponse = {
        status: response.status, // HTTP status code
        message: err.response.statusText || "Internal Server Error", // Error message
        data: { code: response.status, message: "not found" },
      };

      return simErrorResponse;
    } else {
      return response;
    }
  } catch (err) {
    console.log(
      `[makeAPIRequest] CATCH RESPONSE STATUS:  ${err.response.status}`
    );
    const errorResponse = {
      status: err.response ? err.response.status : 500, // HTTP status code
      message: err.response.statusText || "Internal Server Error", // Error message
      data: err.response ? err.response.data : null, // Additional error data
    };

    console.log(`makeAPIRequest ERROR: ${util.inspect(errorResponse)}`);

    return errorResponse;
  }
}

module.exports = {
  makeAPIRequest: makeAPIRequest,
  makeAPIPostRequest: makeAPIPostRequest,
};
