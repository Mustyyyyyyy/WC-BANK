import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data.user);
        setProfilePic(res.data.user.profilePic || "");
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setMsg("");

    try {
      // Simulate upload. In real app, you’d POST to backend /api/auth/upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setMsg("✅ Profile picture updated!");
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to upload picture");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <p className="text-center mt-5 text-white">Loading profile...</p>
    );

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card shadow-lg rounded-4 p-5"
        style={{ maxWidth: "450px", width: "100%", background: "white" }}
      >
        <div className="text-center mb-4">
          <div
            className="rounded-circle overflow-hidden mx-auto mb-3"
            style={{
              width: "120px",
              height: "120px",
              background: "#f0f0f0",
            }}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  fontSize: "3rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "#888",
                }}
              >
                👤
              </span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="form-control form-control-sm"
            onChange={handlePicUpload}
          />
          {msg && (
            <p
              className={`mt-2 text-center ${
                msg.startsWith("✅") ? "text-success" : "text-danger"
              }`}
            >
              {msg}
            </p>
          )}
        </div>

        <h3 className="text-center mb-4 fw-bold">{user.name}</h3>
        <div className="mb-2">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="mb-2">
          <strong>Account Number:</strong> {user.accountNumber}
        </div>
        <div className="mb-4">
          <strong>Balance:</strong> ₦{user.balance.toLocaleString()}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="btn btn-primary w-100 fw-semibold py-2 mb-2"
        >
          Edit Profile
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="btn btn-outline-secondary w-100"
          onClick={() => window.history.back()}
        >
          Back
        </motion.button>
      </motion.div>
    </div>
  );
}
