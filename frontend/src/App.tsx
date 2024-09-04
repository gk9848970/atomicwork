import Dropdown from "./components/dropdown/dropdown";
import "./css/reset.css";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <Dropdown url={"http://localhost:3000/roles"} searchMode={"external"} />
    </div>
  );
}

export default App;
