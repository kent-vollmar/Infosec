<?php
/**
 * 
 */
header('Content-Type: application/json');

class Country {
	public string $name = '';
	public string $alpha2Code = '';
	public string $alpha3Code = '';
	public string $flagImageBase64Encoded = '';
	public string $region = '';
	public string $subregion = '';
	public int $population = 0;
	public array $languages = [];
	
	function get_name() : string {
		return $this->name;
	}
	
	function get_alpha2Code() : string {
		return $this->alpha2code;
	}
	
	function get_alpha3Code() : string {
		return $this->alpha3code;
	}
	
	function get_flagImageBase64Encoded() : string {
		return $this->flagImageBase64Encoded;
	}
	
	function get_region() : string {
		return $this->region;
	}
	
	function get_subregion() : string {
		return $this->subregion;
	}
	
	function get_population() : int {
		return $this->population;
	}
	
	function get_languages() : array {
		return $this->languages;
	}
	
	// Fills this country object's properties with the data in the provided
	// source object
	function loadFromFullCountryData(object $fullCountryData) {
		$this->name = $fullCountryData->name;
		$this->alpha2Code = $fullCountryData->alpha2Code;
		$this->alpha3Code = $fullCountryData->alpha3Code;
		$flagUrl = $fullCountryData->flag;
		$flagData = file_get_contents($flagUrl);
		$this->flagImageBase64Encoded = base64_encode($flagData);
		$this->region = $fullCountryData->region;
		$this->subregion = $fullCountryData->subregion;
		$this->population = $fullCountryData->population;
		foreach($fullCountryData->languages as $sourceLanguage) {
			array_push($this->languages, $sourceLanguage->name);
		}
	}
}

// Retrieve country data from the source according to the host supplied 
// full country name search string
function gatherCountryDataByFullName() : string {
	$urlBase = 'https://restcountries.eu/rest/v2/name/';
	$urlParameters = '?fullText=true';
	// Search seems to ignore fullText flag if filtering by fields
	//$urlFilterParameters = '?fields=name;alpha2Code;alpha3Code;flag;region;subregion;population;languages';
	$searchString = $_REQUEST["fn"];
	$countrySourceUrl = $urlBase . $searchString . $urlParameters;
	$allJsonData = @file_get_contents($countrySourceUrl);
	return $allJsonData;
}

// Retrieve country data from the source according to the host supplied 
// partial country name search string
function gatherCountryDataByPartialName() : string {
	$urlBase = 'https://restcountries.eu/rest/v2/name/';
	$urlFilterParameters = '?fields=name;alpha2Code;alpha3Code;flag;region;subregion;population;languages';
	$searchString = $_REQUEST["pn"];
	$countrySourceUrl = $urlBase . $searchString . $urlFilterParameters;
	$allJsonData = @file_get_contents($countrySourceUrl);
	return $allJsonData;
}

// Retrieve country data from the source according to the host supplied 
// alpha code search string
function gatherCountryDataByAlphaCode() : string {
	$urlBase = 'https://restcountries.eu/rest/v2/alpha/';
	$urlFilterParameters = '?fields=name;alpha2Code;alpha3Code;flag;region;subregion;population;languages';
	$searchString = $_REQUEST["ac"];
	$countrySourceUrl = $urlBase . $searchString . $urlFilterParameters;
	$alphaCodeJsonData = @file_get_contents($countrySourceUrl);
	$allJsonData = "[" . $alphaCodeJsonData . "]";
	return $allJsonData;
}

// Extract the desired data from the source JSON to country objects
function extractCountryData(string $allJsonData) : array {
	$countries = [];

	$allData = json_decode($allJsonData, false);
	
	if( !is_null($allData) ) {
		foreach($allData as $fullCountryData) {
			$country = new Country();
			$country->loadFromFullCountryData($fullCountryData);
			array_push($countries, $country);
		}
	}
	
	return $countries;
}

// Sort the list of countries by largest to smallest population
function sortCountries(array $countries) {
	usort($countries, fn($country1, $country2) => ($country2->population - $country1->population));
	
	return $countries;
}


$success = false;
if( isset($_REQUEST["fn"]) ) {
	$allJsonData = gatherCountryDataByFullName();
	$success = true;
} else if( isset($_REQUEST["pn"]) ) {
	$allJsonData = gatherCountryDataByPartialName();
	$success = true;
} else if( isset($_REQUEST["ac"]) ) {
	$allJsonData = gatherCountryDataByAlphaCode();
	$success = true;
}

if( $success ) {
	$countries = extractCountryData($allJsonData);
	$countries = sortCountries($countries);
	$countryJsonData = json_encode($countries);
} else {
	$countryJsonData = "";
}
echo $countryJsonData;
