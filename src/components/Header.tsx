"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { LuLogOut } from "react-icons/lu";
import { Logout } from "@/services/UserService";
const Header = () => {
  const router = useRouter();

const handleLogout= async ()=>{
    await Logout()
     router.push("/auth/login");
}
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm">
        <div className="container-fluid">
          <div>
            <span className="navbar-brand mb-0 h1">UserAuth</span>
          </div>

          <div className="d-flex align-items-center justify-content-center">
            <LuLogOut size={40} />
            <button
              className="dropdown-item text-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div
              className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px", cursor: "pointer" }}
              id="profileDropdown"
            >
              <span className="text-white fw-bold p-4">U</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
