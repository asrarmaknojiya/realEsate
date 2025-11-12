import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { IoTrashOutline, IoPencilOutline } from "react-icons/io5";
import { MdPayments } from "react-icons/md";
import "../../../assets/css/admin/client-details.css";
import DeleteConfirmModal from "../../../components/modals/DeleteConfirmModal"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // modal + loading states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // responsive resize handler
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 768);
      setIsTablet(w <= 1024 && w > 768);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // fetch client data
  const fetchClient = async () => {
    try {
      const res = await api.get(`/admin/getUserById/${id}`);
      setClient(res.data || {});
    } catch (err) {
      console.error("fetchClient", err);
      toast.error("Failed to fetch client details ❌");
    }
  };

  useEffect(() => {
    fetchClient();
    // eslint-disable-next-line
  }, [id]);

  // open delete modal
  const openDeleteModal = () => setDeleteModalOpen(true);

  // confirm delete (called when correct code entered)
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/delete-client/${id}`);
      toast.success("Client deleted successfully ✅");
      setDeleteModalOpen(false);
      setTimeout(() => navigate("/admin/manage-admins"), 1500);
    } catch (err) {
      console.error("delete client", err);
      toast.error("Failed to delete client ❌");
      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Navbar / Sidebar optional */}
      {/* <Navbar /> */}
      {/* <Sidebar open={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} /> */}

      <main
        className={`admin-panel-header-div ${isMobile ? "mobile-view" : ""} ${
          isTablet ? "tablet-view" : ""
        } ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        {/* Top row: Back (left) + View Payments (right) */}
        <div className="form-header-top">
          <div className="header-top-left">
            <button className="header-back-btn" onClick={() => navigate(-1)}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <IoPencilOutline style={{ display: "none" }} />
              </span>
              Back
            </button>
          </div>

          <div className="header-top-right">
            <button
              className="info-btn form-save-btn"
              onClick={() => navigate(`/admin/view-admin/${id}`)}
            >
              <MdPayments /> View Payments
            </button>
          </div>
        </div>

        {/* Title row */}
        <div className="form-header-title header-with-actions">
          <div>
            <h5>Client Details</h5>
          </div>

          <div className="header-actions-right">
            <button
              className="primary-btn"
              onClick={() => navigate(`/admin/edit-admin/${id}`)}
            >
              <IoPencilOutline /> Edit
            </button>

            {/* delete now uses modal */}
            <button
              className="cancel-btn"
              onClick={openDeleteModal}
              disabled={isDeleting}
              style={{ opacity: isDeleting ? 0.6 : 1 }}
            >
              <IoTrashOutline /> Delete
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="form-content-grid">
          <div className="form-left">
            <div className="form-card">
              <h6>Profile</h6>
              <div className="profile-info">
                <img
                  src={client.img ? `/uploads/${client.img}` : "/uploads/default.png"}
                  alt={client.name}
                  className="profile-img"
                />
                <div className="profile-details">
                  <h3>{client.name || "—"}</h3>
                  <p>
                    <FaEnvelope /> {client.email || "—"}
                  </p>
                  <p>
                    <FaPhone /> {client.number || "—"}
                  </p>
                  <div className="profile-bio">{client.about || "No bio available."}</div>
                </div>
              </div>
            </div>

            <div className="form-card">
              <h6>Other Details</h6>
              <div className="details-grid">
                <div>
                  <strong>Status:</strong> <span>{client.status || "—"}</span>
                </div>
                <div>
                  <strong>Added:</strong>{" "}
                  <span>
                    {(client.createdat || client.created_at || "").slice(0, 10) || "—"}
                  </span>
                </div>
                <div>
                  <strong>Alternate Phone:</strong>{" "}
                  <span>{client.alt_number || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🧾 Delete Modal (uses your existing random-code confirm) */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar theme="colored" />
    </>
  );
};

export default ClientDetails;
