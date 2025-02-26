import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Homepage from "./pages/homepage/homepage";
import Userlist from "./pages/userlist";
import Transactionlist from "./pages/transactionlist";
import { Chat } from "./components/chat";
import Service from "./pages/services";
import Login from "./pages/login/login";
import Sidebar from "./components/sidebar/sidebar";
import Header from "./components/header";
import NewUser from "./pages/newUser/NewUser";
import Deposit from "./components/deposit";
import UserActivities from "./pages/useractivities";

export default function App() {
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={isAuth ? <Navigate to="/homepage" /> : <Login />}
          />
        </Routes>
        {isAuth ? (
          <>
            <Header />
            <div
              className="container"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <Sidebar />
              <div
                style={{
                  width: "100%",
                  padding: "40px",
                  backgroundColor: "rgba(0,0,0,0.15)",
                }}
              >
                <Routes>
                  <Route
                    path="/homepage"
                    element={isAuth ? <Homepage /> : <Login />}
                  />
                  <Route
                    path="/users"
                    element={isAuth ? <Userlist /> : <Login />}
                  />
                  <Route
                    path="/transactions"
                    element={isAuth ? <Transactionlist /> : <Login />}
                  />
                  <Route path="/chat" element={isAuth ? <Chat /> : <Login />} />
                  <Route
                    path="/services"
                    element={isAuth ? <Service /> : <Login />}
                  />
                  <Route
                    path="/addUser"
                    element={isAuth ? <NewUser /> : <Login />}
                  />
                  <Route
                    path="/deposit"
                    element={isAuth ? <Deposit /> : <Login />}
                  />
                  <Route
                    path="/activities"
                    element={isAuth ? <UserActivities /> : <Login />}
                  />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Navigate to="/login" />
        )}
      </div>
    </Router>
  );
}
