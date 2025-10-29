import React , { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import "./AddCandidate.css";

interface Candidate {
  Id: number;
  name: string;
  benchStatus: string;
  inPlacement: boolean;
}
const EditCandidate = () => {
 const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [name, setName] = useState("");
  const [benchStatus, setBenchStatus] = useState("Active");
  const [inPlacement, setInPlacement] = useState(false);

  // 🟢 Fetch candidate data for editing
  useEffect(() => {
    fetch(`http://localhost:8080/api/viewcandidates/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCandidate(data);
        setName(data.name);
        setBenchStatus(data.benchStatus);
        setInPlacement(data.inPlacement);
      })
      .catch((err) => console.error("Error fetching candidate:", err));
  }, [id]);

  // 🟢 Handle Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCandidate = {
        id,
      name,
      benchStatus,
       inPlacement: inPlacement ? "Yes" : "No",
    };

    const response = await fetch(`http://localhost:8080/api/updatecandidates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCandidate),
    });

    if (response.ok) {
      alert("Candidate updated successfully!");
      navigate("/"); // navigate back to list
    } else {
      alert("Error updating candidate!");
    }
  };

  if (!candidate) return <div>Loading candidate details...</div>;

  return (
    <div className="add-candidate-container">
      <h2>Edit Candidate</h2>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Bench Status:</label>
          <select
            value={benchStatus}
            onChange={(e) => setBenchStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group checkbox">
          <label>In Placement:</label>
          <input
            type="checkbox"
            checked={inPlacement}
            onChange={(e) => setInPlacement(e.target.checked)}
          />
        </div>

        <button type="submit" className="add-btn">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditCandidate;
