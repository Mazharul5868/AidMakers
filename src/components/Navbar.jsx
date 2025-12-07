import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">LoanFlow</div>
      </div>

      <nav className="navbar-center">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            "nav-link" + (isActive ? " active" : "")
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/loans"
          className={({ isActive }) =>
            "nav-link" + (isActive ? " active" : "")
          }
        >
          Loans
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            "nav-link" + (isActive ? " active" : "")
          }
        >
          Profile
        </NavLink>
      </nav>

      <div className="navbar-right">
        <div className="user-avatar">U</div>
        <span className="user-name">John Doe</span>
      </div>
    </header>
  );
};

export default Navbar;
