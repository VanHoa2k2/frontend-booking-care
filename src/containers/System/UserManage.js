import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./userManage.scss";
import {
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
} from "../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
import { emitter } from "../../utils/emitter";

const UserManage = (props) => {
  const [arrUsers, setArrUsers] = useState([]);
  const [isOpenModalUser, setIsOpenModalUser] = useState(false);
  const [isOpenModalEditUser, setIsOpenModalEditUser] = useState(false);
  const [userEdit, setUserEdit] = useState({});
  useEffect(() => {
    getAllUsersFromReact();
  }, []);

  const getAllUsersFromReact = async () => {
    const response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      setArrUsers(response.users);
    }
  };
  getAllUsersFromReact();

  const handleAddNewUser = () => {
    setIsOpenModalUser(true);
  };

  const toggleUserModal = () => {
    setIsOpenModalUser(!isOpenModalUser);
  };

  const createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        setIsOpenModalUser(false);
        emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const toggleUserEditModal = () => {
    setIsOpenModalEditUser(!isOpenModalEditUser)
  }

  const handleDeleteUser = async (user) => {
    try {
      let res = await deleteUserService(user.id);
      if (res && res.errCode !== 0) {
        alert(res.errMessage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditUser = async(user) => {
    setIsOpenModalEditUser(true)
    setUserEdit(user)
  }

  const doEditUser = async(user) => {
    try {
      let res = await editUserService(user);
      console.log(res)
      if (res && res.errCode === 0) {
        setIsOpenModalEditUser(false)
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="users-container">
      <ModalUser
        isOpen={isOpenModalUser}
        toggleFromParent={toggleUserModal}
        createNewUser={createNewUser}
      />
      <ModalEditUser
        isOpen={isOpenModalEditUser}
        toggleFromParent={toggleUserEditModal}
        currentUser={userEdit}
        editUser={doEditUser}
      />
      <div className="title text-content">Hello</div>
      <div className="mx-1">
        <button
          className="btn btn-primary px-3"
          onClick={() => handleAddNewUser()}
        >
          <i className="fas fa-plus"></i> Add new user
        </button>
      </div>
      <div className="users-table mt-3 mx-1">
        <table id="customers">
          <tbody>
            <tr>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
            {arrUsers &&
              arrUsers.map((item, i) => (
                <tr key={i}>
                  <td>{item.email}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.address}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEditUser(item)}>Edit</button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
