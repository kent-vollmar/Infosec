var urlBase = "http://localhost:8081/phptest/webroot/api/index.php";

function searchByFullName() {
	var searchValue = document.getElementById("fullname").value;
	if( searchValue !== "" ) {
		var searchCode = "fn";
		loadCountryData(searchCode, searchValue);
	} else {
		noInputData("Please enter a country name.");
	}
}

function searchByPartialName() {
	var searchValue = document.getElementById("partialname").value;
	if( searchValue !== "" ) {
		var searchCode = "pn";
		loadCountryData(searchCode, searchValue);
	} else {
		noInputData("Please enter a partial country name.");
	}
}

function searchByAlphaCode() {
	var searchValue = document.getElementById("alphacode").value;
	if( searchValue !== "" ) {
		var searchCode = "ac";
		loadCountryData(searchCode, searchValue);
	} else {
		noInputData("Please enter a country alpha code.");
	}
}

function noInputData(message) {
	document.getElementById("countrytable").innerHTML = message;
	document.getElementById("statisticsTable").innerHTML = "";
}

function loadCountryData(searchCode, searchValue) {
	var url = urlBase + "?" + searchCode + "=" + searchValue;
	
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var countries = JSON.parse(this.responseText);
			displayCountryDataTable(countries);
			displayCountryStatistics(countries);
		}
	};
	xmlHttp.open("GET", url, true);
	xmlHttp.send();
}


function displayCountryDataTable(countries) {
	if( countries == "" ) {
		document.getElementById("countrytable").innerHTML = "No matches were found.";
	}
	else {
		var countryTable = "<table><tr>";
		countryTable += "<td style='width: 100px;                   '>Name</td>";
		countryTable += "<td style='width: 100px;                   '>Alpha Code 2</td>";
		countryTable += "<td style='width: 100px;                   '>Alpha Code 3</td>";
		countryTable += "<td style='width: 100px;                   '>Flag</td>";
		countryTable += "<td style='width: 100px;                   '>Region</td>";
		countryTable += "<td style='width: 100px;                   '>Subregion</td>";
		countryTable += "<td style='width: 100px; text-align: right;'>Population</td>";
		countryTable += "<td style='width: 100px;                   '>Languages</td></tr>";

		countryTable += "<tr>";
		countryTable += "<td style='width: 100px;                   '>---------------</td>";
		countryTable += "<td style='width: 100px;                   '>---------------</td>";
		countryTable += "<td style='width: 100px;                   '>---------------</td>";
		countryTable += "<td style='width: 100px;                   '>---------------</td>";
		countryTable += "<td style='width: 100px;                   '>---------------</td>";
		countryTable += "<td style='width: 100px;                   '>---------------</td>";
		countryTable += "<td style='width: 100px; text-align: right;'>---------------</td>";
		countryTable += "<td style='width: 100px;                   '>---------------</td></tr>";

		var country = null;
		var languages = "";
		for( countryIndex = 0; countryIndex < countries.length; countryIndex++ ) {
			country = countries[countryIndex];
			countryTable += "<tr><td style='width: 100px;'>" + country.name + "</td>";
			countryTable += "<td style='width: 100px;'>" + country.alpha2Code + "</td>";
			countryTable += "<td style='width: 100px;'>" + country.alpha3Code + "</td>";
			countryTable += "<td style='width: 100px;'><img src=\"data:image/svg+xml;base64," + country.flagImageBase64Encoded + "\" height=\"80\" width=\"80\"></td>";
			countryTable += "<td style='width: 100px;'>" + country.region + "</td>";
			countryTable += "<td style='width: 100px;'>" + country.subregion + "</td>";
			countryTable += "<td style='width: 100px; text-align: right;'>" + country.population + "</td>";
			
			languages = "";
			for( languageIndex = 0; languageIndex < country.languages.length - 1; languageIndex++ ) {
				languages += country.languages[languageIndex] + ", ";
			}
			languages += country.languages[country.languages.length - 1];
			
			countryTable += "<td style='width: 100px;'>" + languages + "</td></tr>";
		}

		countryTable += "</table>";
		
		document.getElementById("countrytable").innerHTML = countryTable;
	}
}

function displayCountryStatistics(countries) {
	var countryCount = countries.length;
	var regionList = [];
	var subregionList = [];
	
	countries.forEach(country => {
		if( country.region in regionList ) {
			regionList[country.region] += 1;
		} else {
			regionList[country.region] = 1;
		}
		if( country.subregion in subregionList ) {
			subregionList[country.subregion] += 1;
		} else {
			subregionList[country.subregion] = 1;
		}
	});

	var orderedRegionList = [];
	Object.keys(regionList).sort().forEach(function(key) {
		orderedRegionList[key] = regionList[key];
	});
	var orderedSubregionList = [];
	Object.keys(subregionList).sort().forEach(function(key) {
		orderedSubregionList[key] = subregionList[key];
	});
	
	var statisticsTable = "<h2>Search Summary</h2><table>";
	statisticsTable += "<tr><td style='width: 40px;'>Number of countries: </td>";
	statisticsTable += "<td style='width: 150px;'>" + countryCount + "</td>";
	statisticsTable += "<td style='width: 20px;'></td></tr>";

	statisticsTable += "<tr><td style='width: 40px;'>Regions: </td>";
	statisticsTable += "<td style='width: 150px;'></td>";
	statisticsTable += "<td style='width: 20px;'></td></tr>";
	for( var property in orderedRegionList) {
		statisticsTable += "<tr><td style='width: 40px;'></td>";
		statisticsTable += "<td style='width: 150px;'>" + property + "</td>";
		statisticsTable += "<td style='width: 20px;'>" + orderedRegionList[property] + "</td></tr>";
	}

	statisticsTable += "<tr><td style='width: 40px;'>Subregions: </td>";
	statisticsTable += "<td style='width: 150px;'></td>";
	statisticsTable += "<td style='width: 20px;'></td></tr>";
	for( var property in orderedSubregionList) {
		statisticsTable += "<tr><td style='width: 40px;'></td>";
		statisticsTable += "<td style='width: 150px;'>" + property + "</td>";
		statisticsTable += "<td style='width: 20px;'>" + orderedSubregionList[property] + "</td></tr>";
	}

	statisticsTable += "</table>";
	
	document.getElementById("statisticsTable").innerHTML = statisticsTable;
}
