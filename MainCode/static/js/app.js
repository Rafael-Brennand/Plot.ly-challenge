// Connect dataset 
let dataset = "/data/samples.json";

//Read samples
d3.json(dataset).then(function(data){
    console.log(`dataset: ${dataset}`,data);
});

//Build sample demographic
function sampleDemographicInfo(subjectID){
    subjectID = parseInt(subjectID);

    let demoInfo = d3.select("#sample-metadata");

    demoInfo.html("");

    d3.json(dataset).then(data => {
        let metadata = data.metadata;

        let filterMetadata = metadata[metadata.findIndex(element => element.id === subjectID)];

        Object.entries(filterMetadata).forEach(([key,value]) => {
            demoInfo.append("p")
                .text(`${key}: ${value}`);
        }); 
    }); 
}; 

//Build Sample charts using given variables in ReadMe
function sampleCharts(subjectID){
    d3.json(dataset).then(data => {
        let samples = data.samples;
        let filterSamples = samples[samples.findIndex(element => element.id === subjectID)];
        let otuIDs = filterSamples.otu_ids;
        let otuLabels = filterSamples.otu_labels;
        let sampleValues = filterSamples.sample_values; 


    // Create horizontal bar chart using the top 10 OTUs
        let bar_xData = sampleValues.slice(0,10).reverse();
        let bar_yData = otuIDs.slice(0,10).reverse();
        let bar_textData = otuLabels.slice(0,10).reverse();

        //Trace
        let barData = [{
            type:"bar",
            orientation:"h",
            x: bar_xData,
            y: bar_yData
                .map(id => `OTU ${id}`),
            text: bar_textData            
        }];
        //Make the layout
        let barLayout = {
            title: "<b>Top 10 OTUs</b>",
            xaxis: {title: "Sample Values"}
        };

        Plotly.newPlot("bar",barData,barLayout);


    //Create bubble chart
        //Trace
        let bubbleData = [{
            mode: "markers",
            x: otuIDs,
            y: sampleValues,
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: "Earth" //https://plotly.com/javascript/colorscales/
            },
            text: otuLabels
        }];
        //Make the layout
        let bubbleLayout = {
            title: "<b>All OTUs</b>",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble",bubbleData,bubbleLayout);

    });
}; 

//Initialize Page
function init() {
    //Dropdown selector
    let subjectIDDropdown = d3.select("#selDataset")

    d3.json(dataset).then(data => {
        subjectName = data.names;
        subjectName.forEach(name => {
            subjectIDDropdown.append("option")
                .text(name)
                .property("value",name);
        }); 

        let initialSubjectID = subjectName[0];



        sampleDemographicInfo(initialSubjectID);
        sampleCharts(initialSubjectID);
    });
};  


function optionChanged(newSubjectID){
    sampleDemographicInfo(newSubjectID);
    sampleCharts(newSubjectID);
};  

//Call initialization function to run page
init();