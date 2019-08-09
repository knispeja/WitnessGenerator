function stringToBoolean(str, default_value) {
    if (str == undefined || str == null) {
        return default_value;
    }

    var normalized = str.toLowerCase().trim();
    if (normalized == 'true' || normalized == '1') {
        return true;
    }
    else if (normalized == 'false' || normalized == '0') {
        return false;
    }
    return default_value;
}

// Await this method to sleep
function sleep(time_ms) {
	return new Promise((resolve) => setTimeout(resolve, time_ms));
}

// Gets JSON object from given URL (or current URL by default)
// The properties of the object will be the parameters on the URL
function getJsonFromUrl(url) {
	if (!url) {
		url = location.search;
	}
	var query = url.substr(1);
	var result = {};
	query.split("&").forEach(function(part) {
		var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}

// Adds a URL parameter to the current URL without reloading the page
function addUrlParameter(key, value) {
    var temp_url_params = location.search;
    if (temp_url_params.length > 0) {
        temp_url_params += "&";
    }
    else {
        temp_url_params += "?";
    }

    var encoded_value = encodeURIComponent(value);
	temp_url_params += `${key}=${encoded_value}`;
	
	url_params[key] = encoded_value;
    history.pushState(null, null, window.location.pathname + temp_url_params);
}
