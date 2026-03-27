import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../components/Button";
import ManualTimeModal from "../components/Modals/ManualTime";
import SegmentModal from "../components/Modals/SegmentModal";
import LocationModal from "../components/Modals/LocationModal";
import SubContractorModal from "../components/Modals/SubContractorModal";
import TransportationExpenseModal from "../components/Modals/TransportationExpenseModal";
import { formattedTime } from "../utils/formattedTime";
import formatWorkDate from "../utils/formatWorkDate";

import { useSegmentContext } from "../context/SegmentContext";
import { useManualTimeContext } from "../context/ManualTimeContext";

function CalendarDetail() {
  const navigate = useNavigate();
  const { year, month, day } = useParams();

  // Helper: convert HH:mm to ISO string for today
  const timeToISO = (hhmm) => {
    const [h, m] = hhmm.split(":");
    const d = new Date();
    d.setHours(Number(h), Number(m), 0, 0);
    return d.toISOString();
  };

  const [attendanceCalendar, setAttendanceCalendar] = useState([
    {
      work_date: `${year}-${String(Number(month) + 1).padStart(2, "0")}-${day}`,
      segments: [
        { id: 1, segment_type: "TRAVEL", site_id: "Site A", start_time: timeToISO("09:00"), end_time: timeToISO("09:30") },
        { id: 2, segment_type: "OFFICE", site_id: "Site B", start_time: timeToISO("09:30"), end_time: timeToISO("12:00") },
      ],
      actualHours: "7h 30m",
      overtime: "0h",
      transport: "¥580",
      subcontractors: "○○ Elect. 3 ppl 09:00-17:30",
    },
  ]);

  const [openSubcontractorModal, setOpenSubcontractorModal] = useState(false);
  const [openTransportModal, setOpenTransportModal] = useState(false);

  const displayDate = attendanceCalendar?.[0]?.work_date;
  const segments = attendanceCalendar?.[0]?.segments || [];
  const hasData = segments.length > 0;
  const sites = ["Site A", "Site B", "Site C"];

  // ✅ Segment and ManualTime context
  const {
    setOpenSegmentModal,
    setSelectedSegment,
    setRecordType,
    setSegments: setContextSegments,
    segments: contextSegments,
    tempSegment
  } = useSegmentContext();
  const { setStartTime, setEndTime } = useManualTimeContext();

  // ✅ Handle “Add Segment” like Layout.tsx
  const handleAddSegment = (type) => {
    setRecordType(type);       // manual or default
    setSelectedSegment("");    // no selection yet
    setOpenSegmentModal(true); // open segment modal
    setStartTime(new Date().toISOString());
    setEndTime("");
    setContextSegments(segments); // pass current segments to context
  };

  // ✅ Listen for tempSegment changes and add it to local segments
  // This ensures newly added segments show immediately
  if (tempSegment && !segments.find(s => s.id === tempSegment.id)) {
    setAttendanceCalendar(prev => {
      const copy = [...prev];
      copy[0].segments = [...copy[0].segments, tempSegment];
      return copy;
    });
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100">
      <div className="bg-white px-5 py-4 border-b">
        <span className="font-semibold text-lg">Input / Edit</span>
        <p className="text-sm text-gray-500 mt-1">
          {displayDate ? formatWorkDate(displayDate) : new Date().toDateString()}
        </p>
      </div>

      <div className="p-4 space-y-4">
        <button
          onClick={() => navigate("/calendar")}
          className="text-green-600 text-sm cursor-pointer"
        >
          ← Back to Calendar
        </button>

        {!hasData ? (
          <div className="text-center text-gray-500 py-10">No Data Available</div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {segments.map((seg) => (
                <div
                  key={seg.id}
                  className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-start"
                >
                  <div>
                    <h3 className="font-semibold">
                      {formattedTime(seg.start_time)} – {formattedTime(seg.end_time)} {seg.segment_type}
                    </h3>
                    {seg.segment_type !== "OFFICE" && (
                      <p className="text-gray-500 text-sm">
                        → {seg.site_id || "No Selected Site"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              <div className="flex justify-between">
                <span>Actual</span>
                <span className="font-semibold">{attendanceCalendar[0].actualHours}</span>
              </div>
              <div className="flex justify-between">
                <span>Overtime</span>
                <span className="font-semibold">{attendanceCalendar[0].overtime}</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span>Transport</span>
                <span className="font-semibold">{attendanceCalendar[0].transport}</span>
              </div>
              <hr />
              <div>
                <span>Subcontractors</span>
                <p className="text-sm mt-1">{attendanceCalendar[0].subcontractors}</p>
              </div>
            </div>

            {/* ✅ Add Segment buttons */}
            <div className="space-y-2 mt-4">
              <Button
                text={segments.length > 0 ? "+ Add Segment" : "▶ Start"}
                customButton="bg-green-500 text-white py-4 hover:bg-green-600"
                onClick={() => handleAddSegment("default")}
              />

              <Button
                text="+ Add Segment (manual)"
                customButton="bg-lime-500 text-white py-4 hover:bg-lime-600"
                onClick={() => handleAddSegment("manual")}
              />

              <Button
                text="Edit Transport"
                customButton="bg-lime-500 text-white py-4 hover:bg-lime-600"
                onClick={() => setOpenTransportModal(true)}
              />

              <Button
                text="Edit Subcontractor"
                customButton="bg-lime-500 text-white py-4 hover:bg-lime-600"
                onClick={() => setOpenSubcontractorModal(true)}
              />
            </div>
          </>
        )}
      </div>

      {/* ✅ Modals */}
      <SegmentModal />
      <LocationModal />
      <ManualTimeModal />
      <TransportationExpenseModal open={openTransportModal} setOpen={setOpenTransportModal} sites={sites} />
      <SubContractorModal open={openSubcontractorModal} setOpen={setOpenSubcontractorModal} />
    </div>
  );
}

export default CalendarDetail;