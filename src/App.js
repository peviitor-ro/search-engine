import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Rezultate from "./pages/Rezultate";
// context
import { TagsProvider } from "./context/TagsContext";
function App() {
  return (
    <TagsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/rezultate" element={<Rezultate />} />
        </Routes>
      </Router>
    </TagsProvider>
  );
}

export default App;
