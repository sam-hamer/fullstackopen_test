import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

const Menu = ({ handleLogout }) => {
  const padding = {
    paddingRight: 5,
  };

  const user = useSelector((state) => state.user);
  return (
    <div className="menuBar">
      <Link to="/" style={padding}>
        blogs
      </Link>
      <Link to="/users" style={padding}>
        users
      </Link>
      {user && (
        <>
          <span>{user.name} logged-in</span>
          <button onClick={handleLogout}>logout</button>
        </>
      )}
    </div>
  );
};

export default Menu;
