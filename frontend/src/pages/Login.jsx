import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate(res.data.role === "admin" ? "/admin" : "/employee");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #ffffff, #e6e8ff)',
        padding: '50px 35px',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        transition: 'transform 0.3s, box-shadow 0.3s'
      }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
        }}
      >
        <h2 style={{
          color: '#1e1e2f',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '10px'
        }}>Welcome Back</h2>
        <p style={{
          color: '#555',
          marginBottom: '30px'
        }}>Login to your account to continue</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '16px',
              width: '100%',
              boxSizing: 'border-box',
              transition: 'all 0.3s',
              boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)'
            }}
            onFocus={e => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.boxShadow = '0 0 10px rgba(99,102,241,0.3)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.05)';
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '16px',
              width: '100%',
              boxSizing: 'border-box',
              transition: 'all 0.3s',
              boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)'
            }}
            onFocus={e => {
              e.target.style.borderColor = '#6366f1';
              e.target.style.boxShadow = '0 0 10px rgba(99,102,241,0.3)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.05)';
            }}
          />

          <button
            type="submit"
            style={{
              padding: '16px',
              background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}
            onMouseOver={e => {
              e.target.style.background = 'linear-gradient(90deg, #4f46e5, #3730a3)';
              e.target.style.transform = 'scale(1.03)';
              e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={e => {
              e.target.style.background = 'linear-gradient(90deg, #6366f1, #4f46e5)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            }}
          >
            Login
          </button>
        </form>

        <p
          onClick={() => navigate("/register")}
          style={{
            marginTop: '25px',
            color: '#6366f1',
            cursor: 'pointer',
            fontWeight: '500',
            textDecoration: 'underline',
            transition: 'color 0.3s'
          }}
          onMouseOver={e => e.currentTarget.style.color = '#4f46e5'}
          onMouseOut={e => e.currentTarget.style.color = '#6366f1'}
        >
          Register
        </p>
      </div>
    </div>
  );
}

export default Login;
