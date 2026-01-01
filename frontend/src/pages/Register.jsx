import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    await API.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    alert("Registration successful");
    navigate("/");
  } catch (error) {
    alert(error.response?.data?.message || "Error");
  }
};

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        /><br/>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select><br/>

        <button type="submit">Register</button>
      </form>

      <p onClick={() => navigate("/")} style={{ cursor: "pointer", color: "blue" }}>
        Back to Login
      </p>
    </div>
  );
}

export default Register;
