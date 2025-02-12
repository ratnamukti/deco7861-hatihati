myButtons = document.getElementsByClassName("suburbButton")
closePopup = document.getElementById("closePopup")
myPopup = document.getElementById("popup-banner")


const xhttpr = new XMLHttpRequest();
// API call for St.Lucia
getName = document.getElementById('suburb-name');
//editTitle.innerHTML = value
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const suburbName = urlParams.get('LocationName');
h1element = document.getElementById('suburb-name');
h1element.innerHTML = suburbName;
titleElement = document.getElementById('title-name');
titleElement.innerHTML = 'Crime Details: ' + suburbName;
getoffenceapi = 'https://a5c7zwf7e5.execute-api.ap-southeast-2.amazonaws.com/dev/offences?locationType=SUBURB&startDate=01-01-2022&locationName=' + suburbName + '&endDate=12-31-2022&format=JSON'
xhttpr.open('GET', getoffenceapi, true);
//xhttpr.open('GET', 'https://a5c7zwf7e5.execute-api.ap-southeast-2.amazonaws.com/dev/offences?locationType=SUBURB&startDate=01-01-2022&locationName=st%20lucia&endDate=12-31-2022&format=JSON', true);

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


    //--Reference: W3School Javascript Sorting Arrays on https://www.w3schools.com/js/js_array_sort.asp
    // Sort descending based on offence number
    suburb_offences.sort((a, b) => {
        return b.number - a.number;
    });
    //--End of reference

    // Get the top 3 offenses
    const topTenOffences = suburb_offences.slice(0, 10);

    // Display the top offences in the HTML as an ordered list for easier ranking view
    topTenOffences.forEach((offence, index) => {
        const iconName = `icon-${index + 1}`; // Generate class name for each icon element
    
        // Create an image element
        const imgElement = document.createElement('img');
        imgElement.src = `./img/crime_type_icon/${offence.name}.svg`; // Set the image source
        imgElement.alt = offence.name; // Set the alt attribute
        

        const iconElement = document.querySelector(`.${iconName}`);
    
        if (iconElement) {
        iconElement.innerHTML = '';
        iconElement.appendChild(imgElement);
        imgElement.style.width = '100%'; 
        imgElement.style.height = '100%'; 
        }
        
    });
   

    // Print top 10 offences in the selected suburb
    console.log(suburb_offences.slice(0, 3));
    


    // Display the offenses in the HTML
    const offencesContainer = document.getElementById('offences-container');
    const olElement = document.createElement('ol');
    olElement.setAttribute('id', 'numbered');



    
    //--Reference: Stackoverflow on https://stackoverflow.com/questions/26542652/how-to-add-text-into-span-after-document-createelementspan
    // create new div element containing offence name & number
    for (const offence of topTenOffences) {
        const offenceElement = document.createElement('li');
        offenceElement.setAttribute('class', 'crime-card-item');
        offenceElement.textContent = `${offence.name}`;


        const targetElement = document.getElementById('class-name');
       
        
        // give value attribute to each offence
        offenceElement.setAttribute('value', offence.name)
		offenceElement.setAttribute('number', offence.number)
        olElement.appendChild(offenceElement);
        offenceElement.onclick = function(e){
            //debugger;
            selectedOffence = e.target.attributes.value.value;
			offenceNumber = e.target.attributes.number.value;

            myPopup.classList.add("show");
            const xhttpr = new XMLHttpRequest();
            // API call for St.Lucia
            value = suburbName;
            editTitle = document.getElementById("popup-title");
            editTitle.innerHTML = selectedOffence.toUpperCase();
			
			editNumber = document.getElementById("popup-subtitle");
            editNumber.innerHTML = "Total occurence in 2022: " + offenceNumber;

            // september
            getoffenceapi = 'https://a5c7zwf7e5.execute-api.ap-southeast-2.amazonaws.com/dev/offences?locationType=SUBURB&startDate=09-01-2022&locationName=' + value + '&endDate=09-30-2022&format=JSON'
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
                    if (key != selectedOffence){
                        continue;
                    }

                    const offence_record = {};
                    offence_record['name'] = key;
                    offence_record['number'] = count_offences[key];
                    suburb_offences.push(offence_record);
                }
                // oktober
                const xhttpr2 = new XMLHttpRequest();
                getoffenceapi2 = 'https://a5c7zwf7e5.execute-api.ap-southeast-2.amazonaws.com/dev/offences?locationType=SUBURB&startDate=10-01-2022&locationName=' + value + '&endDate=10-31-2022&format=JSON'
                xhttpr2.open('GET', getoffenceapi2, true);

                xhttpr2.send();

                let response2; // Declare response as a variable
                xhttpr2.onload = () => {

                    if (xhttpr2.status === 200) {
                        response2 = JSON.parse(xhttpr2.response);
                        // Process the response data here
                    } else {
                        // Handle error
                    }
                    
                    // Get response from API above, turn into object
                    const data2 = response2;
                    const count_offences2 = {};
                    
                    // Loop through each offences, then count the number of occurrences for each offence type
                    // Mark a flag if an offence type does not occur in the suburb
                    for (let i = 0; i < data2.length; i++) {
                        if (count_offences2[data2[i].Type] === undefined) {
                            count_offences2[data2[i].Type] = 1;
                        } else {
                            count_offences2[data2[i].Type] += 1;
                        }
                    }
                    
                    // Turn each offence type into an array object to utilize searching value by key
                    const suburb_offences2 = [];
                    for (const key in count_offences2) {
                        if (key != selectedOffence){
                            continue;
                        }

                        const offence_record2 = {};
                        offence_record2['name'] = key;
                        offence_record2['number'] = count_offences2[key];
                        suburb_offences2.push(offence_record2);
                    }

                    // Display the top offences in the HTML as an ordered list for easier ranking view
                    const topOffencesContainer = document.getElementById('top-offences-container');
                    //const olElement = document.createElement('tr');
                    const tableElement = document.createElement('table')
                    const trElement = document.createElement('tr');
                    const thElement = document.createElement('th');
                    const thElement2 = document.createElement('th');

                    tableElement.setAttribute('id', 'month-data')
                    thElement.textContent = 'Last Month';
                    thElement2.textContent = 'This Month';
                    trElement.setAttribute('id', 'rank');

                    trElement.appendChild(thElement)
                    trElement.appendChild(thElement2)
                    
                    const trElement2 = document.createElement('tr');
                    trElement2.setAttribute('id', 'rank2');
                    
                    //--Reference: Stackoverflow on https://stackoverflow.com/questions/26542652/how-to-add-text-into-span-after-document-createelementspan
                    //--Reference: W3School HTML Lists on https://www.w3schools.com/html/html_lists.asp
                    // Loop through the top 3 offences and create list items
                    
                    if (suburb_offences.length == 0) {
                        const listItem = document.createElement('td');
                        listItem.textContent = '0';
                        trElement2.appendChild(listItem);
                    } else {
                        suburb_offences.forEach((offence) => {
                            const listItem = document.createElement('td');
                            listItem.textContent = `${offence.number}`;
                            trElement2.appendChild(listItem);
                        });
                    }
                    
                    if (suburb_offences2.length == 0) {
                        const listItem = document.createElement('td');
                        listItem.textContent = '0';
                        trElement2.appendChild(listItem);
                    } else {
                        suburb_offences2.forEach((offence) => {
                            const listItem = document.createElement('td');
                            listItem.textContent = `${offence.number}`;
                            trElement2.appendChild(listItem);
                        });
                    
                    }
                    //--End of reference
                            
                    tableElement.appendChild(trElement);
                    tableElement.appendChild(trElement2);

                    topOffencesContainer.appendChild(tableElement);
                   
                }                
            };
        }
    }
    //--End of reference

    offencesContainer.appendChild(olElement);

    // Get all crime-name elements
    const crimeNameElements = document.querySelectorAll('.crime-name');
    const listItems = olElement.querySelectorAll('li');

    for (let i = 0; i < listItems.length && i < crimeNameElements.length; i++) {
        crimeNameElements[i].appendChild(listItems[i]);
    }
    if (olElement.children.length === 0) {
        olElement.parentNode.removeChild(olElement);
    }
  
};
// querySelector vs. getElementById on https://stackoverflow.com/questions/26848289/queryselector-vs-getelementbyid
// Call the function to set the image click event
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener("click", function(event) {
        // Check if the clicked element is a crime type logo
        let isTargetedElement = false;
        for (let i = 1; i <= 10; i++) {
            if (event.target.classList.contains(`crime-type-logo-placer-${i}`) || event.target.closest(`.crime-type-logo-placer-${i}`)) {
                isTargetedElement = true;
                break;
            }
        }
        if (isTargetedElement) {
            let crimeNameElement;

            // Check if the clicked element is a crime type logo
            let parentPlacer = event.target.closest('[class^="crime-type-logo-placer-"]');
            if (parentPlacer) {
                crimeNameElement = parentPlacer.querySelector('.crime-card-item');
            }

            if (crimeNameElement) {
                // Get the crime name
                crimeNameElement.click();
 }
        }
    });
    
});

function setupCrimeCardClickHandler() {
    const body = document.body;
    const popup = document.getElementById('popup-banner');
    const closeBtn = document.getElementById('closePopup');

    // Add event listener to the body
    body.addEventListener('click', function(event) {
        // Check if the clicked element is a crime type logo
        if (event.target.classList.contains('crime-card-item')) {
            // Get the crime name
            const value = event.target.getAttribute('value');
            if (!value) return;  
    
            const imagePath = `./img/crime_type_icon/${value}.svg`;
    
            const imgContainer = document.getElementById('popImage');

            // Create an image element if not exist
            if (!imgContainer.querySelector('img')) {
                const imgElem = document.createElement('img');
                imgContainer.appendChild(imgElem);
            }
            const imgElem = imgContainer.querySelector('img');
            imgElem.src = imagePath;
    
        }
    });
}
document.addEventListener("DOMContentLoaded", setupCrimeCardClickHandler);



// remove crime list upon closing popup
closePopup.addEventListener("click", function () {
    myPopup.classList.remove("show");
    getDelete = document.getElementById('rank');
    getDelete2 = document.getElementById('rank2');
    getDeleteTable = document.getElementById('month-data');
    getDelete.remove();
    getDelete2.remove();
    getDeleteTable.remove();
});

window.addEventListener("click", function (event) {
    if (event.target == myPopup) {
        myPopup.classList.remove("show");
        getDelete = document.getElementById('rank');
        getDelete.remove();
        getDelete2 = document.getElementById('rank2');
        getDelete2.remove();
        getDeleteTable = document.getElementById('month-data');
        getDeleteTable.remove();
    }
});

