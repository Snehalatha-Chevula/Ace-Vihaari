import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login"
import Dashboard from "./pages/students/Dashboard";
import NotFound from "./pages/NotFound";
import Notes from "./pages/common/Notes";
import Notifications from "./pages/common/Notifications";
import ProfilePage from "./pages/common/Profile";
import LeaderboardPage from "./pages/common/Leaderboard";
import CodingStats from "./pages/students/CodingStats";
import { Toaster } from 'react-hot-toast';
import Students from "./pages/faculty/Students";
import { useEffect } from "react";
import axios from "axios";
import { useUser } from "./context/userContext";

function App() {
  console.log("app rendered");
  const { setUser, setLoading } = useUser();
  useEffect(()=>{
    const fetch = async ()=> {
      try{
        console.log("before api call");
        const res = await axios.get('api/auth/me');
        console.log("res",res);
        setUser(res.data);
      }
      catch(e){
        console.log("user not loged in",e);
      }
      finally {
        setLoading(false); 
      }
     }
  fetch();
  },[]);
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>

        <Route path = "/" element = {<Login/>}/> 
        <Route path = "/student/dashboard" element = {<Dashboard/>} />
        <Route path = "/student/notes" element = {<Notes/>} />
        <Route path = "/student/notifications" element = {<Notifications/>} />
        <Route path = "/student/profile" element = {<ProfilePage/>} />
        <Route path = "/student/leaderboard" element = {<LeaderboardPage/>} />
        <Route path = "/student/coding-stats" element = {<CodingStats/>} />
        <Route path ='*' element = {<NotFound/>}/>

        <Route path = "/faculty/notes" element = {<Notes/>} />
        <Route path = "/faculty/notifications" element = {<Notifications/>} />
        <Route path = "/faculty/profile" element = {<ProfilePage/>} />
        <Route path = "/faculty/leaderboard" element = {<LeaderboardPage/>} />
        <Route path = "/faculty/students" element = {<Students/>} />

      </Routes>
    </Router>
  )
}

export default App;
