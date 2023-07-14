import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser


const TableManageUser = (props) => {
  const [usersRedux, setUsersRedux] = useState([]);
  useEffect(() => {
    props.fetchUsersRedux();
  }, []);

  useEffect(() => {
    setUsersRedux(props.listUsers);
  }, [props.listUsers]);

  const handleDeleteUser = (user) => {
    props.deleteAUserRedux(user.id)
  }

  const handleEditUser = (user) => {
    props.handleEditUserFromParentKey(user)
  }

  const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}

  return (
    <React.Fragment>
      <table id="TableManageUser">
        <tbody>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
  
          {usersRedux &&
            usersRedux.length > 0 &&
            usersRedux.map((item, i) => (
              <tr key={i}>
                <td>{item.email}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.address}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditUser(item)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteUser(item)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
  
    <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
