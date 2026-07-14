import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import back from "../assets/photo/arrow.png";
import next from "../assets/photo/next.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";

const SubjectStudents = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const subjectCode = location.state?.code ?? "";
  const subjectTitle = location.state?.title ?? "";

  const [search, setSearch] = useState("");
  const [professors, setProfessors] = useState([]);
  // null = no professor filter applied (show everyone)
  const [selectedProfessorId, setSelectedProfessorId] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!subjectCode) return;

    // Every professor currently handling this subject
    fetch(`/bridge/subject-professors/${encodeURIComponent(subjectCode)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProfessors(data.data);
        } else {
          setProfessors([]);
        }
      })
      .catch(() => setProfessors([]));

    // Every student enrolled in the subject, across all professors/sections.
    // Each row is expected to carry a professorId so we can filter client-side.
    setLoading(true);
    fetch(`/bridge/subject-students/${encodeURIComponent(subjectCode)}`)
      .then((r) => r.json())
      .then((data) => {
        setStudents(data.success && Array.isArray(data.data) ? data.data : []);
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [subjectCode]);

  const visibleStudents = students
    .filter((s) => (selectedProfessorId ? s.professorId === selectedProfessorId : true))
    .filter(
      (s) =>
        (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.number || "").toString().includes(search)
    );

  const toggleProfessor = (id) => {
    setSelectedProfessorId((prev) => (prev === id ? null : id));
  };

  // Prints only what's currently on screen (i.e. respects the active professor filter)
  const handlePrint = () => {
    window.print();
  };

  // Always prints every professor's students for this subject, regardless of the current filter
  const handlePrintAll = () => {
    const previousFilter = selectedProfessorId;
    setSelectedProfessorId(null);
    setTimeout(() => {
      window.print();
      setSelectedProfessorId(previousFilter);
    }, 100);
  };

  return (
    <div className="bg-gray-100 h-full pl-[55%] md:pl-88 font-RB w-full min-h-screen">
      {/* HEADER */}
      <div className="p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9] items-start">
        <div className="flex flex-col items-start gap-1">
          <button onClick={() => navigate(-1)} className="cursor-pointer">
            <img src={back} alt="Back" className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 text-[20px]">
            <Link to="/subject-listing" className="font-bold text-black/50">
              Subject Listing
            </Link>
            <img src={next} alt="Next" className="w-4 h-4" />
            <span className="font-bold text-black">{subjectCode}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-2 w-56">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <div className="w-px h-5 bg-gray-400 mr-2"></div>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
            />
          </div>

          <Link to="/profile">
            <div className="flex flex-col items-center cursor-pointer active:scale-95">
              <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>
        </div>
      </div>

      {/* MAIN */}
      <main className="px-8 py-6">
        {/* Subject title + Print actions */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold">{subjectCode}</h1>
            {subjectTitle && <p className="text-sm text-gray-600">{subjectTitle}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-[#1C6100] text-white rounded-md text-sm font-bold cursor-pointer hover:bg-green-800"
            >
              Print
            </button>
            <button
              onClick={handlePrintAll}
              className="px-6 py-2 bg-[#1C6100] text-white rounded-md text-sm font-bold cursor-pointer hover:bg-green-800"
            >
              Print All
            </button>
          </div>
        </div>

        {/* Professor filter pills */}
        <div className="flex gap-3 my-4 flex-wrap">
          {professors.map((prof) => {
            const isActive = selectedProfessorId === prof.id;
            return (
              <button
                key={prof.id}
                onClick={() => toggleProfessor(prof.id)}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                  isActive
                    ? "bg-[#1C6100] text-white"
                    : "bg-white text-[#1C6100] border border-[#1C6100] hover:bg-green-50"
                }`}
              >
                {prof.name}
              </button>
            );
          })}
        </div>

        {/* Students Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1C6100] text-white text-sm">
              <th className="border border-[#1C6100] p-2 text-left">Student Number</th>
              <th className="border border-[#1C6100] p-2 text-left">Student Name</th>
              <th className="border border-[#1C6100] p-2 text-left">Section</th>
              <th className="border border-[#1C6100] p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  Loading students…
                </td>
              </tr>
            ) : visibleStudents.length > 0 ? (
              visibleStudents.map((student, index) => (
                <tr key={index}>
                  <td className="border p-2">{student.number}</td>
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.section}</td>
                  <td className="border p-2">{student.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default SubjectStudents;
