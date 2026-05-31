import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Loader2, Star, MapPin } from 'lucide-react';
import { mapApi } from '@/services/api/mapApi';
import { AllLocationItem } from '@/types/map';

// Fix for default marker icons in React Leaflet with Vite
const DefaultIcon = L.icon({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface AttractionsMapProps {
  keyword: string;
  activeTags: string[];
}

export const AttractionsMap = ({ keyword, activeTags }: AttractionsMapProps) => {
  const [locations, setLocations] = useState<AllLocationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Gia Lai coordinates
  const defaultCenter: L.LatLngTuple = [13.9833, 108.0];
  const defaultZoom = 9;

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (keyword) params.keyword = keyword;
        if (activeTags.length > 0) params.tags = activeTags.join(',');

        const res = await mapApi.getAllLocations(params);
        setLocations(res.data.locations);
      } catch (error) {
        console.error('Error fetching map locations:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchLocations();
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, activeTags]);

  return (
    <div className="w-full h-[600px] bg-white rounded-3xl border border-basalt-soil/5 shadow-xl relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-50 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
          <Loader2 className="w-10 h-10 text-forest-leaf animate-spin" />
          <p className="mt-4 text-on-surface-variant font-bold">Đang tải bản đồ...</p>
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full z-0"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((location) => (
          <Marker key={location.locationId} position={[location.latitude, location.longitude]}>
            <Popup className="rounded-2xl overflow-hidden">
              <div className="w-[280px]">
                {location.thumbnailUrl ? (
                  <div className="w-full h-40 overflow-hidden bg-slate-100 rounded-t-xl">
                    <img
                      src={location.thumbnailUrl}
                      alt={location.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-mist-beige flex items-center justify-center rounded-t-xl">
                    <MapPin className="w-10 h-10 text-outline/30" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-extrabold text-basalt-soil text-lg line-clamp-2 mb-2 leading-tight">
                    {location.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-3 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    {location.address}
                  </p>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{location.averageRating.toFixed(1)}</span>
                  </div>
                  <Link
                    to={`/posts/${location.postId}`}
                    className="block w-full py-2.5 text-center text-sm font-bold !text-white bg-forest-leaf rounded-xl hover:bg-forest-leaf/90 transition-colors shadow-md shadow-forest-leaf/20"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
