function convertString(data) {
  if (Array.isArray(data)) {
    str = "";
    for (let record of data) {
      str += record;
    }
    return str;
  } else if (typeof data === "object" && data !== null) {
    let str = "<ul>";
    for (let item in data) {
      str += "<li>" + item + " - " + data[item] + "</li>";
    }
    str += "</ul>";
    return str;
  } else if (typeof data === "string") {
    return data;
  }
}

function addTR(recordType, records) {
  tableRow = "<tr><td>" + recordType + "</td><td>";
  if (!records || (Array.isArray(records) && !records.length)) {
    tableRow += "-- No record --";
  } else if (Array.isArray(records)) {
    tableRow += "<ul>";
    for (let record of records) {
      tableRow += "<li>" + convertString(record) + "</li>";
    }
    tableRow += "</ul>";
  } else if (typeof records === "object") {
    tableRow += convertString(records);
  }

  tableRow += "</td></tr>";
  return tableRow;
}

function clearTable() {
  document.getElementById("tableBody").innerHTML = "";
  document.getElementById("resultsHeader").innerHTML =
    "Results for hostname : ";
}

function processHostname(hostname) {
  if (hostname.startsWith("https://")) {
    hostname = hostname.slice(8);
  } else if (hostname.startsWith("http://")) {
    hostname = hostname.slice(7);
  }
  if (hostname.includes("/")) {
    hostname = hostname.slice(0, hostname.indexOf("/"));
  }
  return hostname.toLowerCase();
}

function resolve() {
  document.getElementById("results").style.display = "none";
  clearTable();
  document.getElementById("submitBtn").disabled = true;
  let hostname = document.getElementById("hostname").value;
  hostname = processHostname(hostname);
  if (!hostname || !hostname.length) {
    document.getElementById("submitBtn").disabled = false;
    return;
  }
  axios
    .get(
      "https://dns-resolver-api.omkarshelar.dev/dns-resolver?domain=" + hostname
    )
    .then((response) => {
      results = response.data.results;
      for (let recordType in results) {
        let row = addTR(recordType, results[recordType]);
        document.getElementById("tableBody").innerHTML += row;
      }
      document.getElementById("errorMsg").style.display = "none";
      document.getElementById("resultsHeader").innerHTML += hostname;
      document.getElementById("results").style.display = "block";
    })
    .catch((err) => {
      console.error("Error : ", err);
      document.getElementById("errorMsg").style.display = "block";
    })
    .finally(() => {
      document.getElementById("submitBtn").disabled = false;
    });
}
