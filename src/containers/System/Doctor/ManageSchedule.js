import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";

const ManageSchedule = (props) => {
  const { language, userInfo } = props;

  const currentDoctor = {
    label: `${userInfo.lastName} ${userInfo.firstName}`,
    value: userInfo.id
  }

  const [listDoctors, setListDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(currentDoctor);
  const [currentDate, setCurrentDate] = useState("");
  const [rangeTime, setRangeTime] = useState([]);
  console.log(props.userInfo)
  let yesterday = new Date(new Date().setDate(new Date().getDate()-1))

  useEffect(() => {
    props.fetchAllDoctors();
    props.fetchAllScheduleTime();
  }, []);

  useEffect(() => {
    let dataSelect = buildDataInputSelect(props.allDoctors);
    setListDoctors(dataSelect);
  }, [props.allDoctors]);

  useEffect(() => {
    setRangeTime(props.allScheduleTime);
    let data = props.allScheduleTime;
    if (data && data.length > 0) {
      data = data.map((item) => ({ ...item, isSelected: false }));
    }
    setRangeTime(data);
  }, [props.allScheduleTime]);

  const buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  const handleChangeSelect = async (selectedOption) => {
    setSelectedDoctor(selectedOption);
    console.log(selectedDoctor);
  };

  const handleOnChangeDatePicker = (date) => {
    setCurrentDate(date[0]);
  };

  const handleClickBtnTime = (time) => {
    if (rangeTime && rangeTime.length > 0) {
      let newRangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      setRangeTime(newRangeTime);
    }
  };

  const handleSaveSchedule = async() => {
    let result = []

    if(!currentDate) {
      toast.error("Invalid date!")
      return
    }

    if(!selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("Invalid selected doctor!")
      return
    }

    // let formattedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER)
    // let formattedDate = moment(currentDate).unix()
    let formattedDate = new Date(currentDate).getTime()

    if(rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true)
      if(selectedTime.length > 0) {
        selectedTime.map(schedule => {
          let object = {}
          object.doctorId = selectedDoctor.value
          object.date = formattedDate
          object.timeType = schedule.keyMap
          result.push(object)
        })
      } else {
        toast.error("Invalid valid selected time!")
        return
      }
    }
    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formattedDate: formattedDate
    })

    if(res && res.errCode === 0) {
      toast.success("Save infor succeed!")
    } else {
      toast.error("error saveBulkScheduleDoctor")
      console.log("error saveBulkScheduleDoctor", res)
    }
  }

  return (
    <div className="manage-schedule-container">
      <div className="m-s-title">
        <FormattedMessage id="manage-schedule.title" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="manage-schedule.choose-doctor" />
            </label>
            <Select
              value={selectedDoctor}
              onChange={handleChangeSelect}
              options={listDoctors}
            />
          </div>
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="manage-schedule.choose-date" />
            </label>
            <DatePicker
              onChange={handleOnChangeDatePicker}
              className="form-control"
              value={currentDate[0]}
              minDate={yesterday}
            />
          </div>
          <div className="col-12 pick-hour-container">
            {rangeTime &&
              rangeTime.length > 0 &&
              rangeTime.map((item, i) => (
                <button
                  key={i}
                  className={
                    item.isSelected === true
                      ? "btn btn-schedule active"
                      : "btn btn-schedule"
                  }
                  onClick={() => handleClickBtnTime(item)}
                >
                  {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                </button>
              ))}
          </div>
          <div className="col-12">
            <button className="btn btn-primary btn-save-schedule" onClick={() => handleSaveSchedule()}>
              <FormattedMessage id="manage-schedule.save" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
