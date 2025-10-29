import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCandidate.css";

const AddCandidate: React.FC = () => {
  const [name, setName] = useState("");
  const [benchStatus, setBenchStatus] = useState("Active");
  const [inPlacement, setInPlacement] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    name,
    benchStatus,
    inPlacement: inPlacement ? "Yes" : "No", // convert boolean to string
  };

  const response = await fetch("http://localhost:8080/api/addcandidates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    alert("Candidate added successfully!");
    navigate("/"); // go back to candidate list
  } else {
    const error = await response.json();
    alert("Error: " + error.message);
  }
};


  return (
     <div className="add-candidate-container">
      <h2>Add Candidate</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter candidate name"
            required
          />
        </div>

        <div>
          <label>Bench Status:</label>
          <select
            value={benchStatus}
            onChange={(e) => setBenchStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label>In Placement:</label>
          <input
            type="checkbox"
            checked={inPlacement}
            onChange={(e) => setInPlacement(e.target.checked)}
          />
        </div>

        <button type="submit">Add Candidate</button>
      </form>
    </div>
  );
};

export default AddCandidate;
