import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageHandbook.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { createNewHandbook ,deleteHandbook,editHandbook} from "../../../services/userService";
import { toast } from "react-toastify";
import TableManageHandbook from "./TableManageHandbook";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

const mdParser = new MarkdownIt(/* Markdown-it options */);

const ManageHandbook = () => {
    const [name, setName] = useState("");
    const [describe, setDescribe] = useState("");
    const [imageBase64, setImageBase64] = useState("");
    const [descriptionHtml, setDescriptionHtml] = useState("");
    const [descriptionMarkdown, setDescriptionMarkdown] = useState("");
    const [handbookEditId, setHandbookEditId] = useState("");
  
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
    
      const handleSaveHandbook = async () => {
        
        if(action === CRUD_ACTIONS.CREATE) {
          let res = await createNewHandbook({
            name,
            imageBase64,
            describe,
            descriptionHtml,
            descriptionMarkdown,
          });
          if (res && res.errCode === 0) {
            toast.success("Add new handbook success!");
            setName("");
            setDescribe("");
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
          let res = await editHandbook({
            id: handbookEditId,
            name,
            imageBase64,
            describe,
            descriptionHtml,
            descriptionMarkdown,
          })
          console.log(res);
          if (res && res.errCode === 0) {
            toast.success("edit handbook success!");
            setName("");
            setDescribe("");
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
    
      const handleEditHandbookFromParent = (handbook) => {
        setName(handbook.name);
        setDescribe(handbook.describe);
        setDescriptionHtml(handbook.descriptionHtml);
        setDescriptionMarkdown(handbook.descriptionMarkdown);
        setImageBase64("");
        setPreviewImgURL(handbook.image);
        setAction(CRUD_ACTIONS.EDIT);
        setHandbookEditId(handbook.id);
      };

      const deleteAHandbookFromParent = async (handbookId) => {
        let res = await deleteHandbook(handbookId)
        if (res && res.errCode === 0) {
          toast.success("delete handbook success!");
        } else {
          toast.error("Something wrongs....");
        }
      }

    return (
        <div className="manage-specialty-container">
          <div className="ms-title">Quản lý cẩm nang</div>
    
          <div className="add-new-specialty row">
            <div className="col-6 form-group">
              <label>Tên cẩm nang</label>
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
              <label>Mô tả</label>
              <input
                className="form-control"
                type="text"
                value={describe}
                onChange={(e) => setDescribe(e.target.value)}
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
                onClick={() => handleSaveHandbook()}
              >
                {action === CRUD_ACTIONS.EDIT ? (
                  <FormattedMessage id="manage-handbook.edit" />
                ) : (
                  <FormattedMessage id="manage-handbook.save" />
                )}
              </button>
            </div>
          </div>
    
          <TableManageHandbook
            handleEditHandbookFromParentKey={handleEditHandbookFromParent}
            deleteAHandbookFromParentKey={deleteAHandbookFromParent}
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
    
    export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);