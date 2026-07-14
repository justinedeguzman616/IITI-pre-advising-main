import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";

const defaultSubjects = [
  { code: "CC101", title: "Introduction to Programming" },
  { code: "PFT61", title: "Physical Fitness and Training" },
];

const SubjectListing = () => {
  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState(defaultSubjects);
  const navigate = useNavigate();

  useEffect(() => {
    // Subjects offered in the current/active semester
    fetch("/bridge/subject-listing")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setSubjects(data.data);
        }
      })
      .catch(() => {
        // keep defaults on failure
      });
  }, []);

  const filteredSubjects = subjects.filter(
    (s) =>
      (s.code || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 h-full pl-[55%] md:pl-88 font-RB w-full min-h-screen">
      {/* HEADER */}
      <div className="p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9]">
        <h1 className="font-bold text-2xl p-5">Subject Listing</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-2 w-65">
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
              placeholder="Search Subject"
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

      {/* CONTENT */}
      <main className="px-8 py-8">
        <div className="flex flex-col gap-3 max-w-4xl">
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject, index) => (
              <div
                key={index}
                onClick={() =>
                  navigate("/subject-listing-students", {
                    state: { code: subject.code, title: subject.title },
                  })
                }
                className="bg-[#1C6100] text-white rounded-xl px-5 py-3.5 shadow-md cursor-pointer hover:bg-green-800 transition text-center"
              >
                <h2 className="text-base font-bold">{subject.code}</h2>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">No subjects found.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SubjectListing;
