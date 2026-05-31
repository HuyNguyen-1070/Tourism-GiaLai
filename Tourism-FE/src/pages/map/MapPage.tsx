import { useEffect, useState, useCallback, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
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
  Navigation2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

// Fix Leaflet's default icon path issues with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const selectedIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultCenter: LatLng = {
  lat: 13.9833,
  lng: 108.0,
};

// Component to handle external state changes for the map center
const MapController = ({ center, zoom }: { center: LatLng | null; zoom?: number }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], zoom ?? map.getZoom(), {
        duration: 1.5,
      });
    }
  }, [center, zoom, map]);
  return null;
};

// Component to auto-open popup when a location is targeted via URL
const AutoOpenPopup = ({
  targetPostId,
  locations,
  markerRefs,
}: {
  targetPostId: string | null;
  locations: (NearbyLocationItem | AllLocationItem)[];
  markerRefs: React.MutableRefObject<Map<string, L.Marker>>;
}) => {
  const triggered = useRef(false);

  useEffect(() => {
    if (!targetPostId || triggered.current || locations.length === 0) return;
    const target = locations.find((l) => l.postId === targetPostId);
    if (target) {
      const marker = markerRefs.current.get(target.locationId);
      if (marker) {
        setTimeout(() => marker.openPopup(), 600);
        triggered.current = true;
      }
    }
  }, [targetPostId, locations, markerRefs]);

  return null;
};

const MapEvents = () => {
  useMapEvents({
    zoomend: () => {
      // reserved for future zoom-based fetch logic
    },
  });
  return null;
};

