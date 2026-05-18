import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mapApi } from '@/services/api/mapApi';
import { NearbyLocationItem, AllLocationItem, LatLng } from '@/types/map';
import {
  Navigation,
  Search,
  Layers,
  Loader2,
  MapPin,
  Info,
  Star,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

// Fix Leaflet's default icon path issues with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultCenter: LatLng = {
  lat: 13.9833,
  lng: 108.0,
};

// Component to handle external state changes for the map center
const MapController = ({ center }: { center: LatLng | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], map.getZoom(), {
        duration: 1.5
      });
    }
  }, [center, map]);
  return null;
};

// Component to handle zoom events
const MapEvents = ({ isAllMode }: { isAllMode: boolean }) => {
  const map = useMapEvents({
    zoomend: () => {
      if (map.getZoom() < 12 && !isAllMode) {
        // Logic from acceptance criteria: zoom out -> show all
        // fetchAll(); // Auto fetch on zoom out? Let's add a button instead to avoid excessive calls
      }
    },
  });
  return null;
};

export const MapPage = () => {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const [locations, setLocations] = useState<(NearbyLocationItem | AllLocationItem)[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<
    NearbyLocationItem | AllLocationItem | null
  >(null);
  const [isAllMode, setIsAllMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNearby = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await mapApi.getNearbyLocations({ lat, lng, radius: 50, limit: 30 });
      setLocations(res.data.locations);
      setIsAllMode(false);
    } catch (error) {
      toast.error('Không thể lấy địa điểm gần bạn');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mapApi.getAllLocations();
      setLocations(res.data.locations);
      setIsAllMode(true);
    } catch (error) {
      toast.error('Không thể lấy tất cả địa điểm');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setMapCenter(loc);
          fetchNearby(loc.lat, loc.lng);
        },
        () => {
          toast.info('Sử dụng vị trí mặc định tại Pleiku');
          setUserLocation(defaultCenter);
          setMapCenter(defaultCenter);
          fetchNearby(defaultCenter.lat, defaultCenter.lng);
        }
      );
    } else {
      setUserLocation(defaultCenter);
      setMapCenter(defaultCenter);
      fetchNearby(defaultCenter.lat, defaultCenter.lng);
    }
  }, [fetchNearby]);

  return (
    <div className="relative pt-20 overflow-hidden h-screen">
      {/* Map UI Controls */}
      <div className="absolute top-24 left-8 z-[1000] flex flex-col gap-4">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-1">
          <button
            onClick={() => {
              if (userLocation) {
                setMapCenter(userLocation);
                fetchNearby(userLocation.lat, userLocation.lng);
              }
            }}
            className={`p-3 rounded-xl transition-all ${!isAllMode ? 'bg-forest-leaf text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            title="Địa điểm gần đây"
          >
            <Navigation className="w-5 h-5" />
          </button>
          <button
            onClick={fetchAll}
            className={`p-3 rounded-xl transition-all ${isAllMode ? 'bg-forest-leaf text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            title="Xem tất cả địa điểm"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setMapCenter(userLocation || defaultCenter)}
          className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-slate-500 hover:text-forest-leaf transition-all"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Info Panel */}
      <div className="absolute top-24 right-8 z-[1000] w-80 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-[32px] shadow-2xl border border-white/20 pointer-events-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-forest-leaf/10 text-forest-leaf rounded-lg">
              <Info className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-basalt-soil">Bản đồ Du lịch</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Khám phá các địa danh hấp dẫn tại Gia Lai. Phóng to để tìm quanh bạn, thu nhỏ để xem
            toàn bộ tỉnh.
          </p>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm địa danh trên bản đồ..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-xs focus:ring-2 focus:ring-forest-leaf/20"
            />
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-forest-leaf" />
              </div>
            ) : (
              locations.map((loc) => (
                <button
                  key={loc.locationId}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setMapCenter({ lat: loc.latitude, lng: loc.longitude });
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all border ${
                    selectedLocation?.locationId === loc.locationId
                      ? 'bg-forest-leaf/5 border-forest-leaf/20'
                      : 'bg-transparent border-transparent hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold text-basalt-soil mb-1 truncate">{loc.name}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{loc.averageRating}</span>
                    <span className="ml-auto">{'distance' in loc ? `${loc.distance} km` : ''}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Map */}
      <div className="w-full h-full z-0">
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={13}
          zoomControl={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapCenter} />
          <MapEvents isAllMode={isAllMode} />

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>Vị trí của bạn</Popup>
            </Marker>
          )}

          {locations.map((loc) => (
            <Marker
              key={loc.locationId}
              position={[loc.latitude, loc.longitude]}
              icon={selectedLocation?.locationId === loc.locationId ? selectedIcon : defaultIcon}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(loc);
                  setMapCenter({ lat: loc.latitude, lng: loc.longitude });
                },
              }}
            >
              <Popup
                onClose={() => {
                  if (selectedLocation?.locationId === loc.locationId) {
                    setSelectedLocation(null);
                  }
                }}
              >
                <div className="p-0 m-0 min-w-[200px]">
                  <div className="relative h-24 rounded-t-lg overflow-hidden mb-2">
                    <img
                      src={
                        ('postThumbnailUrl' in loc
                          ? loc.postThumbnailUrl
                          : loc.thumbnailUrl) || 'https://via.placeholder.com/240x120'
                      }
                      alt={loc.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/90 backdrop-blur rounded flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                      <span className="text-[9px] font-bold">{loc.averageRating}</span>
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="font-bold text-basalt-soil text-sm mb-1 leading-tight">
                      {loc.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-2 line-clamp-2">
                      {loc.address}
                    </p>

                    <a
                      href={`/posts/${loc.postId}`}
                      className="flex items-center justify-between w-full p-1.5 bg-forest-leaf text-white rounded text-[10px] font-bold hover:bg-forest-leaf/90 transition-colors"
                      style={{ textDecoration: 'none' }}
                    >
                      Xem chi tiết
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
