import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout, reset } from "./features/auth/authSlice";
import "driver.js/dist/driver.min.css";
import {
  Welcome,
  Register,
  Login,
  Calendar,
  History,
  Checkout,
  Dash,
  AdminHistory,
  Profile,
} from "./pages";
import { Navbar, Footer, AdminNavbar } from "./components";
import "./App.css";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [info, setInfo] = useState([]);

  const userNotFound = "Request failed with status code 302";

  const dispatch = useDispatch();

  const UserById = async () => {
    useEffect(() => {
      if (user) {
        axios
          .get("/api/user/" + user._id)
          .then((res) => {
            setData(res.data);
          })
          .catch((error) => {
            if (error.message === userNotFound) {
              dispatch(logout());
              dispatch(reset());
            }
          });
      }
    }, [user]);
  };
  UserById();

  useEffect(() => {
    const fetchUpdate = async () => {
      await axios.get(`/api/schedule/payment/user/balance/update/${user._id}`);
    };
    fetchUpdate();
  }, [data]);

  const ProtectedRoute = ({ children }) => {
    if (data.isAdmin === false) {
      return <Navigate to="/auth/login" />;
    }

    return children;
  };

  return (
    <>
      <Router>
        {user && data.isAdmin === false ? <Navbar /> : ""}
        {data.isAdmin === true ? <AdminNavbar /> : ""}

        <Routes>
          <Route
            path="/"
            element={user ? <Calendar data={data} /> : <Welcome />}
          />
          <Route
            path="/profile"
            element={user ? <Profile data={data} /> : <Welcome />}
          />
          <Route
            path="/checkout"
            element={user && data.isAdmin === false ? <Checkout /> : <Login />}
          />
          <Route
            path="/calendar"
            element={user ? <Calendar data={data} /> : <Login />}
          />
          <Route
            path="/auth/login"
            element={user ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/auth/register"
            element={user ? <Navigate to={"/"} /> : <Register />}
          />
          <Route
            path="/schedules"
            element={user && data.isAdmin === false ? <History /> : <Login />}
          />

          <Route
            path="/admin"
            element={
              user ? (
                <ProtectedRoute>
                  <Dash data={data} />
                </ProtectedRoute>
              ) : (
                <Navigate to={"/auth/login"} />
              )
            }
          />

          <Route
            path="/admin/history"
            element={
              user ? (
                <ProtectedRoute>
                  <AdminHistory data={data} />
                </ProtectedRoute>
              ) : (
                <Navigate to={"/auth/login"} />
              )
            }
          />
        </Routes>
        {user && data.isAdmin === false ? <Footer /> : ""}
      </Router>
    </>
  );
}

export default App;
