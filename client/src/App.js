// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { useSelector } from "react-redux";
// import Homepage from './pages/homepage/homepage';
// import Login from './pages/login/login';
// import Return from './pages/returnVnpay';

// function App() {
//   const isAuth = Boolean(useSelector((state) => state.token));
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           <Route
//             path="/login"
//             element={isAuth ? <Navigate to="/homepage" /> : <Login />}
//           />
//         </Routes>
//         {isAuth ? (
//           <>
//             <Routes>
//                   <Route path="/homepage" element={<Homepage /> } />
//                   <Route path="/deposit/vnpay_return" element={<Return/>}/>
//             </Routes>
//           </>
//         ) : <Navigate to ="/login"/>}
//       </div>
//     </Router>
//   );
// }

// export default App;
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Homepage from "./pages/homepage/homepage";
import Login from "./pages/login/login";
import Return from "./pages/returnVnpay";
import RFIDHandler from "./components/RFIDHandler";

function App() {
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={isAuth ? <Navigate to="/homepage" /> : <Login />}
          />
          <Route
            path="/homepage"
            element={isAuth ? <Homepage /> : <Navigate to="/login" />}
          />
          <Route
            path="/deposit/vnpay_return"
            element={isAuth ? <Return /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={<Navigate to={isAuth ? "/homepage" : "/login"} />}
          />
        </Routes>
        {isAuth && <RFIDHandler />}
      </div>
    </Router>
  );
}

export default App;
