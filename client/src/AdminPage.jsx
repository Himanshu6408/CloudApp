import React, { useEffect, useState } from "react";
import "./AdminPage.css";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const BASE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
        credentials: "include",
      });
      if (!statsRes.ok) throw new Error("Failed to fetch stats");
      const statsData = await statsRes.json();

      const usersRes = await fetch(`${BASE_URL}/users`, {
        credentials: "include",
      });
      if (!usersRes.ok) throw new Error("Failed to fetch users");
      const usersData = await usersRes.json();

      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <>
        <div className="center-screen">
          <div className="loader-ring" />
          <p className="loader-text">Fetching data</p>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <div className="center-screen">
          <p className="error-label">Error</p>
          <p className="error-text">{error}</p>
        </div>
      </>
    );

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers, icon: "USR" },
    { label: "Total Directories", value: stats?.totalDirectories, icon: "DIR" },
    { label: "Total Files", value: stats?.totalFiles, icon: "FLS" },
  ];

  return (
    <>
      <div className="admin-root">
        <div className="header">
          <div className="header-left">
            <span className="header-eyebrow">Control Panel</span>
            <h1 className="header-title">
              Admin<span>.</span>
            </h1>
            <p className="header-sub">System overview & user management</p>
          </div>
          <div className="header-badge">
            <span className="live-dot" />
            Live
          </div>
        </div>

        <div className="stats-grid">
          {statCards.map((card, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-index">
                {String(i + 1).padStart(2, "0")} / metric
              </div>
              <div className="stat-value">{card.value ?? "—"}</div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-icon">{card.icon}</div>
            </div>
          ))}
        </div>

        <div className="table-section">
          <div className="table-header">
            <h2 className="table-title">User Registry</h2>
            <span className="table-count">{users.length} records</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="row-num">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="user-name">{user.name}</td>
                    <td className="user-email">{user.email}</td>
                    <td>
                      {user.isLoggedIn ? (
                        <span className="status-badge status-online">
                          <span className="status-dot" />
                          Online
                        </span>
                      ) : (
                        <span className="status-badge status-offline">
                          <span className="status-dot" />
                          Offline
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="empty-state">No records found</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
