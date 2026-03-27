import React, { useState, useEffect } from "react";
import Button from "../Button";
import { useSegmentContext } from "../../context/SegmentContext";

function EditSegmentModal({
  open,
  onClose,
  segmentData,
  segments,
  sites,
}) {
  const { setSegments } = useSegmentContext();

  const [segment, setSegment] = useState("");
  const [site, setSite] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState("");
  const [site_name, setSiteName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatTime = (datetime) => {
    if (!datetime) return "";
    const d = new Date(datetime);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  useEffect(() => {
    if (segmentData) {
      setSegment(segmentData.segment || "");
      setSite(segmentData.site || "");
      setStartTime(formatTime(segmentData.startTime));
      setEndTime(formatTime(segmentData.endTime));
      setType(segmentData.type || "");
      setSiteName(segmentData.site_name || "");
    }
  }, [segmentData?.id]); // ✅ use id (not segment_id)

  if (!open) return null;

  const isManual = segmentData?.type === "manual";

  const handleSegmentChange = (value) => {
    setSegment(value);

    if (value === "OFFICE") {
      setSite("");
    }

    if (value === "TRAVEL") {
      setSite("No Selected Site");
    }

    if (value === "SITE") {
      setSite("");
    }
  };

  const handleSave = () => {
    setIsLoading(true);

    const today = new Date().toISOString().split("T")[0];

    const updatedSegment = {
      ...segmentData,
      type: type,
      segment_type: segment,
      site_id: site,
      site_name: site_name
    };

    if (isManual) {
      updatedSegment.start_time = `${today}T${startTime}:00`;
      updatedSegment.end_time = `${today}T${endTime}:00`;
    }

    // ✅ UPDATE STATE (NO BACKEND)
    setSegments((prev) =>
      prev.map((seg) =>
        seg.id === updatedSegment.id ? updatedSegment : seg
      )
    );

    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[90%] max-w-md p-6 space-y-4">

        <h2 className="text-lg font-semibold">セグメントを編集</h2>

        <div>
          <label className="text-sm text-gray-500">セグメント</label>
          <select
            value={segment}
            onChange={(e) => handleSegmentChange(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
          >
            {segments.map((seg, i) => (
              <option key={i} value={seg}>
                {seg} {/* 動的なのでそのまま */}
              </option>
            ))}
          </select>
        </div>

        {segment !== "OFFICE" && (
          <div>
            <label className="text-sm text-gray-500">サイト</label>
            <select
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            >
              {segment === "TRAVEL" && (
                <option value="No Selected Site">サイトが選択されていません</option>
              )}

              {sites.map((s, i) => (
                <option key={i} value={s}>
                  {s} {/* 動的なのでそのまま */}
                </option>
              ))}
            </select>
          </div>
        )}

        {isManual && (
          <>
            <div>
              <label className="text-sm text-gray-500">開始時間</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">終了時間</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
          </>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            text="キャンセル"
            buttonStyle="secondary"
            onClick={onClose}
          />

          <Button
            onClick={handleSave}
            buttonStyle="active"
            text="保存"
            loading={isLoading}
          />
        </div>

      </div>
    </div>
  );
}

export default EditSegmentModal;