export const MapPage = () => {
  const [searchParams] = useSearchParams();
  const targetPostId = searchParams.get('postId');

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLng | null>(null);
  const [mapZoom, setMapZoom] = useState<number | undefined>(undefined);
  const [locations, setLocations] = useState<(NearbyLocationItem | AllLocationItem)[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<
    NearbyLocationItem | AllLocationItem | null
  >(null);
  const [isAllMode, setIsAllMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Store marker refs for auto-open popup
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  const fetchNearby = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await mapApi.getNearbyLocations({ lat, lng, radius: 50, limit: 30 });
      const nearbyLocs = res.data.locations;

      if (nearbyLocs.length === 0) {
        toast.info('Không tìm thấy địa điểm nào gần bạn trong bán kính 50km');
      }

      setLocations(nearbyLocs);
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

  const openDirections = (e: React.MouseEvent, destLat: number, destLng: number) => {
    e.stopPropagation();
    let url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
    if (userLocation) {
      url += `&origin=${userLocation.lat},${userLocation.lng}`;
    }
    window.open(url, '_blank');
  };

  // Initialize map: deep link mode (postId in URL) vs. normal mode
  useEffect(() => {
    const handleGeolocation = (callback: (loc: LatLng) => void) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
            setUserLocation(loc);
            callback(loc);
          },
          () => {
            setUserLocation(defaultCenter);
            callback(defaultCenter);
          }
        );
      } else {
        setUserLocation(defaultCenter);
        callback(defaultCenter);
      }
    };

    if (targetPostId) {
      // Deep link mode: load all locations, then fly to the target
      // Still fetch user location silently for directions
      handleGeolocation(() => {});

      mapApi
        .getAllLocations()
        .then((res) => {
          const allLocs = res.data.locations;
          setLocations(allLocs);
          setIsAllMode(true);
          setLoading(false);

          const target = allLocs.find((l) => l.postId === targetPostId);
          if (target) {
            setSelectedLocation(target);
            setMapCenter({ lat: target.latitude, lng: target.longitude });
            setMapZoom(15);
          } else {
            toast.info('Không tìm thấy địa điểm liên kết. Hiển thị toàn bộ bản đồ.');
            setMapCenter(defaultCenter);
          }
        })
        .catch(() => {
          toast.error('Không thể tải dữ liệu bản đồ');
          setLoading(false);
          setMapCenter(defaultCenter);
        });
    } else {
      // Normal mode: Show all locations by default
      fetchAll();

      // Still fetch user location silently for directions, but keep map centered on Pleiku
      handleGeolocation(() => {
        // Intentionally not setting mapCenter here so it stays at defaultCenter (Pleiku)
        // to give a good overview of all locations in the province.
      });
    }
  }, [targetPostId, fetchAll]);

  const filteredLocations = searchKeyword
    ? locations.filter((l) => l.name.toLowerCase().includes(searchKeyword.toLowerCase()))
    : locations;

  return (
    <div className="relative overflow-hidden h-[calc(100vh-80px)]">
      {/* Map UI Controls */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-4">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-1">
          <button
            onClick={() => {
              if (userLocation) {
                setMapCenter({ ...userLocation });
                setMapZoom(13);
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
          onClick={() => {
            setMapCenter({ ...(userLocation || defaultCenter) });
            setMapZoom(13);
          }}
          className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-slate-500 hover:text-forest-leaf transition-all"
          title="Về vị trí của tôi"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      {/* Deep link Banner */}
      {targetPostId && selectedLocation && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-basalt-soil/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-3 pointer-events-auto">
            <MapPin className="w-4 h-4 text-forest-leaf flex-shrink-0" />
            <span className="text-sm font-bold">{selectedLocation.name}</span>
            <a
              href={`/posts/${selectedLocation.postId}`}
              className="text-xs text-forest-leaf font-bold hover:underline"
            >
              Xem bài viết
            </a>
          </div>
        </div>
      )}

      {/* Floating Info Panel */}
      <div className="absolute top-24 right-8 z-[1000] w-80 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-[32px] shadow-2xl border border-white/20 pointer-events-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-forest-leaf/10 text-forest-leaf rounded-lg">
              <Info className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-basalt-soil">Bản đồ Du lịch</h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Khám phá các địa danh hấp dẫn tại Gia Lai. Phóng to để tìm quanh bạn, thu nhỏ để xem
            toàn bộ tỉnh.
          </p>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm địa danh trên bản đồ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-100 border-none rounded-xl text-xs focus:ring-2 focus:ring-forest-leaf/20 outline-none"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-forest-leaf" />
              </div>
            ) : filteredLocations.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">Không tìm thấy địa danh nào</p>
            ) : (
              filteredLocations.map((loc) => (
                <div
                  key={loc.locationId}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setMapCenter({ lat: loc.latitude, lng: loc.longitude });
                    setMapZoom(15);
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all border cursor-pointer group flex flex-col ${
                    selectedLocation?.locationId === loc.locationId
                      ? 'bg-forest-leaf/5 border-forest-leaf/20'
                      : 'bg-transparent border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs font-bold text-basalt-soil mb-1 truncate flex-1">
                      {loc.name}
                    </p>
                    <button
                      onClick={(e) => openDirections(e, loc.latitude, loc.longitude)}
                      className="p-1.5 bg-blue-50 text-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      title="Chỉ đường"
                    >
                      <Navigation2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{loc.averageRating}</span>
                    <span className="ml-auto">
                      {'distance' in loc ? `${(loc as NearbyLocationItem).distance} km` : ''}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Map */}
      <div className="w-full h-full z-0">
        <MapContainer
          center={[defaultCenter.lat, defaultCenter.lng]}
          zoom={10}
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomControl position="bottomleft" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController center={mapCenter} zoom={mapZoom} />
          <MapEvents />
          <AutoOpenPopup
            targetPostId={targetPostId}
            locations={locations}
            markerRefs={markerRefs}
          />

          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="text-center px-2 py-1">
                  <MapPin className="w-4 h-4 text-forest-leaf mx-auto mb-1" />
                  <p className="text-xs font-bold text-basalt-soil">Vị trí của bạn</p>
                </div>
              </Popup>
            </Marker>
          )}

          {locations.map((loc) => (
            <Marker
              key={loc.locationId}
              position={[loc.latitude, loc.longitude]}
              icon={selectedLocation?.locationId === loc.locationId ? selectedIcon : defaultIcon}
              ref={(ref) => {
                if (ref) markerRefs.current.set(loc.locationId, ref);
                else markerRefs.current.delete(loc.locationId);
              }}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(loc);
                  setMapCenter({ lat: loc.latitude, lng: loc.longitude });
                  setMapZoom(15);
                },
              }}
            >
              <Popup
                eventHandlers={{
                  remove: () => {
                    if (selectedLocation?.locationId === loc.locationId) {
                      setSelectedLocation(null);
                    }
                  },
                }}
              >
                <div className="p-0 m-0 min-w-[260px]">
                  <div className="relative h-32 rounded-t-xl overflow-hidden mb-3">
                    <img
                      src={
                        ('postThumbnailUrl' in loc ? loc.postThumbnailUrl : loc.thumbnailUrl) ||
                        'https://via.placeholder.com/260x160'
                      }
                      alt={loc.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded-lg flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold">{loc.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <h3 className="font-extrabold text-basalt-soil text-base mb-1.5 leading-tight">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {loc.address}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => openDirections(e, loc.latitude, loc.longitude)}
                        className="flex-1 flex justify-center items-center gap-1.5 py-2 px-2 bg-blue-50 !text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        <Navigation2 className="w-4 h-4" />
                        Chỉ đường
                      </button>
                      <a
                        href={`/posts/${loc.postId}`}
                        className="flex-1 flex justify-center items-center gap-1.5 py-2 px-2 bg-forest-leaf !text-white rounded-lg text-xs font-bold hover:bg-forest-leaf/90 transition-colors shadow-sm shadow-forest-leaf/20"
                        style={{ textDecoration: 'none' }}
                      >
                        Chi tiết
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
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
