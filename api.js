const dns = require("dns");

function getRecord(host, recordType) {
	return new Promise((resolve, reject) => {
		dns.resolve(host, recordType, (err, res) => {
			if (err || !res) {
				reject();
			}
			resolve(res);
		});
	});
}

exports.handler = async (event) => {
	let host;
	if (event.rawQueryString.split("=", 2)[0] === "domain") {
		host = event.rawQueryString.split("=")[1];
		console.log(host);
	} else {
		return {
			isBase64Encoded: false,
			statusCode: 400,
			body: '{ "message": "No domain specified" }',
			headers: {
				"Content-Type": "application/json",
			},
		};
	}
	const recordTypes = [
		"A",
		"AAAA",
		"CNAME",
		"MX",
		"NAPTR",
		"NS",
		"PTR",
		"SOA",
		"SRV",
		"TXT",
	];

	const allRecords = {};

	for (let recordType of recordTypes) {
		try {
			let result = await getRecord(host, recordType);
			console.log(result);
			allRecords[recordType] = result;
		} catch (err) {
			if (err === undefined || err === null) {
				allRecords[recordType] = null;
			}
			console.log("Error! for ", recordType, "-->", err);
		}
	}
	console.log("All Records", allRecords);
	return { results: allRecords };
};
