import React, { useState } from "react";
import axios from "axios";

const HireMeForm = () => {
  const [formData, setFormData] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    company_name: "",
    role: "",
    offered_salary: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const fadeOut = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    fadeOut();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/hire/",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setStatus({
        type: "success",
        message: "Hire request sent successfully!"
      });
      console.log("Server response:", response.data);

      // Reset form after success
      setFormData({
        applicant_name: "",
        applicant_email: "",
        applicant_phone: "",
        company_name: "",
        role: "",
        offered_salary: "",
        message: ""
      });
    } catch (error) {
      if (error.response) {
        console.error("Backend error response:", error.response.data);
        setErrors(error.response.data);
        setStatus({
          type: "error",
          message: "Please correct the highlighted fields"
        });
      } else {
        console.error("Request error:", error.message);
        setStatus({
          type: "error",
          message: "Request failed. Please try again."
        });
      }
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const formStyle = {
    maxWidth: "500px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    transition: "all 0.4s ease",
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20px)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    margin: "8px 0",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(241, 245, 249, 0.7)",
    outline: "none"
  };

  const focusStyle = {
    border: "1px solid #38bdf8",
    boxShadow: "0 0 0 3px rgba(56, 189, 248, 0.2)"
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    marginTop: "1rem",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: loading
      ? "#94a3b8"
      : "linear-gradient(135deg, #38bdf8, #4ade80)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  };

  const statusStyle = {
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "1rem",
    textAlign: "center",
    fontWeight: "500",
    background:
      status?.type === "success"
        ? "rgba(52, 211, 153, 0.2)"
        : "rgba(248, 113, 113, 0.2)",
    color: status?.type === "success" ? "#065f46" : "#991b1b",
    border:
      status?.type === "success"
        ? "1px solid #34d399"
        : "1px solid #f87171",
    opacity: status ? 1 : 0,
    transition: "opacity 0.3s ease",
    height: status ? "auto" : "0",
    overflow: "hidden"
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "1.75rem",
          fontWeight: "700",
          marginBottom: "1.5rem",
          background: "linear-gradient(135deg, #38bdf8, #4ade80)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent"
        }}
      >
        Let's Work Together
      </h2>

      <div style={statusStyle}>{status?.message}</div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          name="applicant_name"
          placeholder="Your Name *"
          value={formData.applicant_name}
          onChange={handleChange}
          style={{
            ...inputStyle,
            ...(errors.applicant_name && { border: "1px solid #f87171" })
          }}
          onFocus={(e) =>
            (e.target.style = { ...inputStyle, ...focusStyle })
          }
          onBlur={(e) => (e.target.style = inputStyle)}
          required
        />
        {errors.applicant_name && (
          <small style={{ color: "#f87171", fontSize: "0.875rem" }}>
            {errors.applicant_name}
          </small>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          name="applicant_email"
          placeholder="Your Email *"
          value={formData.applicant_email}
          onChange={handleChange}
          style={{
            ...inputStyle,
            ...(errors.applicant_email && { border: "1px solid #f87171" })
          }}
          onFocus={(e) =>
            (e.target.style = { ...inputStyle, ...focusStyle })
          }
          onBlur={(e) => (e.target.style = inputStyle)}
          required
        />
        {errors.applicant_email && (
          <small style={{ color: "#f87171", fontSize: "0.875rem" }}>
            {errors.applicant_email}
          </small>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="tel"
          name="applicant_phone"
          placeholder="Phone (+2547xxxxxxx) *"
          value={formData.applicant_phone}
          onChange={handleChange}
          style={{
            ...inputStyle,
            ...(errors.applicant_phone && { border: "1px solid #f87171" })
          }}
          onFocus={(e) =>
            (e.target.style = { ...inputStyle, ...focusStyle })
          }
          onBlur={(e) => (e.target.style = inputStyle)}
          required
        />
        {errors.applicant_phone && (
          <small style={{ color: "#f87171", fontSize: "0.875rem" }}>
            {errors.applicant_phone}
          </small>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          name="company_name"
          placeholder="Company Name *"
          value={formData.company_name}
          onChange={handleChange}
          style={{
            ...inputStyle,
            ...(errors.company_name && { border: "1px solid #f87171" })
          }}
          onFocus={(e) =>
            (e.target.style = { ...inputStyle, ...focusStyle })
          }
          onBlur={(e) => (e.target.style = inputStyle)}
          required
        />
        {errors.company_name && (
          <small style={{ color: "#f87171", fontSize: "0.875rem" }}>
            {errors.company_name}
          </small>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          name="role"
          placeholder="Role (e.g., Software Engineer) *"
          value={formData.role}
          onChange={handleChange}
          style={{
            ...inputStyle,
            ...(errors.role && { border: "1px solid #f87171" })
          }}
          onFocus={(e) =>
            (e.target.style = { ...inputStyle, ...focusStyle })
          }
          onBlur={(e) => (e.target.style = inputStyle)}
          required
        />
        {errors.role && (
          <small style={{ color: "#f87171", fontSize: "0.875rem" }}>
            {errors.role}
          </small>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          name="offered_salary"
          placeholder="Offered Salary (USD) *"
          value={formData.offered_salary}
          onChange={handleChange}
          style={{
            ...inputStyle,
            ...(errors.offered_salary && { border: "1px solid #f87171" })
          }}
          onFocus={(e) =>
            (e.target.style = { ...inputStyle, ...focusStyle })
          }
          onBlur={(e) => (e.target.style = inputStyle)}
          required
        />
        {errors.offered_salary && (
          <small style={{ color: "#f87171", fontSize: "0.875rem" }}>
            {errors.offered_salary}
          </small>
        )}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <textarea
          name="message"
          placeholder="Tell me about the opportunity..."
          value={formData.message}
          onChange={handleChange}
          rows="4"
          style={{
            ...inputStyle,
            minHeight: "100px",
            resize: "vertical"
          }}
          onFocus={(e) =>
            (e.target.style = {
              ...inputStyle,
              ...focusStyle,
              minHeight: "100px"
            })
          }
          onBlur={(e) =>
            (e.target.style = { ...inputStyle, minHeight: "100px" })
          }
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={buttonStyle}
        onMouseEnter={(e) =>
          !loading &&
          (e.target.style.boxShadow =
            "0 4px 6px rgba(0, 0, 0, 0.1)")
        }
        onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
      >
        {loading ? (
          <>
            <span
              style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                border: "2px solid white",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}
            />
            Sending...
          </>
        ) : (
          "Send Opportunity"
        )}
      </button>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
};

export default HireMeForm;
