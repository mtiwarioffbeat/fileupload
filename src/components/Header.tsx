"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";
import { LuLogOut } from "react-icons/lu";
const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
            // data-bs-toggle="dropdown"
            // aria-expanded="false"
            >
              <span className="text-white fw-bold p-4">U</span>
            </div>
          </div>
          {/* <div className="dropdown">
            <div
              className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
              style={{ width: "40px", height: "40px", cursor: "pointer" }}
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="text-white fw-bold">U</span>
            </div>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="profileDropdown"
            >
              <li>
                <a className="dropdown-item" href="/settings">
                  Settings
                </a>
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div> */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
