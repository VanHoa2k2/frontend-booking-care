import React, { Component, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS, getBase64, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import TableManageUser from "./TableManageUser";

function UserRedux(props) {
  const [genderArr, setGenderArr] = useState([]);
  const [positionArr, setPositionArr] = useState([]);
  const [roleArr, setRoleArr] = useState([]);
  const [previewImgURL, setPreviewImgURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userEditId, setUserEditId] = useState("");
  const [action, setAction] = useState("");

  let copyState = {
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    address,
    gender,
    position,
    role,
    avatar,
  };
  console.log(copyState)
  let language = props.language;
  let isGetGenders = props.isLoadingGender;

  useEffect(() => {
    props.getGenderStart();
    props.getPositionStart();
    props.getRoleStart();
  }, []);

  useEffect(() => {
    let arrGenders = props.genderRedux;
    setGenderArr(arrGenders);
    setGender(arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "");
  }, [props.genderRedux]);

  useEffect(() => {
    let arrPositions = props.positionRedux;
    setPositionArr(arrPositions);
    setPosition(
      arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ""
    );
  }, [props.positionRedux]);

  useEffect(() => {
    let arrRoles = props.roleRedux;
    setRoleArr(arrRoles);
    setRole(arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "");
  }, [props.roleRedux]);

  useEffect(() => {
    let arrGenders = props.genderRedux;
    let arrPositions = props.positionRedux;
    let arrRoles = props.roleRedux;

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setAddress("");
    setGender(arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "");
    setPosition(
      arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ""
    );
    setRole(arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "");

    setAction(CRUD_ACTIONS.CREATE)
    setPreviewImgURL('')
  }, [props.listUsers]);

  const handleOnChangeImage = async (e) => {
    let data = e.target.files;
    let file = data[0];

    if (file) {
      let base64 = await CommonUtils.getBase64(file)
      let ObjectURL = URL.createObjectURL(file);
      setPreviewImgURL(ObjectURL);
      setAvatar(base64);
    }
  };

  const openPreviewImage = () => {
    if (!previewImgURL) return;
    setIsOpen(true);
  };

  const handleSaveUser = () => {
    let isValid = checkValidateInput();
    if (isValid === false) return;

    if(action === CRUD_ACTIONS.CREATE) {
      //fire redux action
      props.createNewUser({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        address: address,
        phonenumber: phoneNumber,
        gender: gender,
        roleId: role,
        positionId: position,
        avatar: avatar,
      });
    }

    if(action === CRUD_ACTIONS.EDIT) {
      props.editAUserRedux({
        id: userEditId,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        address: address,
        phonenumber: phoneNumber,
        gender: gender,
        roleId: role,
        positionId: position,
        avatar: avatar,
      })
    } 


    props.fetchUsersRedux();
  };

  const checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
    ];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!copyState[arrCheck[i]]) {
        isValid = false;
        alert("this input is required : " + arrCheck[i]);
        break;
      }
    }
    return isValid;
  };

  const handleEditUserFromParent = (user) => {
    console.log(user)
    let imageBase64 = ''
    if(user.image) {
      imageBase64 = Buffer.from(user.image, 'base64').toString('binary')
    }

    setEmail(user.email);
    setPassword("HASHCODE");
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhoneNumber(user.phonenumber);
    setAddress(user.address);
    setGender(user.gender);
    setPosition(
      user.positionId
    );
    setRole(user.roleId);
    setAvatar('')
    setPreviewImgURL(imageBase64)
    setAction(CRUD_ACTIONS.EDIT)
    setUserEditId(user.id)
  }

  return (
    <div className="user-redux-container">
      <div className="title">User Redux</div>
      <div className="user-redux-body">
        <div className="container">
          <div className="row">
            <div className="col-12 my-3">
              <FormattedMessage id="manage-user.add" />
            </div>
            <div className="col-12">
              {isGetGenders ? "Loading genders" : ""}
            </div>

            <div className="col-3">
              <label>
                <FormattedMessage id="manage-user.email" />
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={action === CRUD_ACTIONS.EDIT ? true : false}
              />
            </div>
            <div className="col-3">
              <label>
                <FormattedMessage id="manage-user.password" />
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={action === CRUD_ACTIONS.EDIT ? true : false}
              />
            </div>
            <div className="col-3">
              <label>
                <FormattedMessage id="manage-user.first-name" />
              </label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="col-3">
              <label>
                <FormattedMessage id="manage-user.last-name" />
              </label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="col-3">
              <label>
                <FormattedMessage id="manage-user.phone-number" />
              </label>
              <input
                type="text"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="col-9">
              <label>
                <FormattedMessage id="manage-user.address" />
              </label>
              <input
                type="text"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="col-3">
              <label>
                <FormattedMessage id="manage-user.gender" />
              </label>
              <select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                {genderArr &&
                  genderArr.length > 0 &&
                  genderArr.map((item, i) => (
                    <option key={i} value={item.keyMap}>
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-3">
              <label>
                <FormattedMessage id="manage-user.position" />
              </label>
              <select
                className="form-control"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                {positionArr &&
                  positionArr.length > 0 &&
                  positionArr.map((item, i) => (
                    <option key={i} value={item.keyMap}>
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-3">
              <label>
                <FormattedMessage id="manage-user.role" />
              </label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {roleArr &&
                  roleArr.length > 0 &&
                  roleArr.map((item, i) => (
                    <option key={i} value={item.keyMap}>
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-3">
              <label>
                <FormattedMessage id="manage-user.image" />
              </label>
              <div className="preview-img-container">
                <input
                  id="previewImg"
                  type="file"
                  hidden
                  onChange={(e) => handleOnChangeImage(e)}
                />
                <label className="label-upload" htmlFor="previewImg">
                  Tải ảnh <i className="fas fa-upload"></i>
                </label>
                <div
                  className="preview-image"
                  style={{ backgroundImage: `url(${previewImgURL})` }}
                  onClick={() => openPreviewImage()}
                ></div>
              </div>
            </div>

            <div className="col-12 my-3">
              <button
                className={action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : "btn btn-primary"}
                onClick={() => handleSaveUser()}
              >
                {action === CRUD_ACTIONS.EDIT ? <FormattedMessage id="manage-user.edit" /> : <FormattedMessage id="manage-user.save" />}
              </button>
            </div>
            <div className="col-12 mb-5">
              <TableManageUser handleEditUserFromParentKey={handleEditUserFromParent} action={action}/>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={previewImgURL}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    positionRedux: state.admin.positions,
    roleRedux: state.admin.roles,
    isLoadingGender: state.admin.isLoadingGender,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    fetchUsersRedux: () => dispatch(actions.fetchAllUsersStart()),
    editAUserRedux: (data) => dispatch(actions.editAUser(data))
    // processLogout: () => dispatch(actions.processLogout()),
    // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
