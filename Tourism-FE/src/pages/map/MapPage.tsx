import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from '@react-google-maps/api';
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
  Heart,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 80px)', // Full height minus header
};

const defaultCenter: LatLng = {
  lat: 13.9833,
  lng: 108.0,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export const MapPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
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
          fetchNearby(loc.lat, loc.lng);
        },
        () => {
          toast.info('Sử dụng vị trí mặc định tại Pleiku');
          setUserLocation(defaultCenter);
          fetchNearby(defaultCenter.lat, defaultCenter.lng);
        }
      );
    } else {
      setUserLocation(defaultCenter);
      fetchNearby(defaultCenter.lat, defaultCenter.lng);
    }
  }, [fetchNearby]);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handleZoomChanged = () => {
    if (!map) return;
    const zoom = map.getZoom();
    if (zoom && zoom < 12 && !isAllMode) {
      // Logic from acceptance criteria: zoom out -> show all
      // fetchAll(); // Auto fetch on zoom out? Let's add a button instead to avoid excessive calls
    }
  };

  if (!isLoaded)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="w-12 h-12 text-forest-leaf animate-spin" />
        <p className="font-bold text-basalt-soil tracking-widest uppercase text-xs">
          Đang tải bản đồ Gia Lai...
        </p>
      </div>
    );

  return (
    <div className="relative pt-20 overflow-hidden">
      {/* Map UI Controls */}
      <div className="absolute top-24 left-8 z-10 flex flex-col gap-4">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-1">
          <button
            onClick={() => userLocation && fetchNearby(userLocation.lat, userLocation.lng)}
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
          onClick={() => map?.panTo(userLocation || defaultCenter)}
          className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-slate-500 hover:text-forest-leaf transition-all"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Info Panel */}
      <div className="absolute top-24 right-8 z-10 w-80 pointer-events-none">
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
            {locations.map((loc) => (
              <button
                key={loc.locationId}
                onClick={() => {
                  setSelectedLocation(loc);
                  map?.panTo({ lat: loc.latitude, lng: loc.longitude });
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
            ))}
          </div>
        </div>
      </div>

      {/* Main Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || defaultCenter}
        zoom={13}
        onLoad={onMapLoad}
        onZoomChanged={handleZoomChanged}
        options={mapOptions}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
            title="Vị trí của bạn"
          />
        )}

        {locations.map((loc) => (
          <Marker
            key={loc.locationId}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            onClick={() => setSelectedLocation(loc)}
            animation={
              selectedLocation?.locationId === loc.locationId
                ? google.maps.Animation.BOUNCE
                : undefined
            }
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-1 max-w-[240px]">
              <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                <img
                  src={
                    ('postThumbnailUrl' in selectedLocation
                      ? selectedLocation.postThumbnailUrl
                      : selectedLocation.thumbnailUrl) || 'https://via.placeholder.com/240x120'
                  }
                  alt={selectedLocation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-bold">{selectedLocation.averageRating}</span>
                </div>
              </div>
              <h3 className="font-bold text-basalt-soil text-sm mb-1 leading-tight">
                {selectedLocation.name}
              </h3>
              <p className="text-[10px] text-slate-500 mb-3 line-clamp-2">
                {selectedLocation.address}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {selectedLocation.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <a
                href={`/posts/${selectedLocation.postId}`}
                className="flex items-center justify-between w-full p-2 bg-forest-leaf text-white rounded-lg text-[10px] font-bold hover:bg-forest-leaf/90 transition-colors"
              >
                Xem chi tiết bài viết
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
