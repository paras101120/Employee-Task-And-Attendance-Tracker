import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/my-tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error.response?.data || error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance/my-attendance");
      setAttendanceMarked(!!res.data.status);
    } catch (error) {
      console.error("Error fetching attendance:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUser();
    fetchAttendance();
  }, []);

  const completeTask = async (taskId) => {
    try {
      await API.put(`/tasks/${taskId}/complete`);
      alert("Task completed successfully");
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to complete task");
    }
  };

  const markAttendance = async (status) => {
    try {
      const res = await API.post("/attendance", { status });
      alert(res.data.message);
      setAttendanceMarked(true);
    } catch (error) {
      console.error("Attendance error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#fff",
      }}
    >
      <header
        style={{
          maxWidth: "900px",
          margin: "0 auto 40px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ fontSize: "32px", fontWeight: "700", margin: 0 }}>
            Employee Dashboard
          </h2>
          {user && (
            <p style={{ margin: "5px 0 0 0", fontSize: "18px", fontWeight: "500" }}>
              Welcome, {user.name}
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e53e3e",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#c53030")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#e53e3e")}
        >
          Logout
        </button>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Attendance Section */}
        <section
          style={{
            marginBottom: "50px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        >
          <h3 style={{ marginBottom: "15px", fontSize: "24px", fontWeight: "600" }}>
            Mark Attendance
          </h3>
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => markAttendance("Present")}
              disabled={attendanceMarked}
              style={{
                flex: 1,
                backgroundColor: attendanceMarked ? "#a0aec0" : "#48bb78",
                color: "#fff",
                border: "none",
                padding: "12px 0",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: attendanceMarked ? "not-allowed" : "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => !attendanceMarked && (e.target.style.backgroundColor = "#38a169")}
              onMouseOut={(e) => !attendanceMarked && (e.target.style.backgroundColor = "#48bb78")}
            >
              Mark Present
            </button>
            <button
              onClick={() => markAttendance("Absent")}
              disabled={attendanceMarked}
              style={{
                flex: 1,
                backgroundColor: attendanceMarked ? "#a0aec0" : "#f56565",
                color: "#fff",
                border: "none",
                padding: "12px 0",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: attendanceMarked ? "not-allowed" : "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => !attendanceMarked && (e.target.style.backgroundColor = "#c53030")}
              onMouseOut={(e) => !attendanceMarked && (e.target.style.backgroundColor = "#f56565")}
            >
              Mark Absent
            </button>
          </div>
        </section>

        {/* Tasks Section */}
        <section>
          <h3 style={{ marginBottom: "15px", fontSize: "24px", fontWeight: "600" }}>
            My Tasks
          </h3>
          {tasks.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "rgba(255,255,255,0.7)" }}>
              No tasks assigned yet.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "700px",
                  color: "#fff",
                }}
              >
                <thead style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
                  <tr>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>Sr No</th>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>Title</th>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 15px", textAlign: "left" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr
                      key={task._id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "rgba(255,255,255,0.1)" : "transparent",
                      }}
                    >
                      <td style={{ padding: "12px 15px" }}>{index + 1}</td>
                      <td style={{ padding: "12px 15px" }}>{task.title}</td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontWeight: "600",
                          color: task.status === "Pending" ? "#f6e05e" : "#48bb78",
                        }}
                      >
                        {task.status}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        {task.status === "Pending" ? (
                          <button
                            onClick={() => completeTask(task._id)}
                            style={{
                              backgroundColor: "#667eea",
                              border: "none",
                              color: "#fff",
                              padding: "8px 14px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "600",
                              transition: "background-color 0.3s",
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#4c51bf")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "#667eea")}
                          >
                            Complete
                          </button>
                        ) : (
                          <span style={{ fontWeight: "600", color: "#48bb78" }}>
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default EmployeeDashboard;
