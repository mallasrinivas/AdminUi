import "./index.css";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

const UserDetails = (props) => {
  const { userDetailsInfo } = props;
  const { id, name, email, role } = userDetailsInfo;
  return (
    <tbody className="font-monospace">
      <tr key={id}>
        <th scope="row">
          <input type="checkbox" />
        </th>
        <td>{name}</td>
        <td>{email}</td>
        <td>{role}</td>
        <td className="justify-content-center ">
          <button className="button m-1">
            <FiEdit />
          </button>
          <button className="button">
            <AiOutlineDelete />
          </button>
        </td>
      </tr>
    </tbody>
  );
};

export default UserDetails;
