import Login from "./pages/Login"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import StudentHome from "./pages/students/Home";
import FacultyHome from "./pages/faculty/Home";


function App() {

  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Login/>}/> 
        <Route path = "/pages/student/home" element = {<StudentHome/>} />
        <Route path = "/pages/faculty/home" element = {<FacultyHome/>} />
      </Routes>
    </Router>
  )
}

export default App
