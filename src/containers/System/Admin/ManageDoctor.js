import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./ManageDoctor.scss";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { getDetailInforDoctor } from "../../../services/userService";
const mdParser = new MarkdownIt(/* Markdown-it options */);

const ManageDoctor = (props) => {
  // save to markdown table
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [contentHTML, setContentHTML] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [description, setDescription] = useState("");
  const [hasOldData, setHasOldData] = useState(false);
  const [listDoctors, setListDoctors] = useState([]);
  const [listClinic, setListClinic] = useState([]);
  const [listSpecialty, setListSpecialty] = useState([]);
  
  // save to doctor table
  const [listPrice, setListPrice] = useState([]);
  const [listPayment, setListPayment] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [nameClinic, setNameClinic] = useState("");
  const [addressClinic, setAddressClinic] = useState("");
  const [note, setNote] = useState("");
  const [clinic, setClinic] = useState("");
  const [specialty, setSpecialty] = useState("");
  
  // select infor doctor
  // const [selectedDoctorInfor, setSelectedDoctorInfor] = useState({
  //   selectedPrice,
  //   selectedPayment,
  //   selectedProvince,
  // });

  useEffect(() => {
    props.fetchAllDoctors();
    props.getRequiredDoctorInfor();
  }, []);

  useEffect(() => {
    let dataSelect = buildDataInputSelect(props.allDoctors, "USERS");
    setListDoctors(dataSelect);
  }, [props.allDoctors]);

  useEffect(() => {
    let dataSelect = buildDataInputSelect(props.allDoctors, "USERS");
    let { resPrice, resPayment, resProvince } = props.allRequiredDoctorInfor;
    let dataSelectPrice = buildDataInputSelect(resPrice, "PRICE");
    let dataSelectPayment = buildDataInputSelect(resPayment, "PAYMENT");
    let dataSelectProvince = buildDataInputSelect(resProvince, "PROVINCE");

    setListDoctors(dataSelect);
    setListPrice(dataSelectPrice);
    setListPayment(dataSelectPayment);
    setListProvince(dataSelectProvince);
  }, [props.language]);

  useEffect(() => {
    let { resPrice, resPayment, resProvince, resSpecialty, resClinic } =
      props.allRequiredDoctorInfor;
    let dataSelectPrice = buildDataInputSelect(resPrice, "PRICE");
    let dataSelectPayment = buildDataInputSelect(resPayment, "PAYMENT");
    let dataSelectProvince = buildDataInputSelect(resProvince, "PROVINCE");
    let dataSelectSpecialty = buildDataInputSelect(resSpecialty, "SPECIALTY");
    let dataSelectClinic = buildDataInputSelect(resClinic, "CLINIC");

    setListPrice(dataSelectPrice);
    setListPayment(dataSelectPayment);
    setListProvince(dataSelectProvince);
    setListSpecialty(dataSelectSpecialty);
    setListClinic(dataSelectClinic)
  }, [props.allRequiredDoctorInfor]);

  function handleEditorChange({ html, text }) {
    setContentMarkdown(text);
    setContentHTML(html);
  }

  const handleSaveContentMarkdown = () => {
    props.saveDetailDoctor({
      contentHTML: contentHTML,
      contentMarkdown: contentMarkdown,
      description: description,
      doctorId: selectedDoctor.value,
      action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectedPrice: selectedPrice.value,
      selectedPayment: selectedPayment.value,
      selectedProvince: selectedProvince.value,
      nameClinic: nameClinic,
      addressClinic: addressClinic,
      note: note,
      clinicId:
        selectedClinic && selectedClinic.value ? selectedClinic.value : "",
      specialtyId: selectedSpecialty.value,
    });
  };

  const buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = props;
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        });
      }
      if (type === "PRICE") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }

      if (type === "PAYMENT" || type === "PROVINCE") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }

      if (type === "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }

      if (type === "CLINIC") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
    }
    return result;
  };

  const handleChangeSelect = async (selectedOption) => {
    setSelectedDoctor(selectedOption);

    let res = await getDetailInforDoctor(selectedOption.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;
      console.log(res.data)
      let addressClinic = "",
        nameClinic = "",
        note = "",
        paymentId = "",
        priceId = "",
        provinceId = "",
        selectedPrice = "",
        selectedPayment = "",
        selectedProvince = "",
        specialtyId = "",
        selectedSpecialty = "",
        clinicId = "",
        selectedClinic = ""

      if (res.data.Doctor_infor) {
        addressClinic = res.data.Doctor_infor.addressClinic;
        nameClinic = res.data.Doctor_infor.nameClinic;
        note = res.data.Doctor_infor.note;
        priceId = res.data.Doctor_infor.priceId;
        paymentId = res.data.Doctor_infor.paymentId;
        provinceId = res.data.Doctor_infor.provinceId;
        specialtyId = res.data.Doctor_infor.specialtyId;
        clinicId = res.data.Doctor_infor.clinicId;

        selectedPrice = listPrice.find(
          (item) => item && item.value === priceId
        );
        selectedPayment = listPayment.find(
          (item) => item && item.value === paymentId
        );
        selectedProvince = listProvince.find(
          (item) => item && item.value === provinceId
        );
        selectedSpecialty = listSpecialty.find(
          (item) => item && item.value === +specialtyId
        );
        selectedClinic = listClinic.find(
          (item) => item && item.value === +clinicId
        );
      }

      setContentHTML(markdown.contentHTML);
      setContentMarkdown(markdown.contentMarkdown);
      setDescription(markdown.description);
      setHasOldData(true);
      setNameClinic(nameClinic);
      setAddressClinic(addressClinic);
      setNote(note);
      setSelectedPrice(selectedPrice);
      setSelectedPayment(selectedPayment);
      setSelectedProvince(selectedProvince);
      setSelectedSpecialty(selectedSpecialty);
      setSelectedClinic(selectedClinic);
    } else {
      setContentHTML("");
      setContentMarkdown("");
      setDescription("");
      setHasOldData(false);
      setNameClinic("");
      setAddressClinic("");
      setNote("");
      setSelectedPrice("");
      setSelectedPayment("");
      setSelectedProvince("");
      setSelectedSpecialty("");
      setSelectedClinic("");
    }
  };

  const handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    if (name.name === "selectedPrice") {
      setSelectedPrice(selectedOption);
    } else if (name.name === "selectedPayment") {
      setSelectedPayment(selectedOption);
    } else if (name.name === "selectedProvince") {
      setSelectedProvince(selectedOption);
    } else if (name.name === "selectedSpecialty") {
      setSelectedSpecialty(selectedOption);
    } else if (name.name === "selectedClinic") {
      setSelectedClinic(selectedOption);
    }
  };

  const handleOnChangeText = (e, id) => {
    if (id === "description") {
      setDescription(e.target.value);
    } else if (id === "nameClinic") {
      setNameClinic(e.target.value);
    } else if (id === "addressClinic") {
      setAddressClinic(e.target.value);
    } else if (id === "note") {
      setNote(e.target.value);
    }
  };

  return (
    <div className="manage-doctor-container">
      <div className="manage-doctor-title">
        <FormattedMessage id="admin.manage-doctor.title" />
      </div>
      <div className="more-info">
        <div className="content-left form-group">
          <label>
            <FormattedMessage id="admin.manage-doctor.select-doctor" />
          </label>
          <Select
            value={selectedDoctor}
            onChange={handleChangeSelect}
            options={listDoctors}
            placeholder={
              <FormattedMessage id="admin.manage-doctor.select-doctor" />
            }
          />
        </div>
        <div className="content-right">
          <label>
            <FormattedMessage id="admin.manage-doctor.intro" />
          </label>
          <textarea
            onChange={(e) => handleOnChangeText(e, "description")}
            value={description}
            className="form-control"
          ></textarea>
        </div>
      </div>
      <div className="more-info-extra">
        <div className="row">
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.price" />
            </label>
            <Select
              value={selectedPrice}
              onChange={handleChangeSelectDoctorInfor}
              options={listPrice}
              placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
              name="selectedPrice"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.payment" />
            </label>
            <Select
              value={selectedPayment}
              onChange={handleChangeSelectDoctorInfor}
              options={listPayment}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.payment" />
              }
              name="selectedPayment"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.province" />
            </label>
            <Select
              value={selectedProvince}
              onChange={handleChangeSelectDoctorInfor}
              options={listProvince}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.province" />
              }
              name="selectedProvince"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.nameClinic" />
            </label>
            <input
              className="form-control"
              onChange={(e) => handleOnChangeText(e, "nameClinic")}
              value={nameClinic}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.addressClinic" />
            </label>
            <input
              className="form-control"
              onChange={(e) => handleOnChangeText(e, "addressClinic")}
              value={addressClinic}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.note" />
            </label>
            <input
              className="form-control"
              onChange={(e) => handleOnChangeText(e, "note")}
              value={note}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-4 form-group">
          <label>
            <FormattedMessage id="admin.manage-doctor.specialty" />
          </label>
          <Select
            value={selectedSpecialty}
            onChange={handleChangeSelectDoctorInfor}
            options={listSpecialty}
            placeholder={
              <FormattedMessage id="admin.manage-doctor.specialty" />
            }
            name="selectedSpecialty"
          />
        </div>
        <div className="col-4 form-group">
          <label>
            <FormattedMessage id="admin.manage-doctor.select-clinic" />
          </label>
          <Select
            value={selectedClinic}
            onChange={handleChangeSelectDoctorInfor}
            options={listClinic}
            placeholder={
              <FormattedMessage id="admin.manage-doctor.select-clinic" />
            }
            name="selectedClinic"
          />
        </div>
      </div>

      <div className="manage-doctor-editor">
        <MdEditor
          style={{ height: "300px" }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
          value={contentMarkdown}
        />
      </div>

      <button
        onClick={() => handleSaveContentMarkdown()}
        className={hasOldData ? "save-content-doctor" : "create-content-doctor"}
      >
        {hasOldData ? (
          <span>
            <FormattedMessage id="admin.manage-doctor.save" />
          </span>
        ) : (
          <span>
            <FormattedMessage id="admin.manage-doctor.add" />
          </span>
        )}
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctorAct(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
