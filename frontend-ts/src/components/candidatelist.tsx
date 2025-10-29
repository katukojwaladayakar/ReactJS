import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./candidatelist.css"; 

// 1. Define the shape of a candidate
interface Candidate {
  Id: number;
  name: string;
  benchStatus: string;
  inPlacement: boolean;
}

const CandidateList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

     const handleAdd = () => {
    navigate(`/add-candidate`);
  };
  
     const handleEdit = (id: number) => {
    navigate(`/edit-candidate/${id}`);
  };
   const handleDelete = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8080/api/deletecandidates/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete candidate');
    }

    const result = await response.json();
    console.log(result.message); // Optional: show success message

    // Option 1: Refresh the list by refetching candidates
    setCandidates((prev) => prev.filter((c) => c.Id !== id));

    // Option 2: Navigate to home or another page
    // navigate('/'); // Only if you want to redirect
  } catch (error) {
    console.error('Error deleting candidate:', error);
  }
};
 useEffect(() => {
    // Focus the input on component mount
    inputRef.current?.focus();
  }, []);

  // 2. Fetch data from the API
  useEffect(() => {
  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const payload: { id?: string; name?: string } = {};

      // Decide whether it's an ID or a Name
      if ( searchQuery) {
        // If it contains only digits, treat as ID
        if (/^\d+$/.test(searchQuery)) {
          payload.id = searchQuery;
        } else {
          payload.name = searchQuery;
        }
      }

      const response = await fetch('http://localhost:8080/api/getcandidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Candidate[] = await response.json();
      setCandidates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const timeout = setTimeout(() => {
    fetchCandidates();
  }, 300); // debounce 300ms

  return () => clearTimeout(timeout);
}, [searchQuery]);



  // 3. Render the data
  if (loading) return <p>Loading candidates...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
     <div className="container">
      <div className="header">
        <h2>Candidate List</h2>
        <div style={{ margin: '10px 0' }}>
          <input
            type="text"
            ref={inputRef} 
            placeholder="Search by ID or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '300px',
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom: '10px'
            }}
          />
        </div>

        <button className="add-btn" onClick={() => handleAdd()}>Add Candidate</button>
      </div>

      <table className="candidate-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Bench Status</th>
            <th>In Placement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.Id}>
              <td>{c.Id}</td>
              <td>{c.name}</td>
             <td>
          <span
            className={
              c.benchStatus?.toLowerCase() === "active"
                ? "status active"
                : "status in-active"
            }
          >
            {c.benchStatus || "N/A"}
          </span>
        </td>


                <td>{c.inPlacement}</td>
              <td>
                 <div style={{ display: "flex", gap: "10px" }}>
                <button className="edit-btn" onClick={() => handleEdit(c.Id)}>
                  Edit
                </button>
                <button className="edit-btn" onClick={() => handleDelete(c.Id)}>
                  Delete
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


  );
};

export default CandidateList;
