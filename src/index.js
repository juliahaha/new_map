import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";

let map;

async function init() {
    const sites = await import("../data/sites.json");
    const districts = await import("../data/output.json");
    const style = map.getStyle();

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);

    map.getSource("sites").setData(sites);
    map.getSource("districts").setData(districts);

    initPopup();
    initLegend();
}

function initLegend() {
    const legend = document.querySelector("#legend");
    const template = document.querySelector("#legend-entry");
    const fillColorStyle = map.getPaintProperty("districts-fill","fill-extrusion-color");

    fillColorStyle.splice(0, 2);
    let total = 0;
    
    for (let index = 0; index < fillColorStyle.length; index+=2) {
        const entry = document.importNode(template.content, true);
        const spans = entry.querySelectorAll("span")
        const color = fillColorStyle[index];
        const count = fillColorStyle[index+1];

        spans[0].style.backgroundColor = color;

        if (index === fillColorStyle.length-1) {
            spans[1].textContent = ">=" + total;
        } else {
            spans[1].textContent = total + " - " + (count - 1);
            total = count;
        }

        legend.appendChild(entry);
    }
}

const popup = document.querySelector("#popup");
let hovered; 

function initPopup() {
    const distnum = popup.querySelector(".district");
    const spacecount = popup.querySelector(".count");

    map.on("mousemove", "districts-fill", function(e) {
        clearHover();
        if (e.features.length > 0) {
            hovered = e.features[0];
            map.setFeatureState(hovered, {
                hover: true
            });
            popup.style.display = "block";
            distnum.textContent = hovered.properties.supdist;
            spacecount.textContent = hovered.properties.count;
        }
    });

    map.on ("mouseleave", "districts-fill", clearHover);
}

function clearHover() {
    if (hovered) {
        map.setFeatureState(hovered, {
            hover: false
        });
    }
    popup.style.display = "none";
    hovered = undefined;
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);
