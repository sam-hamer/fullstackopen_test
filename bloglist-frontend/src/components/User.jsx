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
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link to={`/users/${user.id}`} className="text-blue-600 hover:text-blue-900">
          {user.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.blogs.length}</td>
    </tr>
  );
};

export default User;
