import React from "react";
import DirectoryView from "./DirectoryView";
import Register from "./Register";
import "./App.css";
import Login from "./Login";
import { Route, Routes } from "react-router-dom";
import AdminPage from "./AdminPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DirectoryView />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/directory/:dirId" element={<DirectoryView />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}

export default App;
