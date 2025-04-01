import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://sky-wings-server.vercel.app/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (updates) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append updated fields to form data
      for (const key in updates) {
        if (updates[key]) formData.append(key, updates[key]);
      }

      // Append image file if provided
      if (updates.image) {
        formData.append("image", updates.image);
      }

      const response = await axios.put(
        "https://sky-wings-server.vercel.app/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data); // Update local state with new profile data
      setIsEditing(false); // Switch back to view mode after update
      alert("Profile updated successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Check if profile is incomplete
  const isProfileIncomplete = () => {
    if (!user) return false;
    const requiredFields = ["name", "email", "gender", "nationality"];
    return requiredFields.some((field) => !user[field]);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl w-full">
      {/* Profile Section */}
      <section className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile</h2>

        {/* Complete Profile Alert */}
        {isProfileIncomplete() && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded-md">
            <p>
              Your profile is incomplete. Please update your profile to access
              all features.
            </p>
          </div>
        )}

        {/* View Mode */}
        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              {user?.image ? (
                <img
                  src={`${user.image}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-gray-200"
                />
              ) : (
                <p className="text-gray-500">No profile picture</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Name", value: user?.name },
                { label: "Email", value: user?.email },
                { label: "Gender", value: user?.gender },
                { label: "Nationality", value: user?.nationality },
                { label: "Phone", value: user?.phone },
                { label: "Address", value: user?.address },
                {
                  label: "Date of Birth",
                  value: user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : "Not provided",
                },
              ].map((item, index) => (
                <div key={index} className="border-b pb-2">
                  <label className="block text-sm font-medium text-gray-600">
                    {item.label}
                  </label>
                  <p className="text-gray-800 font-medium">
                    {item.value || "Not provided"}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updates = {
                name: formData.get("name"),
                email: formData.get("email"),
                gender: formData.get("gender"),
                nationality: formData.get("nationality"),
                phone: formData.get("phone"),
                address: formData.get("address"),
                dateOfBirth: formData.get("dateOfBirth"),
                image: formData.get("image"),
              };
              handleProfileUpdate(updates);
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  label: "Name",
                  type: "text",
                  name: "name",
                  value: user?.name,
                },
                {
                  label: "Email",
                  type: "email",
                  name: "email",
                  value: user?.email,
                },
                {
                  label: "Gender",
                  type: "select",
                  name: "gender",
                  options: ["Male", "Female", "Other"],
                  value: user?.gender,
                },
                {
                  label: "Nationality",
                  type: "text",
                  name: "nationality",
                  value: user?.nationality,
                },
                {
                  label: "Phone",
                  type: "text",
                  name: "phone",
                  value: user?.phone,
                },
                {
                  label: "Address",
                  type: "text",
                  name: "address",
                  value: user?.address,
                },
                {
                  label: "Date of Birth",
                  type: "date",
                  name: "dateOfBirth",
                  value: user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toISOString().split("T")[0]
                    : "",
                },
                { label: "Profile Picture", type: "file", name: "image" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600">
                    {item.label}
                  </label>
                  {item.type === "select" ? (
                    <select
                      name={item.name}
                      defaultValue={item.value}
                      className="mt-1 p-2 border rounded-lg bg-white shadow-sm"
                      required
                    >
                      <option value="">Select Gender</option>
                      {item.options.map((option) => (
                        <option key={option} value={option.toLowerCase()}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={item.type}
                      name={item.name}
                      defaultValue={item.value}
                      className="mt-1 p-2 border rounded-lg bg-white shadow-sm"
                      required={item.type !== "file"}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default Profile;
