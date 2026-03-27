import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import ActionCard from '../ActionCard';
import { useSegmentContext } from '../../context/SegmentContext';
import { useManualTimeContext } from '../../context/ManualTimeContext';
import { useLocationContext } from '../../context/LocationContext';

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
    { id: "1", name: "サイトA - 新宿タワー", icon: MapPin },
    { id: "2", name: "サイトB - 渋谷オフィス", icon: MapPin },
    { id: "3", name: "サイトC - 六本木ヒルズ", icon: MapPin },
  ];

  const handleClose = () => {
    setStep('TYPE');
    setOpenLocationModal(false);
  };

  const handleSelectSite = (site) => {
    if (!tempSegment) return;

    const updatedSegment = {
      ...tempSegment,
      site_id: site.name,
      site_name: site.name,
      start_time: tempSegment?.start_time ? new Date(tempSegment.start_time).toISOString() : new Date().toISOString(),
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

  const handleSkip = () => {
    if (!tempSegment) return;

    const updatedSegment = {
      ...tempSegment,
      start_time: tempSegment?.start_time ? new Date(tempSegment.start_time).toISOString() : new Date().toISOString(),
    };

    if (recordType === "manual") {
      setTempSegment(updatedSegment);
      setOpenLocationModal(false);
      setOpenTimeModal(true);
      return;
    }

    setSegments((prev) => [...prev, updatedSegment]);
    setOpenLocationModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />
      <div className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-xl font-bold text-gray-900">場所を選択</h2>
          <button onClick={handleClose} className="cursor-pointer text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-1">
          {sites.map((site, index) => (
            <ActionCard
              key={index}
              name={site.name} // 動的なのでそのまま
              description="" // 空の説明はそのまま
              icon={site.icon}
              onClick={() => handleSelectSite(site)}
            />
          ))}

          <button
            onClick={handleSkip}
            className="w-full py-2 mt-2 text-sm font-medium rounded-lg border border-gray-300"
          >
            スキップ
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;