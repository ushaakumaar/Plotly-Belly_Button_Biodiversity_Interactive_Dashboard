// variables to hold data from JSON file
var ids = [];
var metadatas = [];
var samples = [];

/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// Function to populate the ID Dropdown html element
function populateIDDropdown() {

    // Retrieve the ID Dropdown html element
    var selDataset = d3.select('#selDataset');

    // Populate the dropdown element with IDs
    ids.forEach(id => {
        var cell = selDataset.append('option');
        cell.property('value', id).text(id);
    });

}

// Function to render the Demographic Info for the user selected ID
function loadMetaData(value, filteredMetaData) {

    // Retrieve the Div tag to display the demographic info 
    var metadata = d3.select('#sample-metadata');

    // Clear the contents of the Div Tag
    metadata.html('');

    // Render the Demographic Info
    // var table = metadata.append("table").classed("table", true);
    var table = metadata.append("table");
    Object.entries(filteredMetaData).forEach(([key, value]) => {
        var row = table.append("tr");
        var initCapKey = key[0].toUpperCase() + key.substr(1).toLowerCase();
        var keyCell = row.append("th").text(`${initCapKey}`);
        var valueCell = row.append("td").text(`${value}`).style("padding", "1");
    });
}