import fs from "fs";
import turf from "@turf/turf";
import supdist from "../data/SupDist.json";
import sites from "../data/sites.json";

sites.features.forEach(function(feature) {
    feature.properties = {
        count: 1
    };
});

supdist.features = supdist.features.filter(function(feature){
    return feature.geometry;
});

sites.features = sites.features.filter(function(feature){
    return feature.geometry;
});

let output = turf.collect(supdist, sites, "count", "count");

output = output.features.filter(function(feature, i) {
    feature.id = i;
    feature.properties.count = feature.properties.count.length;
    return feature.properties.count > 0;
});

output = JSON.stringify({
    "type": "FeatureCollection",
    "features": output
}, null, "\t");

fs.writeFile("../data/output.json", output, function(err) {
    if (err) throw err;
    console.log("success. 👍");
});


