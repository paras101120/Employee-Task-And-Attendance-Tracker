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

  // Calculate analytics
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

  // Download CSV
  const downloadCSV = (data, filename) => {
    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Download Combined CSV
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

  // Download Combined PDF
  const downloadCombinedPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Report', 10, 10);
    const attendanceHeaders = ['Name', 'Email', 'Attendance Status'];
    const attendanceData = employees.map(emp => [emp.name, emp.email, emp.attendance || 'Not Marked']);
    autoTable(doc, {
      head: [attendanceHeaders],
      body: attendanceData,
      startY: 20,
    });

    doc.addPage();
    doc.text('Tasks Report', 10, 10);
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
      startY: 20,
    });

    doc.save('combined_report.pdf');
  };

  // Fetch employees + their activity
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

  // Assign task to employee
  const assignTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", { employeeId, title, description });
      alert("Task assigned successfully");
      setTitle("");
      setDescription("");

      // Refresh employee activity to show new task
      const res = await API.get("/admin/employee-activity");
      setEmployees(res.data);
      calculateAnalytics(res.data);
    } catch (error) {
      console.error("Error assigning task:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to assign task");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {/* Analytics */}
      <h3>Basic Analytics</h3>
      <div style={{ marginBottom: "30px", border: "1px solid #ccc", padding: "10px" }}>
        <p><strong>Attendance:</strong> Present: {analytics.present}, Absent: {analytics.absent}</p>
        <p><strong>Tasks:</strong> Pending: {analytics.pendingTasks}, Completed: {analytics.completedTasks}</p>
        <h4>Download Reports</h4>
        <button onClick={downloadCombinedCSV} style={{ marginRight: "10px" }}>Attendance & Tasks CSV</button>
        <button onClick={downloadCombinedPDF}>Attendance & Tasks PDF</button>
      </div>

      {/* Task Assignment */}
      <h3>Assign Task</h3>
      <form onSubmit={assignTask} style={{ marginBottom: "30px" }}>
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        >
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.email})
            </option>
          ))}
        </select>
        <br />
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />
        <input
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />
        <button type="submit">Assign Task</button>
      </form>

      {/* Employee Activity Table */}
      <h3>Employee Activity</h3>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Attendance</th>
            <th>Tasks</th>
          </tr>
        </thead>
        <tbody>
          {employees.filter(emp => emp.tasks.length > 0).length === 0 ? (
            <tr>
              <td colSpan="5">No employees with assigned tasks.</td>
            </tr>
          ) : (
            employees.filter(emp => emp.tasks.length > 0).map((emp, index) => (
              <tr key={emp._id}>
                <td>{index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.attendance || "N/A"}</td>
                <td>
                  {emp.tasks.length === 0
                    ? "No tasks"
                    : emp.tasks
                        .map((t) => `${t.title} (${t.status}) - ${new Date(t.date).toLocaleDateString()}`)
                        .join(", ")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
