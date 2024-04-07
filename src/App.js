import { createHashRouter, RouterProvider } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Rezultate from "./pages/Rezultate";
// context
import { TagsProvider } from "./context/TagsContext";

const router = createHashRouter([
  {
    path: "",
    element: <Landing />
  },
  {
    path: "*",
    element: <Landing />
  },
  {
    path: "rezultate",
    element: <Rezultate />
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
