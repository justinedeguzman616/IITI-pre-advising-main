import React, { useEffect, useState } from "react";

const ChangeSubjectModal = ({ show, currentCode, semester, studentNumber, onCancel, onSave }) => {
  const [subjectsList, setSubjectsList] = useState([]);
  const [selected, setSelected] = useState(currentCode);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;
    setSelected(currentCode);
    setLoading(true);
    fetch(
      `/bridge/allowed-subjects/${encodeURIComponent(studentNumber)}?semester=${encodeURIComponent(
        semester ?? ""
      )}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setSubjectsList(data.data);
        } else {
          setSubjectsList([]);
        }
      })
      .catch(() => setSubjectsList([]))
      .finally(() => setLoading(false));
  }, [show, studentNumber, semester, currentCode]);

  if (!show) return null;

  // Fall back to at least showing the currently selected subject if the fetch fails/is empty
  const displayList =
    subjectsList.length > 0 ? subjectsList : currentCode ? [{ code: currentCode, title: "" }] : [];

  const handleSave = () => {
    const chosen = displayList.find((s) => s.code === selected);
    if (chosen) onSave(chosen);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-70 font-RB">
      <div className="bg-white w-125 max-h-[80vh] rounded-lg shadow-lg p-6 overflow-auto">
        <h2 className="text-lg font-bold mb-1">Change Subject</h2>
        <p className="text-sm text-gray-500 mb-4">All Allowed Subjects</p>

        <div className="border border-gray-400 mb-6">
          {loading ? (
            <p className="text-center text-gray-400 py-6 text-sm">Loading subjects…</p>
          ) : displayList.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">No allowed subjects found.</p>
          ) : (
            displayList.map((subj) => (
              <div
                key={subj.code}
                className="flex items-center justify-between px-4 py-3 border-b border-gray-300 last:border-b-0"
              >
                <span className="text-sm font-medium">{subj.code}</span>
                {selected === subj.code ? (
                  <span className="text-sm text-gray-600">Currently Selected!</span>
                ) : (
                  <button
                    onClick={() => setSelected(subj.code)}
                    className="px-4 py-1 bg-[#1C6100] text-white text-sm rounded cursor-pointer hover:bg-green-800"
                  >
                    ADD
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#1C6100] text-white rounded cursor-pointer hover:bg-green-800"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeSubjectModal;
