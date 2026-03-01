import { useEffect, useRef } from 'react';
import { gridLayers } from '../data/mock-grid-data';
import { Hotspot, ZoneData } from '../types/map-types';
import { IngestedGeoJsonLayer } from './GeoJSONIngestion';

interface RiskMapProps {
  zones: ZoneData[];
  hotspots: Hotspot[];
  selectedZone: string | null;
  onZoneClick: (zoneId: string) => void;
  activeLayers: string[];
  center: [number, number];
  basemap?: 'streets' | 'satellite';
  geoJsonLayers?: IngestedGeoJsonLayer[];
}

export function RiskMap({ zones, hotspots, selectedZone, onZoneClick, activeLayers, center, basemap = 'streets', geoJsonLayers = [] }: RiskMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<Map<string, any>>(new Map());
  const hotspotLayersRef = useRef<any[]>([]);
  const gridLayersMapRef = useRef<Map<string, any[]>>(new Map());
  const basemapLayerRef = useRef<any>(null);
  const geoJsonLayersRef = useRef<Map<string, any>>(new Map());

  const getRiskColor = (zone: ZoneData, layerId: string) => {
    if (layerId === 'risk') {
      switch (zone.riskLevel) {
        case 'high': return '#ef4444';
        case 'medium': return '#f59e0b';
        case 'low': return '#22c55e';
        default: return '#94a3b8';
      }
    } else if (layerId === 'temperature') {
      const temp = zone.metrics.temperature;
      if (temp > 32) return '#ef4444';
      if (temp > 28) return '#f59e0b';
      return '#22c55e';
    } else if (layerId === 'population') {
      const pop = zone.metrics.population;
      if (pop > 50000) return '#ef4444';
      if (pop > 25000) return '#f59e0b';
      return '#22c55e';
    } else if (layerId === 'cases') {
      const cases = zone.metrics.recentCases;
      if (cases > 50) return '#ef4444';
      if (cases > 20) return '#f59e0b';
      return '#22c55e';
    } else if (layerId === 'traps') {
      const traps = zone.metrics.trapCount;
      if (traps < 3) return '#ef4444';
      if (traps < 6) return '#f59e0b';
      return '#22c55e';
    }
    return '#94a3b8';
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      const loadLeaflet = async () => {
        const L = (await import('leaflet')).default;

        const map = L.map(mapRef.current!, {
          center: center,
          zoom: 12,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        const basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        basemapLayerRef.current = L.tileLayer(basemapUrl, {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        zones.forEach((zone) => {
          const coordinates = zone.coordinates.map((coord) =>
            Array.isArray(coord) ? [coord[1], coord[0]] : [(coord as any).lng, (coord as any).lat]
          );

          const geoJsonFeature = {
            type: 'Feature',
            properties: { zoneId: zone.id, zoneName: zone.name },
            geometry: { type: 'Polygon', coordinates: [coordinates] },
          };

          const color = getRiskColor(zone, 'risk');
          const isSelected = selectedZone === zone.id;

          const layer = L.geoJSON(geoJsonFeature as any, {
            style: {
              fillColor: color,
              fillOpacity: 0,
              color: color,
              weight: isSelected ? 5 : 3,
            },
            onEachFeature: (_feature, layer) => {
              layer.on({
                click: () => { onZoneClick(zone.id); },
                mouseover: (e) => {
                  const l = e.target;
                  if (selectedZone !== zone.id) l.setStyle({ weight: 4 });
                },
                mouseout: (e) => {
                  const l = e.target;
                  if (selectedZone !== zone.id) l.setStyle({ weight: 3 });
                },
              });

              const layerCenter = (layer as any).getBounds().getCenter();
              L.marker(layerCenter, {
                icon: L.divIcon({
                  className: 'zone-label',
                  html: `<div style="font-size:14px;font-weight:bold;color:#1e293b;text-shadow:1px 1px 2px white,-1px -1px 2px white,1px -1px 2px white,-1px 1px 2px white;pointer-events:none;white-space:nowrap;">${zone.name}</div>`,
                  iconSize: [100, 20],
                }),
              }).addTo(map);
            },
          }).addTo(map);

          layersRef.current.set(zone.id, layer);
        });

        hotspots.forEach((hotspot) => {
          const getHotspotColor = (level: string) => {
            switch (level) {
              case 'high': return '#dc2626';
              case 'medium': return '#ea580c';
              case 'low': return '#16a34a';
              default: return '#6b7280';
            }
          };

          const color = getHotspotColor(hotspot.riskLevel);
          const radiusInMeters = Math.sqrt(hotspot.area / Math.PI);

          const circle = L.circle([hotspot.center[0], hotspot.center[1]], {
            color: color,
            fillColor: color,
            fillOpacity: 0.6,
            radius: radiusInMeters,
            weight: 2,
          }).addTo(map);

          circle.bindPopup(`
            <div style="font-family:system-ui,-apple-system,sans-serif;">
              <h3 style="margin:0 0 8px 0;font-weight:bold;font-size:14px;">${hotspot.name}</h3>
              <div style="font-size:12px;color:#374151;">
                <div><strong>Area:</strong> ${hotspot.area} m²</div>
                <div><strong>Cases:</strong> ${hotspot.cases}</div>
                <div><strong>Risk:</strong> ${hotspot.riskLevel.toUpperCase()}</div>
                <div><strong>Updated:</strong> ${hotspot.lastUpdated}</div>
              </div>
            </div>
          `);

          if (hotspot.area >= 100) {
            L.marker([hotspot.center[0], hotspot.center[1]], {
              icon: L.divIcon({
                className: 'hotspot-label',
                html: `<div style="font-size:11px;font-weight:600;color:white;background-color:${color};padding:2px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.3);">${hotspot.area}m² - ${hotspot.cases} cases</div>`,
                iconSize: [80, 20],
              }),
            }).addTo(map);
          }

          hotspotLayersRef.current.push(circle);
        });
      };

      loadLeaflet();

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      zones.forEach((zone) => {
        const layer = layersRef.current.get(zone.id);
        if (layer) {
          const color = getRiskColor(zone, 'risk');
          const isSelected = selectedZone === zone.id;
          layer.setStyle({
            fillColor: color,
            fillOpacity: 0,
            color: color,
            weight: isSelected ? 5 : 3,
          });
        }
      });
    }
  }, [activeLayers, selectedZone, zones]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      const loadLeaflet = async () => {
        const L = (await import('leaflet')).default;

        gridLayersMapRef.current.forEach((rectangles) => {
          rectangles.forEach((rect: any) => {
            mapInstanceRef.current.removeLayer(rect);
          });
        });
        gridLayersMapRef.current.clear();

        const activeGridLayerIds = activeLayers.filter(layerId =>
          gridLayers.some(gl => gl.id === layerId)
        );

        if (activeGridLayerIds.length > 0) {
          layersRef.current.forEach((layer, zoneId) => {
            const zone = zones.find(z => z.id === zoneId);
            if (zone) {
              const isSelected = selectedZone === zoneId;
              const color = getRiskColor(zone, 'risk');
              layer.setStyle({ fillOpacity: 0, color, weight: isSelected ? 5 : 3, opacity: 1 });
            }
          });

          activeGridLayerIds.forEach(layerId => {
            const gridLayer = gridLayers.find(gl => gl.id === layerId);
            if (gridLayer) {
              const rectangles: any[] = [];
              gridLayer.data.forEach((cell) => {
                const rectangle = L.rectangle(cell.bounds, {
                  fillColor: gridLayer.colorScale(cell.value),
                  fillOpacity: 0.25,
                  color: '#ffffff',
                  weight: 0.5,
                  opacity: 0.15,
                }).addTo(mapInstanceRef.current);

                rectangle.bindTooltip(`
                  <div style="font-size:11px;">
                    <strong>${gridLayer.name}</strong><br/>
                    Value: ${cell.label}
                  </div>
                `, { sticky: true });

                rectangles.push(rectangle);
              });
              gridLayersMapRef.current.set(layerId, rectangles);
            }
          });
        } else {
          const zoneLayerId = activeLayers.find(id =>
            ['risk', 'temperature', 'population', 'cases', 'traps'].includes(id)
          );

          layersRef.current.forEach((layer, zoneId) => {
            const zone = zones.find(z => z.id === zoneId);
            if (zone) {
              const isSelected = selectedZone === zoneId;
              const color = zoneLayerId ? getRiskColor(zone, zoneLayerId) : getRiskColor(zone, 'risk');
              layer.setStyle({
                fillColor: color,
                fillOpacity: 0,
                color: color,
                weight: isSelected ? 5 : 3,
                opacity: 1,
              });
            }
          });
        }
      };

      loadLeaflet();
    }
  }, [activeLayers, zones, selectedZone]);

  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, 16, { animate: true, duration: 1 });
    }
  }, [center]);

  // Render ingested GeoJSON layers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default;
      // Remove old layers that are no longer in the list
      const currentIds = new Set(geoJsonLayers.map(l => l.id));
      geoJsonLayersRef.current.forEach((layer, id) => {
        if (!currentIds.has(id)) {
          mapInstanceRef.current.removeLayer(layer);
          geoJsonLayersRef.current.delete(id);
        }
      });
      // Add new layers
      geoJsonLayers.forEach(gl => {
        if (!geoJsonLayersRef.current.has(gl.id)) {
          try {
            const layer = L.geoJSON(gl.geojson, {
              style: {
                color: gl.color,
                fillColor: gl.color,
                fillOpacity: 0.2,
                weight: 2,
                opacity: 0.8,
              },
              pointToLayer: (_feature, latlng) => {
                return L.circleMarker(latlng, {
                  radius: 8,
                  fillColor: gl.color,
                  color: gl.color,
                  weight: 1,
                  opacity: 0.9,
                  fillOpacity: 0.7,
                });
              },
              onEachFeature: (feature, layer) => {
                if (feature.properties) {
                  const props = Object.entries(feature.properties)
                    .filter(([, v]) => v !== null)
                    .map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`)
                    .join('');
                  if (props) layer.bindPopup(`<div style="font-size:12px;">${props}</div>`);
                }
              },
            }).addTo(mapInstanceRef.current);
            geoJsonLayersRef.current.set(gl.id, layer);
          } catch (e) {
            console.error('Failed to render GeoJSON layer:', gl.name, e);
          }
        }
      });
    };
    loadLeaflet();
  }, [geoJsonLayers]);

  useEffect(() => {
    if (mapInstanceRef.current && basemapLayerRef.current) {
      const loadLeaflet = async () => {
        const L = (await import('leaflet')).default;
        mapInstanceRef.current.removeLayer(basemapLayerRef.current);

        let basemapUrl: string;
        let basemapAttribution: string;

        if (basemap === 'satellite') {
          basemapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
          basemapAttribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
        } else {
          basemapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
          basemapAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        }

        basemapLayerRef.current = L.tileLayer(basemapUrl, {
          attribution: basemapAttribution,
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        basemapLayerRef.current.bringToBack();
      };

      loadLeaflet();
    }
  }, [basemap]);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
