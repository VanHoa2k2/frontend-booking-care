import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ProfileDoctor.scss";
import { getProfileDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
import { Link } from 'react-router-dom'

const ProfileDoctor = (props) => {
  let { language, isShowDescription, dataTime, isShowLinkDetail, isShowPrice, doctorId } =
    props;
  const [dataProfile, setDataProfile] = useState();
  useEffect(async () => {
    let data = await getInforDoctor(props.doctorId);
    setDataProfile(data);
  }, [doctorId]);

  useEffect(() => {
    // getInforDoctor(props.doctorId);
  }, [props.doctorId]);

  const getInforDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorById(id);
      if (res && res.errCode === 0) {
        result = res.data;
      } else {
        console.log("error");
      }
    }
    return result;
  };

  let nameVi = "";
  let nameEn = "";
  if (dataProfile && dataProfile.positionData) {
    nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
    nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.lastName} ${dataProfile.firstName}`;
  }

  const renderTimeBooking = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;

      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");

      return (
        <>
          <div>
            {time} - {date}
          </div>
          <div>
            <FormattedMessage id="patient.booking-modal.priceBooking" />
          </div>
        </>
      );
    }
  };

  return (
    <div className="">
      <div className="profile-doctor-container">
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: `url(${
                dataProfile && dataProfile.image ? dataProfile.image : ""
              })`,
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {isShowDescription ? (
                <>
                  {dataProfile &&
                    dataProfile.Markdown &&
                    dataProfile.Markdown.description && (
                      <span>{dataProfile.Markdown.description}</span>
                    )}
                </>
              ) : (
                <>{renderTimeBooking(dataTime)}</>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isShowLinkDetail === true && (
        <div className="view-detail-doctor">
          <Link to={`/detail-doctor/${doctorId}`}>Xem thêm</Link>
        </div>
      )}

      {isShowPrice === true && (
        <div className="price">
          <FormattedMessage id="patient.booking-modal.price" />
          {dataProfile &&
            dataProfile.Doctor_infor &&
            language === LANGUAGES.VI && (
              <NumberFormat
                className="currency"
                value={dataProfile.Doctor_infor.priceTypeData.valueVi}
                displayType="text"
                thousandSeparator={true}
                suffix="VND"
              />
            )}
          {dataProfile &&
            dataProfile.Doctor_infor &&
            language === LANGUAGES.EN && (
              <NumberFormat
                className="currency"
                value={dataProfile.Doctor_infor.priceTypeData.valueEn}
                displayType="text"
                thousandSeparator={true}
                suffix="$"
              />
            )}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
