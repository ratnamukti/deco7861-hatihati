var geojson;
myButtons = document.getElementsByClassName("suburbButton")

myPopup = document.getElementById("popup-banner")



window.addEventListener("click", function (event) {
    if (event.target == myPopup) {
        myPopup.classList.remove("show");
        getDelete = document.getElementById('rank');
        MoreDetails = document.getElementById('detail-button');
        getDelete.remove();
        MoreDetails.remove();
    }
});

//---New popup
choosenSuburbs = ["st lucia", "Toowong", "Indooroopilly", 
                "Taringa", "Brisbane City", "Auchenflower",
                "Milton", "Petrie Terrace", "West End", "South Brisbane", 
                "Fortitude Valley", "Woolloongabba", "Highgate Hill", "Dutton Park",
                "Fairfield", "Yeronga", "Annerley"]
	
    // TODO: if the string matched, publish. otherwise, ignore

	var popup = L.popup();
	function onMapClick(e) {
		const layer = e.target;
        
        myPopup.classList.add("show");

        const xhttpr = new XMLHttpRequest();
        // API call for St.Lucia
        value = layer.feature.properties.Name;
        editTitle = document.getElementById("popup-title");
        editTitle.innerHTML = value.toUpperCase();

        // Get the image name based on the suburb name
        const imageName = `./img/suburb_img/${value.toUpperCase()}.jpg`;

        // Get the <img> element
        const popupImage = document.getElementById('popup-image');

        // Set the src attribute to the image name
        popupImage.src = imageName;



        getoffenceapi = 'https://a5c7zwf7e5.execute-api.ap-southeast-2.amazonaws.com/dev/offences?locationType=SUBURB&startDate=01-01-2022&locationName=' + value + '&endDate=12-31-2022&format=JSON'
        xhttpr.open('GET', getoffenceapi, true);
        
        xhttpr.send();
        
        let response; // Declare response as a variable
        xhttpr.onload = () => {
        
            if (xhttpr.status === 200) {
                response = JSON.parse(xhttpr.response);
                // Process the response data here
            } else {
                // Handle error
            }
            
            // Get response from API above, turn into object
            const data = response;
            const count_offences = {};
            
            // Loop through each offences, then count the number of occurrences for each offence type
            // Mark a flag if an offence type does not occur in the suburb
            for (let i = 0; i < data.length; i++) {
                if (count_offences[data[i].Type] === undefined) {
                    count_offences[data[i].Type] = 1;
                } else {
                    count_offences[data[i].Type] += 1;
                }
            }
            
            // Turn each offence type into an array object to utilize searching value by key
            const suburb_offences = [];
            for (const key in count_offences) {
                const offence_record = {};
                offence_record['name'] = key;
                offence_record['number'] = count_offences[key];
                suburb_offences.push(offence_record);
            }
            
            // --Reference: W3School Javascript Sorting Arrays on https://www.w3schools.com/js/js_array_sort.asp
            // Sort descending based on offence number
            suburb_offences.sort((a, b) => {
                return b.number - a.number;
            });
            // --End of reference
            
            // Get the top 3 offenses
            const top3Offences = suburb_offences.slice(0, 3);
            
            // Display the top offences in the HTML as an ordered list for easier ranking view
            const topOffencesContainer = document.getElementById('top-offences-container');
            const olElement = document.createElement('ol');
            const moreButton = document.createElement('button');
            const aElement = document.createElement('a');
            olElement.setAttribute('id', 'rank');
            moreButton.setAttribute('id', 'detail-button')
            aElement.setAttribute('href', 'suburbdetail.html?LocationName=' + value);
            
            //--Reference: Stackoverflow on https://stackoverflow.com/questions/26542652/how-to-add-text-into-span-after-document-createelementspan
            //--Reference: W3School HTML Lists on https://www.w3schools.com/html/html_lists.asp
            // Loop through the top 3 offences and create list items
            top3Offences.forEach((offence) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${offence.name}: ${offence.number}`;
                olElement.appendChild(listItem);
            });
            //--End of reference
                    

            // Append the ordered list to the container
            topOffencesContainer.appendChild(olElement);
            aElement.innerHTML = 'Details'
            moreButton.appendChild(aElement);
            topOffencesContainer.appendChild(moreButton);

            
                
        };
	}

    //--Reference: Interactive Choropleth Map on https://leafletjs.com/examples/choropleth/
    function highlightFeature(e) {
        var layer = e.target;
    
        layer.setStyle({
            fillColor: '#FDFF7A',
            weight: 5,
            color: '#A32E5A',
            dashArray: '',
            fillOpacity: 0.5
        });
    
        layer.bringToFront();

        popup
        .setLatLng(e.latlng)
        .setContent(layer.feature.properties.Name)
        .openOn(map);
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }
	
	function onEachFeature(feature, layer) {
		layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
			click: onMapClick
		});
	}

    // LeafletJS format
	var statesData = {"type": "FeatureCollection", "features": []}
	
	//const xhttpr = new XMLHttpRequest();
	for (var i = 0; i < choosenSuburbs.length; i++) {

		var url = 'https://a5c7zwf7e5.execute-api.ap-southeast-2.amazonaws.com/dev/locations?locationType=SUBURB&locationName=' + choosenSuburbs[i];

		let request = new XMLHttpRequest();
		request.open("GET", url);
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
				var data = JSON.parse(request.responseText);

                // const filteredState = data.filter(item => item.features[0].properties.Name === "st Lucia");
                // if (filteredState.length >0){
                //     console.log("filter: " + filteredState[0]);

                // }

                // insert polygon into the features array
				statesData.features.push(data[0].features[0])

				if (statesData.features.length == choosenSuburbs.length) {
                    // style map border color
                    function style(feature) {
                        return {
                            fillColor: '#EB4181',
                            weight: 2,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.5
                        };
                    }

					geojson = L.geoJson(statesData, {
                        onEachFeature, 
                        style
                    }).addTo(map);
				}
			}
		}
		request.send();
	}
  
	const map = L.map('map').setView([-27.487092, 152.990799], 13);

	var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
    //--End of Reference
