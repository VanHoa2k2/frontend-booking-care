import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import {  CommonUtils } from "../../../utils";
import { createNewSpecialty } from "../../../services/userService"
import { toast } from "react-toastify";

const mdParser = new MarkdownIt(/* Markdown-it options */);

const ManageSpecialty = (props) => {
    const [name, setName] = useState('')
    const [imageBase64, setImageBase64] = useState('')
    const [descriptionHtml, setDescriptionHtml] = useState('')
    const [descriptionMarkdown, setDescriptionMarkdown] = useState('')

  useEffect(() => {}, []);

  function handleEditorChange({ html, text }) {
    setDescriptionMarkdown(text);
    setDescriptionHtml(html);
  }

  const handleOnChangeImage = async (e) => {
    let data = e.target.files;
    let file = data[0];

    if (file) {
      let base64 = await CommonUtils.getBase64(file)
      setImageBase64(base64);
    }
  };

  const handleSaveNewSpecialty = async() => {
    let res = await createNewSpecialty({
        name,
        imageBase64,
        descriptionHtml,
        descriptionMarkdown,
    })
    if(res && res.errCode === 0) {
        toast.success('Add new specialty success!')
        setName('')
        setImageBase64('')
        setDescriptionHtml('')
        setDescriptionMarkdown('')
    } else {
        toast.error('Something wrongs....')
        console.log(res)
    }
  }

  return (
    <div className="manage-specialty-container">
      <div className="ms-title">Quản lý chuyên khoa</div>

      <div className="add-new-specialty row">
        <div className="col-6 form-group">
          <label>Tên chuyên khoa</label>
          <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="col-6 form-group">
          <label>Ảnh chuyên khoa</label>
          <input className="form-control-file" type="file" onChange={(e) => handleOnChangeImage(e)} />
        </div>
        <div className="col-12">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              value={descriptionMarkdown}
          />
        </div>
      <div className="col-12">
        <button className="btn-save-specialty" onClick={() => handleSaveNewSpecialty()}>Save</button>
      </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
