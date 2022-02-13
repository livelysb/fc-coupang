import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PlayerRegistration from "./components/PlayerRegistration"
import TodayPlayer from "./components/TodayPlayer"
import MenuAppBar from "./components/global-components/MenuAppBar";
import TeamBuilding from "./components/TeamBuilding";
import MatchDashboard from "./components/MatchDashboard";


function App() {

    return (
        <Router>
            <div className="App">
                <MenuAppBar/>
                <Routes>
                    <Route exact path="/" element={<TodayPlayer/>}/>
                    <Route exact path="/match" element={<TeamBuilding/>}/>
                    <Route path="/dashboard" element={<MatchDashboard/>}/>
                    <Route exact path="/register" element={<PlayerRegistration/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
