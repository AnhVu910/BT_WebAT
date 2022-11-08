import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./userManage.scss";
import { getAllUsersAPi } from "../../services/userService";
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUser: [],
    };
  }

  async componentDidMount() {
    let response = await getAllUsersAPi("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUser: response.listUsers,
      });
    }
  }

  render() {
    let arrUser = this.state.arrUser;
    return (
      <div className="users-container">
        <div className="title text-center">Manage User</div>
        <div className="user-table mt-4 mx-3">
          <table id="customers">
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
            </tr>

            {arrUser &&
              arrUser.map((item, index) => {
                return (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td>{item.phone}</td>
                  </tr>
                );
              })}
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
