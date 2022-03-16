import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import PlayerRegistration from "./components/PlayerRegistration"
import TodayPlayer from "./components/TodayPlayer"
import MenuAppBar from "./components/global-components/MenuAppBar";
import TeamBuilding from "./components/TeamBuilding";
import MatchDashboard from "./components/MatchDashboard";
import MatchHistory from "./components/MatchHistory";
import MatchHistoryDetail from "./components/MatchHistoryDetail";
import PlayerHistory from "./components/PlayerHistory";


function App() {

    return (
        <Router>
            <div className="App">
                <MenuAppBar/>
                <Routes>
                    <Route exact path="/" element={<TodayPlayer/>}/>
                    <Route exact path="/match-record" element={<TeamBuilding/>}/>
                    <Route exact path="/match-history" element={<MatchHistory/>}/>
                    <Route exact path="/match-history-detail" element={<MatchHistoryDetail/>}/>
                    <Route path="/dashboard" element={<MatchDashboard/>}/>
                    <Route exact path="/player-history" element={<PlayerHistory/>}/>
                    <Route exact path="/player-register" element={<PlayerRegistration/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
