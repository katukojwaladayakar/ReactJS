const express = require('express');
const app = express();
const cors = require('cors');
const candidatesData = require('./candidatesData'); 
const PORT = 8080;

// ✅ Enable CORS for all origins (for development)
app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());

// Sample API route
app.get('/', (req, res) => {
  res.send('🚀 Node.js Backend is Running!');
});

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node backend!' });
});
app.post('/api/getcandidates', (req, res) => {
  const { id, name } = req.body; // Get from request body

  let filteredCandidates = candidatesData;

  if (id) {
    filteredCandidates = filteredCandidates.filter(
      c => String(c.Id).toLowerCase().includes(String(id).toLowerCase())
    );
  }

  if (name) {
    filteredCandidates = filteredCandidates.filter(
      c => c.name.toLowerCase().includes(String(name).toLowerCase())
    );
  }

  res.json(filteredCandidates);
});


app.post("/api/addcandidates", (req, res) => {
  const { name, benchStatus, inPlacement } = req.body;

  if (!name || !benchStatus || inPlacement === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Generate new Id
  const newId = candidatesData.length > 0 ? candidatesData[candidatesData.length - 1].Id + 1 : 1;

  const newCandidate = {
    Id: newId,
    name,
    benchStatus,
    inPlacement,
  };

  candidatesData.push(newCandidate);

  res.status(201).json(newCandidate);
});

app.get("/api/viewcandidates/:id", (req, res) => {
  const candidate = candidatesData.find(c => String(c.Id) === String(req.params.id));
  if (candidate) {
    res.json(candidate);
  } else {
    res.status(404).json({ message: "Candidate not found" });
  }
});

app.put("/api/updatecandidates/:id", (req, res) => {
  const { id } = req.params;
  const { name, benchStatus, inPlacement } = req.body;

  // Find candidate by matching ID as string (safe comparison)
  const candidateIndex = candidatesData.findIndex(c => String(c.Id) === String(id));

  if (candidateIndex === -1) {
    return res.status(404).json({ message: "Candidate not found" });
  }

  // Update candidate details
  candidatesData[candidateIndex] = {
    ...candidatesData[candidateIndex],
    name,
    benchStatus,
    inPlacement,
  };

  res.json({
    message: "Candidate updated successfully",
    updatedCandidate: candidatesData[candidateIndex],
  });
});

app.delete("/api/deletecandidates/:id", (req, res) => {
  const { id } = req.params;

  // Check if candidate exists
  const candidateIndex = candidatesData.findIndex(c => String(c.Id) === String(id));

  if (candidateIndex === -1) {
    return res.status(404).json({ message: "Candidate not found" });
  }

  // Remove candidate from array
  const deletedCandidate = candidatesData.splice(candidateIndex, 1)[0];

  res.json({
    message: "Candidate deleted successfully",
    deletedCandidate,
  });
});
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
