import { AlertCircle, CheckCircle, FileJson, Layers, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

export interface IngestedGeoJsonLayer {
    id: string;
    name: string;
    color: string;
    geojson: any;
}

interface GeoJSONIngestionProps {
    layers: IngestedGeoJsonLayer[];
    onLayersChange: (layers: IngestedGeoJsonLayer[]) => void;
}

const LAYER_COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#06b6d4', '#f97316', '#6366f1'];

export function GeoJSONIngestion({ layers, onLayersChange }: GeoJSONIngestionProps) {
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback((file: File) => {
        if (!file.name.endsWith('.geojson') && !file.name.endsWith('.json')) {
            setError('Only .geojson or .json files are supported.');
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const parsed = JSON.parse(text);
                if (!parsed.type || !['FeatureCollection', 'Feature', 'Polygon', 'MultiPolygon', 'Point', 'LineString'].includes(parsed.type)) {
                    setError('Invalid GeoJSON format. Expected FeatureCollection or Feature.');
                    return;
                }
                const color = LAYER_COLORS[layers.length % LAYER_COLORS.length];
                const newLayer: IngestedGeoJsonLayer = {
                    id: `geojson-${Date.now()}`,
                    name: file.name.replace(/\.(geojson|json)$/i, ''),
                    color,
                    geojson: parsed,
                };
                onLayersChange([...layers, newLayer]);
            } catch {
                setError('Failed to parse file. Ensure it is valid JSON/GeoJSON.');
            }
        };
        reader.readAsText(file);
    }, [layers, onLayersChange]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeLayer = (id: string) => {
        onLayersChange(layers.filter(l => l.id !== id));
    };

    return (
        <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
                <FileJson className="w-4 h-4 text-gray-700" />
                <h3 className="font-semibold text-gray-900 text-sm">GeoJSON Ingestion</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">Upload .geojson files from the data team to overlay on the map.</p>

            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all"
                style={{
                    borderColor: dragging ? '#3b82f6' : '#d1d5db',
                    backgroundColor: dragging ? '#eff6ff' : '#f9fafb',
                }}
            >
                <Upload className={`w-6 h-6 mx-auto mb-2 ${dragging ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-xs font-medium text-gray-700">Drop .geojson here</p>
                <p className="text-xs text-gray-400 mt-0.5">or click to browse</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".geojson,.json"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700">{error}</p>
                </div>
            )}

            {/* Loaded layers */}
            {layers.length > 0 && (
                <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <Layers className="w-3 h-3" />
                        <span>Loaded Layers ({layers.length})</span>
                    </div>
                    {layers.map(layer => (
                        <div
                            key={layer.id}
                            className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: layer.color }} />
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                                <span className="text-xs font-medium text-gray-800 truncate">{layer.name}</span>
                            </div>
                            <button
                                onClick={() => removeLayer(layer.id)}
                                className="p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
