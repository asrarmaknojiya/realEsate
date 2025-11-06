import React, { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";
import Breadcrumb from "../layout/Breadcrumb";
import { MdSave } from "react-icons/md";
import { HiXMark } from "react-icons/hi2";
import { IoMdArrowDropright } from "react-icons/io";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../api/axiosInstance";

const API_ROOT = "http://localhost:4500";

export default function AddAssignment() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    property_id: "",
    client_id: "",
    assigned_by: localStorage.getItem("admin_id") || "",
    amount: "",
    details: "",
    assigned_at: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // fetch users, properties and current assignments
        const [uRes, pRes, aRes] = await Promise.all([
          api.get(`${API_ROOT}/admin/clients`),
          axios.get(`${API_ROOT}/getproperties`),
          axios.get(`${API_ROOT}/getassignedproperties`),
        ]);
        setUsers(uRes.data || []);
        setProperties(pRes.data || []);
        setAssignments(aRes.data || []);
      } catch (err) {
        console.error("init fetch", err);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const normalizePayload = (f) => ({
    property_id: f.property_id || null,
    client_id: f.client_id ? Number(f.client_id) : null,
    assigned_by: f.assigned_by ? Number(f.assigned_by) : null,
    amount: f.amount || null,
    details: f.details || null,
    assigned_at: f.assigned_at || null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.property_id || !form.client_id || !form.assigned_by) {
      setError("property, client and assigned_by are required");
      return;
    }
    try {
      await axios.post(`${API_ROOT}/addassignedproperty`, normalizePayload(form));
      alert("Assigned ✔");
      navigate("/admin/propertyassigned");
    } catch (err) {
      console.error("add", err);
      setError("Failed to add assignment");
    }
  };

  // ---- filter: hide properties that are already assigned OR not 'available' ----
  const assignedPropertyIds = new Set((assignments || []).map((a) => String(a.property_id)));
  const availableProperties = (properties || []).filter((p) => {
    const status = String(p.status || "").toLowerCase();
    // hide if not available or already assigned
    if (status !== "available") return false;
    if (assignedPropertyIds.has(String(p.id))) return false;
    return true;
  });

  return (
    <>
      <Sidebar />
      <Navbar />

      <main className="admin-panel-header-div">
        <div className="admin-dashboard-main-header" style={{ marginBottom: 24 }}>
          <div>
            <h5>Create Assignment</h5>
            <div className="admin-panel-breadcrumb">
              <Link to="/admin/dashboard" className="breadcrumb-link active">Dashboard</Link>
              <IoMdArrowDropright />
              <Link to="/admin/propertyassigned" className="breadcrumb-link active">Assignments</Link>
              <IoMdArrowDropright />
              <span className="breadcrumb-text">Create</span>
            </div>
          </div>

          <div className="admin-panel-header-add-buttons">
            <NavLink to="/admin/propertyassigned" className="cancel-btn dashboard-add-product-btn">
              <HiXMark /> Cancel
            </NavLink>

            <button onClick={handleSubmit} className="primary-btn dashboard-add-product-btn">
              <MdSave /> Assign
            </button>
          </div>
        </div>

        <div className="dashboard-add-content-card-div" style={{ paddingBottom: 40 }}>
          <div className="dashboard-add-content-left-side" style={{ maxWidth: 720 }}>
            <div className="dashboard-add-content-card">
              <h6>Assignment Details</h6>

              {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

              <div className="add-product-form-container">
                <label>Client</label>
                <select name="client_id" value={form.client_id} onChange={handleChange}>
                  <option value="">-- select client --</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email || u.number || u.id})</option>)}
                </select>

                <label style={{ marginTop: 8 }}>Property</label>
                <select name="property_id" value={form.property_id} onChange={handleChange}>
                  <option value="">-- select property --</option>
                  {availableProperties.map((p) => <option key={p.id} value={p.id}>{p.title || p.id} — {p.price ? `₹${p.price}` : "-"}</option>)}
                </select>

                <label style={{ marginTop: 8 }}>Amount</label>
                <input name="amount" value={form.amount} onChange={handleChange} placeholder="e.g. 8500000" />

                <label style={{ marginTop: 8 }}>Details</label>
                <textarea name="details" value={form.details} onChange={handleChange} rows={3} />

                <label style={{ marginTop: 8 }}>Assigned at (manual)</label>
                <input type="datetime-local" name="assigned_at" value={form.assigned_at} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
