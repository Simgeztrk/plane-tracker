import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// eslint-disable-next-line no-undef
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapComponent = ({ planes }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const planeMarkers = useRef({});
  const planeTrails = useRef({});
  const activePlaneInfo = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [29.0, 41.0],
      zoom: 5,
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;

    planes.forEach((plane) => {
      const { id, latitude, longitude, name, status, speed, altitude, heading } = plane;

      const currentCoord = [longitude, latitude];
      const lastTrail = planeTrails.current[id] || [];
      const lastCoord = lastTrail[lastTrail.length - 1];

      const jumped =
        lastCoord &&
        (Math.abs(currentCoord[0] - lastCoord[0]) > 1 ||
          Math.abs(currentCoord[1] - lastCoord[1]) > 1);

      if (!planeTrails.current[id] || jumped) {
        planeTrails.current[id] = [currentCoord];
      } else {
        planeTrails.current[id].push(currentCoord);
        if (planeTrails.current[id].length > 50) {
          planeTrails.current[id].shift();
        }
      }

      const sourceId = `trail-${id}`;
      if (map.current.getSource(sourceId)) {
        map.current.getSource(sourceId).setData({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: planeTrails.current[id],
          },
        });
      } else {
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: planeTrails.current[id],
            },
          },
        });

        map.current.addLayer({
          id: sourceId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#FFF600',
            'line-width': 1,
            'line-opacity': 0.7,
          },
        });
      }

      // 📍 Marker
      if (!planeMarkers.current[id]) {
        const el = document.createElement('div');
        el.className = 'plane-marker';
        el.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16v-2L13 9V4.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1v1l3-.5 3 .5v-1l-2-1v-5.5l8 2.5z"/>
          </svg>
        `;

        el.addEventListener('click', () => {
          // 🔄 Diğer aktif marker varsa onu pasif yap
          document.querySelectorAll('.plane-marker.active').forEach((marker) => {
            marker.classList.remove('active');
          });

          // ✅ Bu marker'ı aktif yap
          el.classList.add('active');

          const infoBox = document.getElementById('plane-info-panel');
          if (infoBox) {
            infoBox.innerHTML = `
              <h2 class="title">${name}</h2>
              <p class="data"><strong>Status:</strong> ${status}</p>
              <p class="data"><strong>Speed:</strong> ${speed} km/h</p>
              <p class="data"><strong>Heading:</strong> ${heading}</p>
              <p class="data"><strong>Altitude:</strong> ${altitude} ft</p>
              <p class="data"><strong>Latitude:</strong> [${latitude.toFixed(2)}, ${longitude.toFixed(2)}]</p>
            `;
            infoBox.style.left = '16px';
          }
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .setRotation(heading)
          .setRotationAlignment('map')
          .addTo(map.current);

        planeMarkers.current[id] = marker;
      } else {
        planeMarkers.current[id].setLngLat([longitude, latitude]).setRotation(heading);
      }
    });
  }, [planes]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      {/* 🟡 Soldaki info panel */}
      <div id="plane-info-panel" className="flight-info-box"></div>

      {/* 🟦 Harita */}
      <div ref={mapContainer} style={{ flex: 1 }} />
    </div>
  );
};

export default MapComponent;
