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
}

function resolve() {
  document.getElementById("results").style.display = "none";
  clearTable();
  const hostname = document.getElementById("hostname").value;
  if (!hostname || !hostname.length) {
    return;
  }
  axios
    .get("https://dns-resolver.omkarshelar.dev/dns-resolver?domain=" + hostname)
    .then((response) => {
      results = response.data.results;
      for (let recordType in results) {
        let row = addTR(recordType, results[recordType]);
        document.getElementById("tableBody").innerHTML += row;
      }
      document.getElementById("results").style.display = "block";
    });
}
