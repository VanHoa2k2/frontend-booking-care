import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { FormattedMessage } from "react-intl";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { toast } from "react-toastify";
import moment from "moment";
import { CommonUtils } from "../../../utils";

const RemedyModal = (props) => {
  let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = props;
  const [email, setEmail] = useState("");
  const [imgBase64, setImgBase64] = useState("");

  useEffect(() => {
    if (dataModal) {
      setEmail(dataModal.email);
    }
  }, []);

  useEffect(() => {
    setEmail(dataModal.email);
  }, [dataModal]);

  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangeImage = async (e) => {
    let data = e.target.files;
    let file = data[0];

    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      setImgBase64(base64);
    }
  };

  const handleSendRemedy = () => {
    sendRemedy({
        email, 
        imgBase64
    })
    closeRemedyModal()
  }

  return (
    <Modal
      centered
      isOpen={isOpenModal}
      className="booking-modal-container"
      size="md"
    >
      <div className="modal-header">
        <h5 className="modal-title">Gởi hóa đơn khám bệnh thành công</h5>
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={closeRemedyModal}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <ModalBody>
        <div className="row">
          <div className="col-6 form-group">
            <label>Email bệnh nhân</label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleOnchangeEmail(e)}
            />
          </div>
          <div className="col-6 form-group">
            <label>Chọn file đon thuốc</label>
            <input
              className="form-control-file"
              type="file"
              onChange={(e) => handleOnChangeImage(e)}
            />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => handleSendRemedy()}>
          Send
        </Button>{" "}
        <Button color="secondary" onClick={closeRemedyModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
