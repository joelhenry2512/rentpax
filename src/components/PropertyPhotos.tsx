"use client";
import { Home, MapPin } from "lucide-react";

interface PropertyPhotosProps {
  photoUrl?: string;
  address: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

export default function PropertyPhotos({ photoUrl, address, beds, baths, sqft }: PropertyPhotosProps) {
  return (
    <section className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Home className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold">Property Details</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Property Photo or Placeholder */}
        <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={address}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${photoUrl ? 'hidden' : ''} flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100`}>
            <div className="text-center">
              <Home className="mx-auto text-blue-400 mb-2" size={48} />
              <p className="text-sm text-gray-500">Photo unavailable</p>
            </div>
          </div>
        </div>

        {/* Property Info Card */}
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={18} />
            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium">{address}</p>
            </div>
          </div>

          {(beds || baths || sqft) && (
            <div className="grid grid-cols-3 gap-3">
              {beds && (
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{beds}</div>
                  <div className="text-xs text-gray-600 mt-1">Beds</div>
                </div>
              )}
              {baths && (
                <div className="bg-cyan-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-cyan-600">{baths}</div>
                  <div className="text-xs text-gray-600 mt-1">Baths</div>
                </div>
              )}
              {sqft && (
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{sqft.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-1">Sq Ft</div>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Quick Stats</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">Single Family</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium text-green-600">Analyzed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
