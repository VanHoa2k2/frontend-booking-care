import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import {LANGUAGES} from "../../../utils";
import { FormattedMessage } from "react-intl";
import { withRouter } from 'react-router';

const OutStandingDoctor = (props) => {
  let {language} = props
  const [arrDoctors, setArrDoctors] = useState([]);
  console.log(props)

  useEffect(() => {
    setArrDoctors(props.topDoctorsRedux);
  }, [props.topDoctorsRedux]);

  useEffect(() => {
    props.loadTopDoctors();
  }, []);

  const handleViewDetailDoctor = (doctor) => {
    props.history.push(`/detail-doctor/${doctor.id}`)
  }

  return (
    <div className="section-share section-outstanding-doctor" id="doctor">
      <div className="section-container pc">
        <div className="section-header">
          <span className="title-section"><FormattedMessage id="homepage.outstanding-doctor" /></span>
          <button className="btn-section"><FormattedMessage id="homepage.more-info" /></button>
        </div>
        <div className="section-body">
          <Slider {...props.settings}>
            {arrDoctors &&
              arrDoctors.length > 0 &&
              arrDoctors.map((item, i) => {
                let imageBase64 = ''
                if(item.image) {
                  imageBase64 = Buffer.from(item.image, 'base64').toString('binary')
                }
                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`
                let nameEn = `${item.positionData.valueEn}, ${item.lastName} ${item.firstName}`
                return (
                  <div className="section-customize" onClick={() => handleViewDetailDoctor(item)}>
                    <div className="customize-border">
                      <div className="outer-bg">
                        <div className="bg-img section-outstanding-doctor" style={{ backgroundImage: `url(${imageBase64})` }}/>
                      </div>
                      <div className="position text-center">
                        <div>
                          {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div>Da liễu</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </Slider>
        </div>
      </div>

      <div className="section-container mobile">
        <div className="section-header">
          <span className="title-section"><FormattedMessage id="homepage.outstanding-doctor" /></span>
          <button className="btn-section"><FormattedMessage id="homepage.more-info" /></button>
        </div>
        <div className="section-body">
          <Slider {...props.settingsMobile}>
            {arrDoctors &&
              arrDoctors.length > 0 &&
              arrDoctors.map((item, i) => {
                let imageBase64 = ''
                if(item.image) {
                  imageBase64 = Buffer.from(item.image, 'base64').toString('binary')
                }
                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`
                let nameEn = `${item.positionData.valueEn}, ${item.lastName} ${item.firstName}`
                return (
                  <div className="section-customize" onClick={() => handleViewDetailDoctor(item)}>
                    <div className="customize-border">
                      <div className="outer-bg">
                        <div className="bg-img section-outstanding-doctor" style={{ backgroundImage: `url(${imageBase64})` }}/>
                      </div>
                      <div className="position text-center">
                        <div>
                          {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div>Da liễu</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    topDoctorsRedux: state.admin.topDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
