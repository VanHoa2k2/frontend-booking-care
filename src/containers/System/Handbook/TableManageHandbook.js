import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageHandbook.scss";
import * as actions from "../../../store/actions";
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import { getAllHandbook } from "../../../services/userService";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser


const TableManageHandbook = (props) => {
  const [listHandbook, setListHandbook] = useState([]);

  useEffect(() => {
    const callApiGetAllHandbook = async() => {
      const res = await getAllHandbook()
      setListHandbook(res.data);
    }
    callApiGetAllHandbook()
  }, [listHandbook])

  const handleDeleteHandbook = (Handbook) => {
    props.deleteAHandbookFromParentKey(Handbook.id)
  }

  const handleEditHandbook = (Handbook) => {
    props.handleEditHandbookFromParentKey(Handbook)
  }

  return (
    <React.Fragment>
      <table id="TableManageHandbook">
        <tbody>
          <tr>
            <th>STT</th>
            <th>Tên cầm nang</th>
            <th>Mô tả</th>
            <th>Actions</th>
          </tr>
  
          {listHandbook &&
            listHandbook.length > 0 &&
            listHandbook.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.describe}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditHandbook(item)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteHandbook(item)}>Delete</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageHandbook);
