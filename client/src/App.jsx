import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login"
import Dashboard from "./pages/students/Dashboard";
import NotFound from "./pages/NotFound";
import Notes from "./pages/students/Notes";
import Notifications from "./pages/students/Notifications";
import Profile from "./pages/students/Profile";
import Leaderboard from "./pages/students/Leaderboard";
import CodingStats from "./pages/students/CodingStats";
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path = "/" element = {<Login/>}/> 
        <Route path = "/student/dashboard" element = {<Dashboard/>} />
        <Route path = "/student/notes" element = {<Notes/>} />
        <Route path = "/student/notifications" element = {<Notifications/>} />
        <Route path = "/student/profile" element = {<Profile/>} />
        <Route path = "/student/leaderboard" element = {<Leaderboard/>} />
        <Route path = "/student/coding-stats" element = {<CodingStats/>} />
        <Route path ='*' element = {<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
