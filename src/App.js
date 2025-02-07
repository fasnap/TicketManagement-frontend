import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import UserLogin from "./components/user/UserLogin";
import UserRegister from "./components/user/UserRegister";
import UserDashboard from "./components/user/UserDashboard";
import CreateTicket from "./components/user/CreateTicket";
import TicketDetail from "./components/user/TicketDetail";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminTicketDetail from "./components/admin/AdminTicketDetail";
import Home from "./components/user/Home";
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="" element={<Home />} />{" "}
            {/* Redirect to UserLogin page on initial load */}
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/ticket/create" element={<CreateTicket />} />
            <Route path="/user/ticket/:ticketId" element={<TicketDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/ticket/:ticketId"
              element={<AdminTicketDetail />}
            />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
