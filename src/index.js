import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";

let map;

async function init() {
    const sites = await import("../data/sites.json");
    const districts = await import("../data/SupDist.json");
    const style = map.getStyle();

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);

    map.getSource("sites").setData(sites);
    map.getSource("districts").setData(districts);
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);
