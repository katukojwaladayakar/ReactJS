import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CandidateList from './components/candidatelist';
import EditCandidate from './components/editcandidate';
import AddCandidate from './components/addcandidate';

const App: React.FC = () => {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<CandidateList />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/edit-candidate/:id" element={<EditCandidate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
