$(document).ready(function () {
  $("column1").hide();
  $("column2").hide();

  $("#directory").on("click", function (e) {
    e.preventDefault();
    showDirectory();
  });

  $("#company").on("click", function (e) {
    e.preventDefault();
    showCompany();
  });
});

function showDirectory() {
  console.log("showDirectory()");
  var ee_list = "";
  $("#column1").html("");
  $("#column2").html("");
  $("#data_form input[name=url_path]").val("/employer/directory");
  $("#data_form input[name=form_method]").val("GET");

  var formData = $("#data_form").serializeArray();
  $("#column2").html("");
  const container = $("#column1");
  container.html("");

  // this is always a POST =>
  $.ajax({
    type: "POST",
    url: "/proxy",
    data: formData,
    success: function (response) {
      if (response.code == 200) {
        for (let ee in response.data.individuals) {
          ee_list += `${response.data.individuals[ee].first_name} ${response.data.individuals[ee].last_name} <button class="button" title="Show Individual Data" onclick="showIndividual(\'${response.data.individuals[ee].id}\')">Individual</button> <button class="button" onclick="showEmployment(\'${response.data.individuals[ee].id}\')">Employment</button> <button class="button" onclick="showPayment(\'${response.data.individuals[ee].id}\')">Payment</button> <button class="button" onclick="badEndpoint()">Bad Endpoint</button><br/>`;
        }

        $("#column1").html(ee_list);
      } else {
        $("#column1").html(
          response.code + "<br/>" + response.message + "<br/>" + response.data
        );
      }
    },
  });
}

function showCompany() {
  console.log("showCompany()");
  var output_to_display = "";

  $("#column1").html("");
  $("#column2").html("");
  $("#data_form input[name=url_path]").val("/employer/company");
  $("#data_form input[name=form_method]").val("GET");

  var formData = $("#data_form").serializeArray();
  var container = $("#column1");

  // this is always a POST =>
  $.ajax({
    type: "POST",
    url: "/proxy",
    data: formData,
    success: function (response) {
      // alert(response.code);
      if (response.code == 200) {
        iterateObject(response.data, $("#column1"));
      } else {
        $("#column1").html(
          response.code + "<br/>" + response.message + "<br/>" + response.data
        );
      }
    },
  });
}

function showIndividual(id) {
  $("#data_form input[name=url_path]").val("/employer/individual");
  $("#data_form input[name=form_method]").val("POST");
  $("#data_form input[name=individual_id]").val(id);

  var formData = $("#data_form").serializeArray();

  $("#column2").html("");

  $.ajax({
    type: "POST",
    url: "/proxy",
    data: formData,
    success: function (response) {
      if (response.code == 200) {
        iterateObject(response.data, $("#column2"));
      } else {
        $("#column1").html(
          response.code + "<br/>" + response.message + "<br/>" + response.data
        );
      }
    },
  });
}

function showEmployment(id) {
  $("#data_form input[name=url_path]").val("/employer/employment");
  $("#data_form input[name=form_method]").val("POST");
  $("#data_form input[name=individual_id]").val(id);

  var formData = $("#data_form").serializeArray();

  $("#column2").html("");

  $.ajax({
    type: "POST",
    url: "/proxy",
    data: formData,
    success: function (response) {
      console.log(`response.code: ${response.code}`);
      if (response.code != 200) {
        $("#column2").html(response.message + " " + response.data);
      } else {
        iterateObject(response.data, $("#column2"));
      }
    },
  });
}

function showPayment(id) {
  $("#data_form input[name=url_path]").val(
    "/employer/payment?start_date=2010-01-01&end_date=2020-01-01"
  );
  $("#data_form input[name=form_method]").val("GET");
  $("#data_form input[name=individual_id]").val(id);

  var formData = $("#data_form").serializeArray();

  $("#column2").html("");

  $.ajax({
    type: "POST",
    url: "/proxy",
    data: formData,
    success: function (response, textStatus, jqXHR) {
      console.log(`response.code: ${response.code}`);
      if (response.code != 200) {
        $("#column2").html(response.message);
      } else {
        iterateObject(response, $("#column2"));
      }
    },
  });
}

function badEndpoint() {
  $("#data_form input[name=url_path]").val("/employer/bad");
  $("#data_form input[name=form_method]").val("POST");

  var formData = $("#data_form").serializeArray();

  $("#column2").html("");

  $.ajax({
    type: "POST",
    url: "/proxy",
    data: formData,
    success: function (response, textStatus, jqXHR) {
      if (response.code != 200) {
        $("#column2").html(response.message + " " + response.data);
      } else {
        iterateObject(response.data, $("#column2"));
      }
    },
  });
}

// ChatGPT wrote this function!    ==>
function iterateObject(obj, container) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // if (typeof obj[key] === "object" && obj[key] !== null) { // to filter out null values
	  if (typeof obj[key] === "object") { 
   		
    	const div = $("<div></div>");
        div.html(`<strong>${key}:</strong>`);
        container.append(div);
        const nestedContainer = $("<div></div>");
        nestedContainer.css("margin-left", "20px");
        container.append(nestedContainer);
        iterateObject(obj[key], nestedContainer); // Recursively iterate through nested object
		
      } else {
		
        const div = $("<div></div>"); // Create a new div element using jQuery
        div.html(`<strong>${key}:</strong> ${obj[key]}`); // Set the HTML content of the div
        container.append(div); // Append the div to the container using jQuery
		
      }
    }
  }
}
