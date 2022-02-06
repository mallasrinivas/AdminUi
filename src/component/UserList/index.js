import { Component } from "react";
import "./index.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import UserDetails from "../UserDetails";
import __ from "lodash";

const pageSize = 10;

class UserList extends Component {
  state = { users: [], paginatedUsers: 0, currentPage: 1, searchValue: "" };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const userData = response.data;
      this.setState({ users: userData });
      this.setState({
        paginatedUsers: __(userData).slice(0).take(pageSize).value(),
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  pagination = (pageNo) => {
    const { users } = this.state;
    this.setState({ currentPage: pageNo });
    const startIndex = (pageNo - 1) * pageSize;
    const paginatedUsers = __(users).slice(startIndex).take(pageSize).value();
    this.setState({ paginatedUsers: paginatedUsers });
  };

  onCLickNextPage = () => {
    const { currentPage } = this.state;
    const nextPage = currentPage + 1;
    this.pagination(nextPage);
  };

  onCLickPreviousPage = () => {
    const { currentPage } = this.state;
    const nextPage = currentPage - 1;
    this.pagination(nextPage);
  };

  handleChange = (event) => {
    const searchInput = event.target.value;
    this.setState({ searchValue: searchInput });
  };

  render() {
    const { users, paginatedUsers, currentPage, searchValue } = this.state;
    const pageCount = users ? Math.ceil(users.length / pageSize) : 0;
    if (pageCount === 1) return null;
    const pages = __.range(1, pageCount + 1);
    return (
      <div className="container-fluid m-2">
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Search by name, email or role"
          onChange={this.handleChange}
        />
        {!paginatedUsers ? (
          <div className="d-flex justify-content-center">
            <div className="failure-page-container">
              <img
                className="failure-view-image"
                alt="failure view"
                src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
              />
              <p className="failure-view-comment">Something thing went wrong</p>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr className=" font-monospace table-primary">
                  <th scope="col">
                    <input type="checkbox" />
                  </th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              {paginatedUsers
                .filter((val) => {
                  if (searchValue === "") {
                    return val;
                  } else if (
                    val.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) ||
                    val.email
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) ||
                    val.role.toLowerCase().includes(searchValue.toLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((eachUser, index) => (
                  <UserDetails key={index} userDetailsInfo={eachUser} />
                ))}
            </table>
            <nav>
              <ul className="pagination justify-content-center align-items-center">
                <li className="page-item m-1">
                  <button
                    disabled={currentPage <= 1 ? this.state.currentPage : null}
                    className="page-link page-border"
                    onClick={() => this.onCLickPreviousPage()}
                  >
                    &laquo;
                  </button>
                </li>
                {pages.map((page, index) => (
                  <li
                    key={index}
                    className="page-item m-2"
                    onClick={() => this.pagination(page)}
                  >
                    <button className="page-link page-border">{page}</button>
                  </li>
                ))}
                <li className="page-item m-1">
                  <button
                    disabled={
                      currentPage >= pageCount ? this.state.currentPage : null
                    }
                    className="page-link page-border"
                    onClick={() => this.onCLickNextPage()}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    );
  }
}
export default UserList;
