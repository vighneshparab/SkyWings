import { HashRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
