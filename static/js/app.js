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