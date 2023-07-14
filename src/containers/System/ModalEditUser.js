import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../utils/emitter";
import _ from "lodash";

const ModalEditUser = (props) => {
  const [id, setId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const dataModal = {id,email,password,firstName,lastName,address}

  const toggle = () => {
    props.toggleFromParent();
  };

  useEffect(() => {
    let user = props.currentUser
    if(user && !_.isEmpty(user)) {
      setId(user.id)
      setEmail(user.email)
      setPassword('harcode')
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setAddress(user.address)
    }
  },[props.currentUser])

  const listenToEmitter = () => {
    emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
      // reset state
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setAddress('')
    })
  }
  useEffect(() => {
    listenToEmitter()
  },[])

  const checkValideInput = () => {
    let isValid = true
    let arrInput = ['email','password','firstName','lastName','address']
    for(let i = 0; i < arrInput.length; i++) {
      if(!dataModal[arrInput[i]]) {
        isValid = false
        alert('Missing parameter: ' + arrInput[i])
        break
      }
    }
    return isValid
  }

  const handleSaveUser = () => {
    let isValid = checkValideInput()
    if(isValid === true) {
      //call api create modal
      props.editUser(dataModal)
    }
  }

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={() => toggle()}
      className="modal-user-container"
      size="lg"
      centered
    >
      <ModalHeader toggle={() => toggle()}>Edit a new user</ModalHeader>
      <ModalBody>
        <div className="modal-user-body">
          <div className="input-container">
            <label>Email</label>
            <input type="text" value={email} disabled onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="input-container">
            <label>Password</label>
            <input type="text" value={password} disabled onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="input-container">
            <label>First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
          </div>
          <div className="input-container">
            <label>Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
          </div>
          <div className="input-container max-w-input">
            <label>Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" className="px-3" onClick={() => handleSaveUser()}>
          Save changes
        </Button>{" "}
        <Button color="secondary" className="px-3" onClick={() => toggle()}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
