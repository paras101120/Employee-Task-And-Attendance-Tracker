import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch tasks assigned to employee
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/my-tasks"); // Make sure backend route exists
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error);
    }
  };

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error.response?.data || error);
    }
  };

  // Fetch today's attendance
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

  // Complete task
  const completeTask = async (taskId) => {
    try {
      await API.put(`/tasks/${taskId}/complete`);
      alert("Task completed successfully");
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error("Error completing task:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to complete task");
    }
  };

  // Mark attendance
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

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee Dashboard</h2>
      {user && <h3>Welcome, {user.name}</h3>}

      {/* Logout */}
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {/* Attendance */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Mark Attendance</h3>
        <button
          onClick={() => markAttendance("Present")}
          disabled={attendanceMarked}
          style={{ marginRight: "10px" }}
        >
          Mark Present
        </button>
        <button
          onClick={() => markAttendance("Absent")}
          disabled={attendanceMarked}
        >
          Mark Absent
        </button>
      </div>

      {/* Tasks */}
      <div>
        <h3>My Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status === "Pending" ? (
                      <button onClick={() => completeTask(task._id)}>Complete</button>
                    ) : (
                      "Completed"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
