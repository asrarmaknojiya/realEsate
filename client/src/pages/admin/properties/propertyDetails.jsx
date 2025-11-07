import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import "../../../assets/css/admin/property-details.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { IoPencil } from "react-icons/io5";

const PropertyDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [property, setProperty] = useState(location.state?.item || null);
  const [loading, setLoading] = useState(!location.state?.item);
  const [error, setError] = useState(null);

  // responsive helpers
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024 && window.innerWidth >= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(v => !v);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth < 1024 && window.innerWidth >= 768;
      setIsMobile(mobile);
      setIsTablet(tablet);
      if (mobile || tablet) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (property) return;

    const fetchProperty = async () => {
      if (!id) {
        setError("No property selected");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4500/getproperty/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Failed to fetch property:", err);
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!property?.id) return;
    const ok = window.confirm("Delete this property permanently?");
    if (!ok) return;
    try {
      await axios.delete(`http://localhost:4500/deleteproperty/${property.id}`);
      alert("Property deleted");
      navigate(-1);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete property");
    }
  };


    const handleEdit = () => {
    if (!property) return;
    navigate("/admin/updateproperty", { state: { item: property } });
  };

  if (loading) {
    return (
      <>
        <Sidebar isMobile={isMobile} isTablet={isTablet} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Navbar isMobile={isMobile} isTablet={isTablet} toggleSidebar={toggleSidebar} />

        {/* use same wrapper class as GetProperties so spacing matches */}
        <main className={`admin-panel-header-div ${isMobile ? "mobile-view" : ""} ${isTablet ? "tablet-view" : ""}`}>
          <div className="pd-center">Loading property…</div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Sidebar isMobile={isMobile} isTablet={isTablet} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Navbar isMobile={isMobile} isTablet={isTablet} toggleSidebar={toggleSidebar} />

        <main className={`admin-panel-header-div ${isMobile ? "mobile-view" : ""} ${isTablet ? "tablet-view" : ""}`}>
          <div className="pd-center">{error}</div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button className="btn ghost" onClick={() => navigate(-1)}>Back</button>
          </div>
        </main>
      </>
    );
  }

  const p = property || {};

  return (
    <>
      <Sidebar isMobile={isMobile} isTablet={isTablet} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Navbar isMobile={isMobile} isTablet={isTablet} toggleSidebar={toggleSidebar} />

      {/* IMPORTANT: using admin-panel-header-div with mobile/tablet modifiers
          makes this page behave exactly like GetProperties (no reserved sidebar gap) */}
      <main className={`admin-panel-header-div ${isMobile ? "mobile-view" : ""} ${isTablet ? "tablet-view" : ""}`}>
        <header className="pd-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <IoChevronBackOutline /> Back
          </button>

          <div className="pd-actions">
            <button className="btn" onClick={handleEdit}><IoPencil /> Edit</button>
            <button className="btn-danger" onClick={handleDelete}><MdDeleteForever /> Delete</button>
          </div>
        </header>

        <article className="pd-content">
          <section className="pd-main">
            <div className="pd-image-wrap">
              {p.image ? <img src={`/uploads/${p.image}`} alt={p.title} /> : <div className="no-img">No image</div>}
            </div>

            <h1 className="pd-title">{p.title}</h1>
            <div className="pd-address">{p.address}</div>

            <div className="pd-price-row">
              <div className="pd-price">₹{p.price}</div>
              <div className={`pd-status ${p.status || "unknown"}`}>{p.status || "—"}</div>
            </div>

            <div className="pd-meta">
              <div>
                <strong>Added</strong>
                <div>{p.createdat?.slice(0,10) || "—"}</div>
              </div>
            </div>

            <section className="pd-desc">
              <h3>Description</h3>
              <p>{p.description || "No description provided."}</p>
            </section>

            {p.features && (
              <section className="pd-features">
                <h3>Features</h3>
                <div className="pd-feat-list">
                  {p.features.split(",").map((f, i) => (
                    <span key={i} className="feat-pill">{f.trim()}</span>
                  ))}
                </div>
              </section>
            )}
          </section>
        </article>
      </main>
    </>
  );
};

export default PropertyDetails;
