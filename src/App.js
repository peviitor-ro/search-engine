import { createHashRouter, RouterProvider } from "react-router-dom";
// Pages
import Landing from "./pages/Landing";
import Rezultate from "./pages/Rezultate";
import TermsOfUse from "./pages/TermsOfUse";
import Privacy from "./pages/Privacy";
// context
import { TagsProvider } from "./context/TagsContext";
const router = createHashRouter([
  {
    path: "",
    element: <Landing />
  },
  {
    path: "rezultate",
    element: <Rezultate />
  },
  {
    path: "conditii-de-utilizare",
    element: <TermsOfUse />
  },
  {
    path: "politica-de-confidentialitate",
    element: <Privacy />
  },
  {
    path: "*",
    element: <Landing />
  }
]);
function App() {
  return (
    <TagsProvider>
      <RouterProvider router={router} />
    </TagsProvider>
  );
}

export default App;
