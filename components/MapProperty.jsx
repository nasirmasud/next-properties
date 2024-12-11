"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect } from "react";

const MapProperty = () => {
  let map = null;

  const initializeMap = (container) => {
    if (!container || map) return;

    map = new maplibregl.Map({
      container,
      // style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      // style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [90.4125, 23.8103], // Dhaka coordinates
      zoom: 6,
    });
  };

  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, []);

  return (
    <div
      ref={initializeMap}
      style={{
        width: "100%",
        height: "500px",
        border: "1px solid #ddd",
      }}
    ></div>
  );
};

export default MapProperty;
