import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import SegmentModal from "../components/Modals/SegmentModal";
import LocationModal from "../components/Modals/LocationModal";
import { useSegmentContext } from "../context/SegmentContext";
import { getCurrentTime } from "../utils/getCurrentTime";
import ManualTimeModal from "../components/Modals/ManualTime";
import { useManualTimeContext } from "../context/ManualTimeContext";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import { Square } from "lucide-react";
import EditSegmentModal from "../components/Modals/EditSegmentModal";
import { formattedTime } from "../utils/formattedTime";
import formatWorkDate from "../utils/formatWorkDate";
import { useNavigate } from "react-router-dom";

function Layout() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmMessage, setConfirmMessage] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);
  const [status, setStatus] = useState("Not Started");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [attendance, setAttendance] = useState({
    data: {
      work_date: new Date().toISOString(),
      status: "NOT_STARTED",
    },
  });

  const {
    setOpenSegmentModal,
    setSelectedSegment,
    setRecordType,
    segments,
    setSegments,
    tempSegment,
    setTempSegment,
  } = useSegmentContext();

  const navigate = useNavigate();
  const { setStartTime, setEndTime, setOpenTimeModal } = useManualTimeContext();
  const today = new Date().toDateString();

  // ✅ STATUS LOGIC BASED ON end_time
  useEffect(() => {
    const attendanceStatus = attendance?.data?.status;

    if (attendanceStatus === "END_OF_DAY") {
      setStatus("End Of Day");
      return;
    }

    if (segments.length === 0) {
      setStatus("Not Started");
      return;
    }

    // Any segment without end_time is active
    const anyWorking = segments.some((seg) => !seg.end_time);
    setStatus(anyWorking ? "Working" : "Completed");
  }, [segments, attendance]);

  const openConfirmation = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setOpenConfirm(true);
  };

  const handleStartSegment = (type) => {
    setRecordType(type);
    setSelectedSegment("");
    setOpenSegmentModal(true);
    setStartTime(getCurrentTime());
    setEndTime("");
  };

  const handleEditSegment = (segment) => {
    const normalized = {
      ...segment,
      segment: segment.segment_type,
      site: segment.site_id,
      startTime: segment.start_time,
      endTime: segment.end_time,
    };
    setEditingSegment(normalized);
    setOpenEditModal(true);
  };

  const handleEndSegment = (seg) => {
    const now = new Date().toISOString();
    setSegments((prev) =>
      prev.map((s) => (s.id === seg.id ? { ...s, end_time: now } : s))
    );
    setOpenConfirm(false);
  };

  const handleEndOfDay = () => {
    openConfirmation("「作業を終了してもよろしいですか？」", () => {
      setConfirmLoading(true);
      const now = new Date().toISOString();

      setSegments((prev) =>
        prev.map((seg) => (!seg.end_time ? { ...seg, end_time: now } : seg))
      );

      setAttendance((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          status: "END_OF_DAY",
          end_time: now,
        },
      }));

      setConfirmLoading(false);
      setOpenConfirm(false);
      navigate("/transportation-expenses");
    });
  };

  const handleUpdateSegment = (updatedSegment) => {
    setSegments((prev) =>
      prev.map((seg) => (seg.id === updatedSegment.id ? updatedSegment : seg))
    );
  };

  const isEnded = status === "End Of Day";

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <div className="bg-white px-5 py-4 border-b">
        <p className="text-sm text-gray-500">
          {attendance?.data?.work_date
            ? formatWorkDate(attendance.data.work_date)
            : today}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span
            className={`font-semibold text-lg ${
              status === "Working" ? "text-green-600" : "text-gray-600"
            }`}
          >
            ステータス： {status}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className={`bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4
              ${
                isEnded
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:bg-gray-100"
              }
            `}
            onClick={() => {
              if (isEnded) return;
              handleEditSegment(seg);
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-2 h-10 rounded-full ${
                  seg.segment_type === "TRAVEL"
                    ? "bg-orange-400"
                    : seg.segment_type === "OFFICE"
                    ? "bg-blue-500"
                    : seg.segment_type === "SITE"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />

              <div>
                <p className="font-semibold text-gray-800">
                  {formattedTime(seg.start_time)} – {formattedTime(seg.end_time)}{" "}
                  {seg.segment_type}
                </p>

                {seg.segment_type !== "OFFICE" && (
                  <p className="text-sm text-gray-500">
                    → {seg.site_id || "サイトが選択されていません"}
                  </p>
                )}
              </div>
            </div>

            {!isEnded && !seg.end_time && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openConfirmation(
                    `「${seg.segment_type}」セグメントを終了しますか？`,
                    () => handleEndSegment(seg)
                  );
                }}
                className="p-1 rounded-full hover:bg-red-100 text-red-500"
              >
                <Square size={18} fill="currentColor" />
              </button>
            )}
          </div>
        ))}

        {status !== "完了" && status !== "一日の終了" && (
          <div className="space-y-2">
            <Button
              text={segments.length > 0 ? "＋セグメントを追加" : "▶ 開始"}
              customButton="bg-green-500 text-white py-4 hover:bg-green-600"
              onClick={() => handleStartSegment("default")}
            />

            <Button
              text="＋セグメントを手動で追加"
              customButton="bg-lime-500 text-white py-4 hover:bg-lime-600"
              onClick={() => handleStartSegment("manual")}
            />

            <Button
              text="↪ 仕事終了"
              customButton="border border-gray-300 py-4"
              onClick={handleEndOfDay}
              disabled={segments.length === 0}
            />
          </div>
        )}
      </div>

      <SegmentModal />
      <LocationModal />
      <ManualTimeModal />

      <EditSegmentModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        segmentData={editingSegment}
        segments={["OFFICE", "TRAVEL", "SITE"]}
        sites={[
          "サイトA - 新宿タワー",
          "サイトB - 渋谷オフィス",
          "サイトC - 六本木ヒルズ",
        ]}
        onSave={handleUpdateSegment}
      />

      {openConfirm && (
        <ConfirmationModal
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => {
            if (!confirmLoading) setOpenConfirm(false);
          }}
          loading={confirmLoading}
        />
      )}
    </div>
  );
}

export default Layout;