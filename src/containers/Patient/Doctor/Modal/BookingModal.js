import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./BookingModel.scss";
// import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

const BookingModal = (props) => {
  let { language, isOpenModal, closeBookingModal, dataTime } = props;
  
  const [isShowLoading, setIsShowLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [reason, setReason] = useState("");
  const [birthday, setBirthday] = useState("");
  const [genders, setGenders] = useState("");
  const [selectedGenders, setSelectedGenders] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [timeType, setTimeType] = useState("");

  useEffect(() => {
    props.getGenders();
  }, []);

  const toggle = () => {
    props.toggleFromParent();
  };

  const builDataGender = (data) => {
    let result = [];
    let language = props.language;

    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  useEffect(() => {
    let doctorId =
      props.dataTime && !_.isEmpty(props.dataTime)
        ? props.dataTime.doctorId
        : "";
    let timeType =
      props.dataTime && !_.isEmpty(props.dataTime)
        ? props.dataTime.timeType
        : "";
    setDoctorId(doctorId);
    setTimeType(timeType);
  }, [props.dataTime]);

  useEffect(() => {
    setGenders(builDataGender(props.genders));
  }, [props.genders]);

  useEffect(() => {
    setGenders(builDataGender(props.genders));
  }, [props.genders]);

  const buildTimeBooking = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn

      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment.unix(+dataTime.date / 1000).locale('en').format("ddd - MM/DD/YYYY");

      return `${time} - ${date}`
    }
    return ''
  };

  const buildDoctorName = dataTime => {
    if(dataTime && !_.isEmpty(dataTime)) {
      let name = language === LANGUAGES.VI ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
      : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
      return name
    }
    return ''
  }

  const handleConfirmBooking = async () => {
    setIsShowLoading(true)
    let date = new Date(birthday).getTime();
    let timeString = buildTimeBooking(dataTime)
    let doctorName = buildDoctorName(dataTime)
    
    let dataBookingModal = {
      fullName,
      phoneNumber,
      email,
      address,
      reason,
      date: dataTime.date,
      birthday: date,
      doctorId,
      selectedGenders: selectedGenders.value,
      timeType,
      language,
      timeString,
      doctorName
    };

    let res = await postPatientBookAppointment(dataBookingModal);
    if (res && res.errCode === 0) {
      toast.success("Booking a new appointment succeed!");
      closeBookingModal();
    } else {
      toast.error("Booking a new appointment error!");
    }

    setIsShowLoading(false)
  };

  const handleOnChangeDatePicker = (date) => {
    setBirthday(date[0]);
  };

  const handleChangeSelect = (selectOption) => {
    setSelectedGenders(selectOption);
  };

  return (
    <LoadingOverlay 
      active={isShowLoading}
      spinner
      text="Loading..."
    >
      <Modal
        centered
        isOpen={isOpenModal}
        toggle={() => toggle()}
        className="booking-modal-container"
        size="lg"
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left"><FormattedMessage id="patient.booking-modal.title" /></span>
            <span className="right" onClick={closeBookingModal}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            {/* {JSON.stringify(dataTime)} */}
            <div className="doctor-infor">
              <ProfileDoctor
                doctorId={doctorId}
                isShowDescription={false}
                dataTime={dataTime}
                isShowLinkDetail={true}
                isShowPrice={true}
              />
            </div>
  
            <div className="row">
              <div className="col-6 form-group">
                <label><FormattedMessage id="patient.booking-modal.fullName" /></label>
                <input
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="col-6 form-group">
                <label><FormattedMessage id="patient.booking-modal.phoneNumber" /></label>
                <input
                  className="form-control"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="col-6 form-group">
                <label><FormattedMessage id="patient.booking-modal.email" /></label>
                <input
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-6 form-group">
                <label><FormattedMessage id="patient.booking-modal.address" /></label>
                <input
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="col-12 form-group">
                <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                <input
                  className="form-control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className="col-6 form-group">
                <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                <DatePicker
                  onChange={handleOnChangeDatePicker}
                  className="form-control"
                  value={birthday}
                  // minDate={yesterday}
                />
              </div>
              <div className="col-6 form-group">
                <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                <Select
                  value={selectedGenders}
                  onChange={handleChangeSelect}
                  options={genders}
                />
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => handleConfirmBooking()}
            >
              <FormattedMessage id="patient.booking-modal.confirm" />
            </button>
            <button className="btn-booking-cancel" onClick={closeBookingModal}>
            <FormattedMessage id="patient.booking-modal.cancel" />
            </button>
          </div>
        </div>
      </Modal>
    </LoadingOverlay>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
