import { useState } from "react";
import { motion } from "framer-motion";
import ProfileSection from "./ProfileSection";
import JobListings from "./JobListings";
import Applications from "./Applications";
import PlacementDrives from "./PlacementDrives";
import Notifications from "./Notifications";
import InterviewPreparation from "./InterviewPreparation";
import Support from "./Support";

const Studentdsh = () => {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = [
    "Profile",
    "Job Listings",
    "Applications",
    "Placement Drives",
    "Notifications",
    "Interview Preparation",
    "Support",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-800">Student Dashboard</h2>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mt-4">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.1 }}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Render Selected Section */}
        <div className="mt-6">
          {activeTab === "Profile" && <ProfileSection />}
          {activeTab === "Job Listings" && <JobListings />}
          {activeTab === "Applications" && <Applications />}
          {activeTab === "Placement Drives" && <PlacementDrives />}
          {activeTab === "Notifications" && <Notifications />}
          {activeTab === "Interview Preparation" && <InterviewPreparation />}
          {activeTab === "Support" && <Support />}
        </div>
      </div>
    </div>
  );
};

export default Studentdsh;
