import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import moment from "moment";
import localization from "moment/locale/vi";
import { LANGUAGES } from "../../../utils";
import { getScheduleDoctorByDate } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";

const DoctorSchedule = (props) => {
  let { language } = props;
  const [allDays, setAllDays] = useState([]);
  const [allAvailableTime, setAllAvailableTime] = useState([]);
  const [isOpenModalBooking, setIsOpenModalBooking] = useState(false);
  const [dataScheduleTimeModal, setDataScheduleTimeModal] = useState({});

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getArrDays = () => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Hôm nay - ${ddMM}`;
          object.label = today;
        } else {
          let labelVi = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM");
          object.label = capitalizeFirstLetter(labelVi);
        }
      } else {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Today - ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("ddd - DD/MM");
        }
      }
      object.value = moment(new Date())
        .add(i, "days")
        .startOf("days")
        .valueOf(allDays.push(object));
    }
    return allDays;
  };

  useEffect(() => {
    let allDays = getArrDays();
    setAllDays(allDays);
  }, [language]);

  useEffect(() => {
    let allDays = getArrDays();
    const callApiWhenComponentMount = async () => {
      let res = await getScheduleDoctorByDate(
        props.doctorIdFromParent,
        allDays[0].value
      );
      setAllAvailableTime(res.data ? res.data : []);
    };
    callApiWhenComponentMount();
  }, [props.doctorIdFromParent]);

  const handleOnChangeSelect = async (e) => {
    if (props.doctorIdFromParent && props.doctorIdFromParent !== -1) {
      let doctorId = props.doctorIdFromParent;
      let date = e.target.value;
      let res = await getScheduleDoctorByDate(doctorId, date);
      if (res && res.errCode === 0) {
        setAllAvailableTime(res.data ? res.data : []);
      }
    }
  };

  const handleClickScheduleTime = (time) => {
    setDataScheduleTimeModal(time);
    setIsOpenModalBooking(true);
  };

  const closeBookingModal = () => {
    setIsOpenModalBooking(false);
  };

  const toggleBookingModal = () => {
    setIsOpenModalBooking(!isOpenModalBooking);
  };

  return (
    <>
      <div className="doctor-schedule-container">
        <div className="all-schedule">
          <select onChange={(e) => handleOnChangeSelect(e)}>
            {allDays &&
              allDays.length > 0 &&
              allDays.map((item, i) => (
                <option key={i} value={item.value}>
                  {item.label}
                </option>
              ))}
          </select>
        </div>

        <div className="all-available-time">
          <div className="text-calendar">
            <i className="fas fa-calendar-alt">
              <span>
                <FormattedMessage id="patient.detail-doctor.schedule" />
              </span>
            </i>
          </div>
          <div className="time-content">
            {allAvailableTime && allAvailableTime.length > 0 ? (
              <>
                <div className="time-content-btns">
                  {allAvailableTime.map((item, i) => {
                    let timeDisplay =
                      language === LANGUAGES.VI
                        ? item.timeTypeData.valueVi
                        : item.timeTypeData.valueEn;
                    return (
                      <button
                        key={i}
                        className={
                          language === LANGUAGES.VI ? "btn-vie" : "btn-en"
                        }
                        onClick={() => handleClickScheduleTime(item)}
                      >
                        {timeDisplay}
                      </button>
                    );
                  })}
                </div>

                <div className="book-free">
                  <span>
                    <FormattedMessage id="patient.detail-doctor.choose" />
                    <i className="far fa-hand-point-up"></i>
                    <FormattedMessage id="patient.detail-doctor.book-free" />
                  </span>
                </div>
              </>
            ) : (
              <div className="no-schedule">
                <FormattedMessage id="patient.detail-doctor.no-schedule" />
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingModal
        isOpenModal={isOpenModalBooking}
        toggleFromParent={setIsOpenModalBooking}
        closeBookingModal={closeBookingModal}
        dataTime={dataScheduleTimeModal}
      />
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
