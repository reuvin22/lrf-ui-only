import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import ActionCard from '../ActionCard';
import { useSegmentContext } from '../../context/SegmentContext';
import { useLocationContext } from '../../context/LocationContext';
import { useManualTimeContext } from '../../context/ManualTimeContext';

function LocationModal() {
  const {
    openLocationModal,
    setOpenLocationModal,
    recordType,
    selectedSegment,
    setTempSegment,
    tempSegment,
    setSegments
  } = useSegmentContext();

  const { setOpenTimeModal } = useManualTimeContext();
  const { setSelectedSite } = useLocationContext();

  const [step, setStep] = useState('TYPE');

  if (!openLocationModal) return null;

  const sites = [
    { id: "1", name: "Site A - Shinjuku Tower", icon: MapPin },
    { id: "2", name: "Site B - Shibuya Office", icon: MapPin },
    { id: "3", name: "Site C - Roppongi Hills", icon: MapPin },
  ];

  const handleClose = () => {
    setStep('TYPE');
    setOpenLocationModal(false);
  };

  // ✅ SELECT SITE (STATE ONLY)
  const handleSelectSite = (site) => {
    if (!tempSegment) {
      console.error("tempSegment is null. Cannot proceed.");
      return;
    }

    const updatedSegment = {
      ...tempSegment,
      site_id: site.name,
      site_name: site.name,
      start_time: tempSegment?.start_time
        ? new Date(tempSegment.start_time).toISOString()
        : new Date().toISOString(),
    };

    setSelectedSite(site.name);

    if (recordType === "manual") {
      setTempSegment(updatedSegment);
      setOpenLocationModal(false);
      setOpenTimeModal(true);
      return;
    }

    setSegments((prev) => [...prev, updatedSegment]);
    setOpenLocationModal(false);
  };

  // ✅ SKIP SITE (STATE ONLY)
  const handleSkip = () => {
    if (!tempSegment) {
      console.error("tempSegment is null. Cannot skip.");
      return;
    }

    const updatedSegment = {
      ...tempSegment,
      site_id: null,
      site_name: null,
    };

    if (recordType === "manual") {
      setTempSegment(updatedSegment);
      setOpenTimeModal(true);
    } else {
      setSegments((prev) => [...prev, updatedSegment]);
    }

    setOpenLocationModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-7">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Select Site</h2>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="min-h-75">
          {sites.map((site, index) => (
            <ActionCard
              key={index}
              icon={site.icon}
              name={site.name}
              onClick={() => handleSelectSite(site)}
            />
          ))}

          {selectedSegment === 'Travel' && (
            <button
              onClick={handleSkip}
              className="w-full py-3 mt-3 text-green-500 rounded-lg font-medium hover:text-green-800 cursor-pointer"
            >
              Skip (No Site)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationModal;