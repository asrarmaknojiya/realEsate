// client/src/pages/admin/properties/AddProperty.jsx
import React, { useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import { HiXMark } from "react-icons/hi2";
import { IoChevronBackOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const AddProperty = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    status: "available",
    image: null,
  });

  const [imgPreview, setImgPreview] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imgPreview) URL.revokeObjectURL(imgPreview);
      setForm((prev) => ({ ...prev, image: file }));
      const url = URL.createObjectURL(file);
      setImgPreview(url);
    }
  };

  useEffect(() => {
    return () => {
      if (imgPreview) URL.revokeObjectURL(imgPreview);
    };
  }, [imgPreview]);

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.price || !form.address) {
        alert("Please fill in all required fields");
        return;
      }
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("address", form.address);
      fd.append("price", form.price);
      fd.append("status", form.status);
      if (form.image) fd.append("image", form.image);

      await axios.post("http://localhost:4500/addproperty", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Property added successfully ✅");
      navigate("/admin/property");
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add property ❌");
    }
  };

  return (
    <main className={`admin-panel-header-div ${isMobile ? "mobile-view" : ""} ${isTablet ? "tablet-view" : ""}`}>
      {/* Header grid: left (back), center (title), right (actions) */}
      <div className="admin-dashboard-main-header header-grid">
        <div className="header-left">
          <button className="header-back" onClick={() => navigate(-1)}>
            <IoChevronBackOutline /> Back
          </button>
        </div>

        <div className="header-center">
          <h5>Add Property</h5>
        </div>

        <div className="header-right">
          <button onClick={handleSubmit} className="primary-btn dashboard-add-product-btn">
            <MdSave />Save
          </button>
        </div>
      </div>

      {/* FORM AREA */}
      <div className="dashboard-add-content-card-div">
        <div className="dashboard-add-content-left-side">
          <div className="dashboard-add-content-card">
            <h6>Property Details</h6>
            <div className="add-product-form-container">
              <div className="coupon-code-input-profile">
                <div>
                  <label>
                    Title <span style={{ color: "red" }}>*</span>
                  </label>
                  <input type="text" name="title" placeholder="Enter property title" value={form.title} onChange={handleChange} required />
                </div>

                <div>
                  <label>
                    Price (₹) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input type="number" name="price" placeholder="Enter price" value={form.price} onChange={handleChange} required />
                </div>

                <div>
                  <label>
                    Address <span style={{ color: "red" }}>*</span>
                  </label>
                  <input type="text" name="address" placeholder="Enter full address" value={form.address} onChange={handleChange} required />
                </div>
              </div>

              <div className="coupon-code-input-profile">
                <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
                  <label>Description</label>
                  <textarea name="description" placeholder="Write about this property..." rows={4} value={form.description} onChange={handleChange}></textarea>
                </div>

                <div>
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="coupon-code-input-profile">
                <div>
                  <label>Upload Image</label>
                  <input type="file" name="image" onChange={handleFileChange} accept="image/*" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-add-content-right-side">
          {imgPreview ? (
            <div className="dashboard-add-content-card">
              <h6>Image Preview</h6>
              <div className="add-product-form-container">
                <img src={imgPreview} alt="Preview" style={{ width: "100%", borderRadius: "8px", marginTop: "8px", objectFit: "cover", maxHeight: "300px" }} />
              </div>
            </div>
          ) : (
            <div className="dashboard-add-content-card">
              <h6>No Image</h6>
              <div style={{ padding: 12, color: "#6b7280" }}>No image uploaded yet</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AddProperty;
