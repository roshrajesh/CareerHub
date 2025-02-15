import { useState } from "react";
import axios from "axios";

const ApplyForm = ({ job, setShowApplyForm }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post("http://localhost:5000/api/applications", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Application submitted successfully!");
        setShowApplyForm(false);
      } else {
        alert("Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-semibold">Apply for {job.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required className="w-full p-2 border rounded" />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required className="w-full p-2 border rounded" />
          <input type="file" name="resume" onChange={handleFileChange} required className="w-full p-2 border rounded" />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Submit Application</button>
          <button type="button" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2" onClick={() => setShowApplyForm(false)}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
