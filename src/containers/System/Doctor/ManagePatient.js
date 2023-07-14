import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss"
import DatePicker from "../../../components/Input/DatePicker";
import { getAllPatientForDoctor, postSendRemedy } from "../../../services/userService"
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import RemedyModal from './RemedyModal'
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay"

const ManagePatient = (props) => {
    let { language } = props;
    const [currentDate, setCurrentDate] = useState(moment(new Date()).startOf('day').valueOf())
    const [dataPatient, setDataPatient] = useState([])
    const [isOpenRemedyModal, setIsOpenRemedyModal] = useState(false)
    const [isShowLoading, setIsShowLoading] = useState(false)
    const [dataModal, setDataModal] = useState(false)

  useEffect(() => {
    getDataPatient()
  }, []);

  useEffect(async() => {
    await getDataPatient()
  },[currentDate])

  const getDataPatient = async() => {
    let { user } = props
    let formattedDate = new Date(currentDate).getTime()

    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formattedDate,
    });

    if(res && res.errCode === 0) {
        setDataPatient(res.data)
    }
}

  const handleOnChangeDatePicker = (date) => {
    // let { user } = props
    setCurrentDate(date[0]);
  };

  const handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      patientName: item.patientData.firstName,
      email: item.patientData.email,
      timeType: item.timeType,
    }
    setIsOpenRemedyModal(true)
    setDataModal(data)
  }

  const closeRemedyModal = () => {
    setIsOpenRemedyModal(false)
    setDataModal({})
  }

  const sendRemedy = async(dataChild) => {
    setIsShowLoading(true);

    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: props.language,
      patientName: dataModal.patientName
    })
    if(res && res.errCode === 0) {
      setIsShowLoading(false);
      toast.success("Send Remedy Succeeds:")
      await getDataPatient()
    } else {
      setIsShowLoading(false);
      toast.error("Send Remedy Error: ", res)
    }
  }
  
  return (
    <>
          <LoadingOverlay
            active={isShowLoading}
            spinner
            text="Loading ..."
      >
      <div className="manage-patient-container">
          <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
          <div className="manage-patient-body row">
              <div className="col-4 form-group">
                  <label>Chọn ngày khám</label>
                  <DatePicker
                onChange={handleOnChangeDatePicker}
                className="form-control"
                value={currentDate}
              />
              </div>
              <div className="col-12 table-manage-patient">
                  <table style={{ width:"100%" }}>
                      <tbody>
                          <tr>
                              <th>STT</th>
                              <th>Thời gian</th>
                              <th>Họ và tên</th>
                              <th>Địa chỉ</th>
                              <th>Giới tính</th>
                              <th>Actions</th>
                          </tr>
                      {dataPatient && dataPatient.length > 0 ? dataPatient.map((item, index) => {
                        let time = language === LANGUAGES.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn
                        let gender = language === LANGUAGES.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                        return(
                      <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{time}</td>
                          <td>{item.patientData.firstName}</td>
                          <td>{item.patientData.address}</td>
                          <td>{gender}</td>
                          <td>
                            <button className="mp-btn-confirm" onClick={() => handleBtnConfirm(item)}>Xác nhận</button>
                          </td>
                      </tr>
                      )}) : <tr>
                            <td colspan="6" style={{ textAlign: 'center' }}>No data</td>
                          </tr>}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
      <RemedyModal
      isOpenModal = {isOpenRemedyModal}
      dataModal = {dataModal}
      closeRemedyModal = {closeRemedyModal}
      sendRemedy = {sendRemedy}
      />
      </LoadingOverlay>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
