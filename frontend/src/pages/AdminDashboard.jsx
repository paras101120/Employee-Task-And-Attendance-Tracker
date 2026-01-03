import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [analytics, setAnalytics] = useState({ present: 0, absent: 0, pendingTasks: 0, completedTasks: 0 });
  const navigate = useNavigate();

  const calculateAnalytics = (emps) => {
    let present = 0, absent = 0, pending = 0, completed = 0;
    emps.forEach(emp => {
      if (emp.attendance === "Present") present++;
      else if (emp.attendance === "Absent") absent++;
      emp.tasks.forEach(task => {
        if (task.status === "Pending") pending++;
        else if (task.status === "Completed") completed++;
      });
    });
    setAnalytics({ present, absent, pendingTasks: pending, completedTasks: completed });
  };

  const downloadCombinedCSV = () => {
    let csv = 'Attendance Report\n';
    csv += 'Name,Email,Attendance Status\n';
    employees.forEach(emp => {
      csv += `${emp.name},${emp.email},${emp.attendance || 'Not Marked'}\n`;
    });
    csv += '\nTasks Report\n';
    csv += 'Employee Name,Task Title,Status,Date\n';
    employees.forEach(emp => {
      emp.tasks.forEach(task => {
        csv += `${emp.name},${task.title},${task.status},${new Date(task.date).toLocaleDateString()}\n`;
      });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'combined_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadCombinedPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Report', 14, 15);
    const attendanceHeaders = ['Name', 'Email', 'Attendance Status'];
    const attendanceData = employees.map(emp => [emp.name, emp.email, emp.attendance || 'Not Marked']);
    autoTable(doc, {
      head: [attendanceHeaders],
      body: attendanceData,
      startY: 22,
      styles: { fontSize: 10 }
    });

    doc.addPage();
    doc.text('Tasks Report', 14, 15);
    const tasksHeaders = ['Employee Name', 'Task Title', 'Status', 'Date'];
    const tasksData = [];
    employees.forEach(emp => {
      emp.tasks.forEach(task => {
        tasksData.push([emp.name, task.title, task.status, new Date(task.date).toLocaleDateString()]);
      });
    });
    autoTable(doc, {
      head: [tasksHeaders],
      body: tasksData,
      startY: 22,
      styles: { fontSize: 10 }
    });

    doc.save('combined_report.pdf');
  };

  useEffect(() => {
    const fetchEmployeeActivity = async () => {
      try {
        const res = await API.get("/admin/employee-activity");
        setEmployees(res.data);
        calculateAnalytics(res.data);
        if (res.data.length > 0) setEmployeeId(res.data[0]._id);
      } catch (error) {
        console.error("Error fetching employee activity:", error.response?.data || error);
        alert(error.response?.data?.message || "Failed to fetch employee activity");
      }
    };

    fetchEmployeeActivity();
  }, []);

  const assignTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", { employeeId, title, description });
      alert("Task assigned successfully");
      setTitle("");
      setDescription("");
      const res = await API.get("/admin/employee-activity");
      setEmployees(res.data);
      calculateAnalytics(res.data);
    } catch (error) {
      console.error("Error assigning task:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to assign task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <h2 style={{ fontSize: "32px", fontWeight: "700", margin: 0 }}>
          Admin Dashboard
        </h2>
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

      <main
        style={{
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Analytics Section */}
        <section
          style={{
            marginBottom: "50px",
            padding: "20px",
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              marginBottom: "15px",
              fontWeight: "600",
              fontSize: "24px",
              color: "#f7fafc",
            }}
          >
            Basic Analytics
          </h3>
          <p style={{ margin: "8px 0", fontSize: "18px" }}>
            <strong>Attendance:</strong> Present: {analytics.present}, Absent: {analytics.absent}
          </p>
          <p style={{ margin: "8px 0", fontSize: "18px" }}>
            <strong>Tasks:</strong> Pending: {analytics.pendingTasks}, Completed: {analytics.completedTasks}
          </p>
          <div style={{ marginTop: "25px" }}>
            <button
              onClick={downloadCombinedCSV}
              style={{
                marginRight: "15px",
                backgroundColor: "#667eea",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#4c51bf")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#667eea")}
            >
              Download CSV
            </button>
            <button
              onClick={downloadCombinedPDF}
              style={{
                backgroundColor: "#48bb78",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#38a169")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#48bb78")}
            >
              Download PDF
            </button>
          </div>
        </section>

        {/* Task Assignment */}
        <section style={{ marginBottom: "50px" }}>
          <h3
            style={{
              marginBottom: "15px",
              fontWeight: "600",
              fontSize: "24px",
              color: "#f7fafc",
            }}
          >
            Assign Task
          </h3>
          <form
            onSubmit={assignTask}
            style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "450px" }}
          >
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              style={{
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.6)",
                fontSize: "16px",
                outline: "none",
                backgroundColor: "rgba(255,255,255,0.95)",
                color: "#1a202c",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.6)")}
            >
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.6)",
                fontSize: "16px",
                outline: "none",
                backgroundColor: "rgba(255,255,255,0.95)",
                color: "#1a202c",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.6)")}
            />

            <input
              type="text"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.6)",
                fontSize: "16px",
                outline: "none",
                backgroundColor: "rgba(255,255,255,0.95)",
                color: "#1a202c",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.6)")}
            />

            <button
              type="submit"
              style={{
                backgroundColor: "#667eea",
                color: "#fff",
                padding: "14px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#4c51bf")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#667eea")}
            >
              Assign Task
            </button>
          </form>
        </section>

        {/* Employee Activity Table */}
        <section>
          <h3
            style={{
              marginBottom: "15px",
              fontWeight: "600",
              fontSize: "24px",
              color: "#f7fafc",
            }}
          >
            Employee Activity
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "15px",
                color: "#fff",
                minWidth: "700px",
              }}
            >
              <thead style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                <tr>
                  <th style={{ padding: "12px 15px", textAlign: "left" }}>Sr No</th>
                  <th style={{ padding: "12px 15px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "12px 15px", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "12px 15px", textAlign: "left" }}>Attendance</th>
                  <th style={{ padding: "12px 15px", textAlign: "left" }}>Tasks</th>
                </tr>
              </thead>
              <tbody>
                {employees.filter(emp => emp.tasks.length > 0).length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        fontStyle: "italic",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      No employees with assigned tasks.
                    </td>
                  </tr>
                ) : (
                  employees.filter(emp => emp.tasks.length > 0).map((emp, index) => (
                    <tr
                      key={emp._id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.1)" : "transparent",
                      }}
                    >
                      <td style={{ padding: "12px 15px" }}>{index + 1}</td>
                      <td style={{ padding: "12px 15px" }}>{emp.name}</td>
                      <td style={{ padding: "12px 15px" }}>{emp.email}</td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontWeight: "600",
                          color:
                            emp.attendance === "Present"
                              ? "#48bb78"
                              : emp.attendance === "Absent"
                              ? "#f56565"
                              : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {emp.attendance || "N/A"}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        {emp.tasks.length === 0
                          ? "No tasks"
                          : emp.tasks
                              .map(
                                (t) =>
                                  `${t.title} (${t.status}) - ${new Date(
                                    t.date
                                  ).toLocaleDateString()}`
                              )
                              .join(", ")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
