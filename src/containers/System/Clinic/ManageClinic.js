import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { createNewSpecialty, editClinic, getAllClinic } from "../../../services/userService";
import { toast } from "react-toastify";
import { createNewClinic } from "../../../services/userService";
import TableManageClinic from "./TableManageClinic";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

const mdParser = new MarkdownIt(/* Markdown-it options */);

const ManageClinic = (props) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [descriptionMarkdown, setDescriptionMarkdown] = useState("");
  const [clinicEditId, setClinicEditId] = useState("");

  const [previewImgURL, setPreviewImgURL] = useState("");
  const [action, setAction] = useState();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setAction(CRUD_ACTIONS.CREATE)
  },[])

  function handleEditorChange({ html, text }) {
    setDescriptionMarkdown(text);
    setDescriptionHtml(html);
  }

  const openPreviewImage = () => {
    if (!previewImgURL) return;
    setIsOpen(true);
  };

  const handleOnChangeImage = async (e) => {
    let data = e.target.files;
    let file = data[0];

    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let ObjectURL = URL.createObjectURL(file);
      setPreviewImgURL(ObjectURL);
      setImageBase64(base64);
    }
  };

  const handleSaveClinic = async () => {
    
    if(action === CRUD_ACTIONS.CREATE) {
      let res = await createNewClinic({
        name,
        imageBase64,
        address,
        descriptionHtml,
        descriptionMarkdown,
      });
      if (res && res.errCode === 0) {
        toast.success("Add new clinic success!");
        setName("");
        setAddress("");
        setImageBase64("");
        setDescriptionHtml("");
        setDescriptionMarkdown("");
        setPreviewImgURL("")

      } else {
        toast.error("Something wrongs....");
        console.log(res);
      }
    }

    if(action === CRUD_ACTIONS.EDIT) {
      let res = await editClinic({
        id: clinicEditId,
        name,
        imageBase64,
        address,
        descriptionHtml,
        descriptionMarkdown,
      })
      console.log(res);
      if (res && res.errCode === 0) {
        toast.success("edit clinic success!");
        setName("");
        setAddress("");
        setImageBase64("");
        setDescriptionHtml("");
        setDescriptionMarkdown("");
        setPreviewImgURL("")
        setAction(CRUD_ACTIONS.CREATE)
      } else {
        toast.error("Something wrongs....");
        console.log(res);
      }
    }
  };

  const handleEditClinicFromParent = (clinic) => {
    setName(clinic.name);
    setAddress(clinic.address);
    setDescriptionHtml(clinic.descriptionHtml);
    setDescriptionMarkdown(clinic.descriptionMarkdown);
    setImageBase64("");
    setPreviewImgURL(clinic.image);
    setAction(CRUD_ACTIONS.EDIT);
    setClinicEditId(clinic.id);
  };

  return (
    <div className="manage-specialty-container">
      <div className="ms-title">Quản lý phòng khám</div>

      <div className="add-new-specialty row">
        <div className="col-6 form-group">
          <label>Tên phòng khám</label>
          <input
            className="form-control"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-2 preview-img-container">
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
        <div className="col-6 form-group">
          <label>Địa chỉ phòng khám</label>
          <input
            className="form-control"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="col-12">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            value={descriptionMarkdown}
          />
        </div>
        <div className="col-12 my-3">
          <button
            className={
              action === CRUD_ACTIONS.EDIT
                ? "btn btn-warning"
                : "btn btn-primary"
            }
            onClick={() => handleSaveClinic()}
          >
            {action === CRUD_ACTIONS.EDIT ? (
              <FormattedMessage id="manage-clinic.edit" />
            ) : (
              <FormattedMessage id="manage-clinic.save" />
            )}
          </button>
        </div>
      </div>

      <TableManageClinic
        handleEditClinicFromParentKey={handleEditClinicFromParent}
        action={action}
      />
      {isOpen && (
        <Lightbox
          mainSrc={previewImgURL}
          onCloseRequest={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
