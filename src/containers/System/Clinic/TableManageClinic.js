import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageClinic.scss";
import * as actions from "../../../store/actions";
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import { getAllClinic } from "../../../services/userService";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser


const TableManageClinic = (props) => {
  const [listClinic, setListClinic] = useState([]);

  useEffect(() => {
    const callApiGetAllClinic = async() => {
      const res = await getAllClinic()
      setListClinic(res.data);
    }
    callApiGetAllClinic()
  }, [listClinic])

  const handleDeleteUser = (user) => {
    props.deleteAUserRedux(user.id)
  }

  const handleEditClinic = (clinic) => {
    props.handleEditClinicFromParentKey(clinic)
  }

  return (
    <React.Fragment>
      <table id="TableManageClinic">
        <tbody>
          <tr>
            <th>STT</th>
            <th>Tên phòng khám</th>
            <th>Địa chỉ phòng khám</th>
            <th>Actions</th>
          </tr>
  
          {listClinic &&
            listClinic.length > 0 &&
            listClinic.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditClinic(item)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteUser(item)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUsersRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageClinic);
