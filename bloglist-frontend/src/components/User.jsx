import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useMatch,
  useNavigate,
} from 'react-router-dom';

const User = ({ user }) => {
  return (
    <>
      <Link to={`/users/${user.id}`} className="usersListItem">
        <div>{user.name}</div>
      </Link>
      <div>{user.blogs.length}</div>
    </>
  );
};

export default User;
