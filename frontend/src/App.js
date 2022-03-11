import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PlayerRegistration from "./components/PlayerRegistration"
import TodayPlayer from "./components/TodayPlayer"
import MenuAppBar from "./components/global-components/MenuAppBar";
import TeamBuilding from "./components/TeamBuilding";
import MatchDashboard from "./components/MatchDashboard";
import MatchHistory from "./components/MatchHistory";


function App() {

    return (
        <Router>
            <div className="App">
                <MenuAppBar/>
                <Routes>
                    <Route exact path="/" element={<TodayPlayer/>}/>
                    <Route exact path="/match-record" element={<TeamBuilding/>}/>
                    <Route exact path="/match-history" element={<MatchHistory/>}/>
                    <Route path="/dashboard" element={<MatchDashboard/>}/>
                    <Route exact path="/player-history" element={<PlayerRegistration/>}/>
                    <Route exact path="/player-register" element={<PlayerRegistration/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
