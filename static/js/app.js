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
    var table = metadata.append("table").classed("table table-striped", true);
    Object.entries(filteredMetaData).forEach(([key, value]) => {
        var row = table.append("tr");
        var initCapKey = key[0].toUpperCase() + key.substr(1).toLowerCase();
        var keyCell = row.append("th").text(`${initCapKey}`);
        var valueCell = row.append("td").text(`${value}`).style("word-break", "break-word");
    });
}

// Function to render the bar chart for the user selected ID
function loadHBar(value, filteredSampleData) {

    // Slice the first 10 objects for plotting
    slicedSampleValues = filteredSampleData.sample_values.slice(0, 10);
    slicedOtuIds = filteredSampleData.otu_ids.slice(0, 10);
    slicedOtuLabels = filteredSampleData.otu_labels.slice(0, 10);

    // Reverse the array to accommodate Plotly's defaults
    reversedSampleValues = slicedSampleValues.reverse();
    reversedOtuIds = slicedOtuIds.reverse();
    reversedOtuIds = reversedOtuIds.map(id => `OTU ${id}`);
    reversedOtuLabels = slicedOtuLabels.reverse();

    // Trace for the OTU Data
    var traceHBar = {
        x: reversedSampleValues,
        y: reversedOtuIds,
        text: reversedOtuLabels,
        type: 'bar',
        orientation: 'h'
    };

    // Data
    var dataHBar = [traceHBar];

    // Layout for creating bar chart
    var layoutHBar = {
        showlegend: false,
        margin: {
            t: 70,
            b: 40
        },
        xaxis: {
            title: 'Number of Samples',
        },
        yaxis: {
            title: 'OTU IDs',
        },
        title: `Top 10 OTUs for Test Subject ID - ${value}`,
    };

    // Render the bar plot to the div tag with id "bar"
    Plotly.newPlot('bar', dataHBar, layoutHBar);
}

// Function to render the Bubble chart for the user selected ID
function loadBubble(value, filteredSampleData) {

    // Retrieve sample values, otu ids and otu labels for the user selected ID
    sampleValues = filteredSampleData.sample_values;
    otuIds = filteredSampleData.otu_ids;
    otuLabels = filteredSampleData.otu_labels;

    // Create an array to hold opacity for every bubble
    opacity = otuIds.map(id => 0.75);

    // Trace for creating bubble chart
    var traceBubble = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            color: otuIds,
            colorscale: 'Earth',
            opacity: opacity,
            size: sampleValues
        }
    };

    // Data for creating bubble chart
    var dataBubble = [traceBubble];

    // Layout for creating bubble chart
    var layoutBubble = {
        showlegend: false,
        xaxis: {
            title: 'OTU ID',
        },
        yaxis: {
            title: 'Number of Samples',
        },
        title: `All OTUs for Test Subject ID - ${value} `
    };

    // Render the bubble chart to the div tag with id "bubble"
    Plotly.newPlot('bubble', dataBubble, layoutBubble);
}

// Function to calc gauge needle points
function gaugePointer(value) {

    var degrees = 180 - value;
    var radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: to create a triangle
    var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    return path;
}

// Function to render the Gauge chart for the user selected ID
function loadGauge(value, washFreq) {

    // Update the Title for the chart with the user selected ID
    var guageTitle = d3.select('#gauge-heading-1');
    guageTitle.html(`<strong>Wash Frequency for Test Subject ID ${value}</strong>`)

    // Convert the washFreq to a value between 0 and 180
    var level = washFreq * 180 / 9;

    // Create needle head
    var traceNeedleHead = {
        type: 'scatter',
        x: [0],
        y: [0],
        marker: { size: 18, color: '850000' },
        showlegend: false,
        name: 'speed',
        text: washFreq,
        hoverinfo: 'text+name'
    }

    // Create the guage
    var traceGauge = {
        type: 'pie',
        hole: .5,
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ' '],
        rotation: 90,
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: [
                '#7FB485',
                '#84BB8A',
                '#86BF7F',
                '#B6CC8A',
                '#D4E494',
                '#E4E8AF',
                '#E8E6C8',
                '#F3F0E4',
                '#F7F2EB',
                '#FFFFFF',
            ]
        },
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ' '],
        hoverinfo: 'label',
        showlegend: false
    }

    var dataGauge = [traceNeedleHead, traceGauge];

    var layoutGauge = {
        // Create needle
        shapes: [{
            type: 'path',
            path: gaugePointer(level),
            fillcolor: '850000',
            line: {
                color: '850000'
            }
        }],
        autosize: true,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
        margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 0
        }
    };

    // Render the gauge chart to the div tag with id "gauge"
    Plotly.newPlot('gauge', dataGauge, layoutGauge);
}

// Function to handle the ID dropdown change event
function optionChanged(value) {

    // Filter the metadatas based on the user selected ID
    var filteredMetaData = metadatas.filter(metadata => parseInt(metadata.id) === parseInt(value))[0];

    // Filter the samples based on the user selected ID
    var filteredSampleData = samples.filter(sample => parseInt(sample.id) === parseInt(value))[0];

    // Retrieve wash frequency for the user selected ID
    var washFreq = metadatas.filter(metadata => parseInt(metadata.id) === parseInt(value))[0].wfreq;

    // Render the Demographic Info for the user selected ID
    loadMetaData(value, filteredMetaData);

    // Render the Bar chart for the user selected ID
    loadHBar(value, filteredSampleData);

    // Render the Bubble chart for the user selected ID
    loadBubble(value, filteredSampleData);

    // Render the Gauge chart for the user selected ID
    loadGauge(value, washFreq);
}

// Function to load ID dropdown and render data/charts on page load
function onPageLoad() {
    // Read the data from JSON file
    d3.json('static/data/samples.json').then(function(data) {

        // retrieve required info from json
        ids = data.names;
        metadatas = data.metadata;
        samples = data.samples;

        // populate the dropdown element with IDs
        populateIDDropdown();

        // render the demographic info and charts for 
        // the first ID in the dropdown
        var selDataset = d3.select('#selDataset');
        optionChanged(selDataset.property('value'));
    });
}

/***************************************************
LOAD DROPDOWN AND RENDER DATA/CHARTS - ON PAGE LOAD
****************************************************/

onPageLoad();