import React from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import logo from "../../assets/images/header-logo.jpg";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { withRouter } from "react-router";
import { changeLanguageApp } from "../../store/actions";
import { Link } from "react-scroll";
import { Container } from "reactstrap";

const HomeHeader = (props) => {
  const changeLanguage = (language) => {
    props.changeLanguageAppRedux(language);
  };

  const returnToHome = () => {
    props.history.push(`/home`);
  };

  let language = props.language;

  return (
    <>
      <div className="home-header-container">
        <Container className="home-header-content">
          <div className="left-content">
            {/* <i className="fas fa-bars"></i> */}
            <div className="header-logo" onClick={() => returnToHome()}>
              <img src={logo} />
              <span>BOOKING CARE</span>
            </div>
          </div>
          <div className="center-content">
            <a className="child-content" href="#specialty">
              <div>
                <b>
                  <FormattedMessage id="home-header.speciality" />
                </b>
              </div>
              <div className="subs-title">
                <FormattedMessage id="home-header.searchdoctor" />
              </div>
            </a>
            <a className="child-content" href="#clinic">
              <div>
                <b>
                  <FormattedMessage id="home-header.health-facility" />
                </b>
              </div>
              <div className="subs-title">
                <FormattedMessage id="home-header.select-room" />
              </div>
            </a>
            <a className="child-content" href="#doctor">
              <div>
                <b>
                  <FormattedMessage id="home-header.doctor" />
                </b>
              </div>
              <div className="subs-title">
                <FormattedMessage id="home-header.select-doctor" />
              </div>
            </a>
            <div className="child-content">
              <div>
                <b>
                  <FormattedMessage id="home-header.fee" />
                </b>
              </div>
              <div className="subs-title">
                <FormattedMessage id="home-header.check-health" />
              </div>
            </div>
          </div>
          <div className="right-content">
            <div className="support">
              <i className="far fa-question-circle"></i>
              <FormattedMessage id="home-header.support" />
            </div>
            <div
              className={
                language === LANGUAGES.VI ? "language-vi active" : "language-vi"
              }
            >
              <span onClick={() => changeLanguage(LANGUAGES.VI)}>VN</span>
            </div>
            <div
              className={
                language === LANGUAGES.EN ? "language-en active" : "language-en"
              }
            >
              <span onClick={() => changeLanguage(LANGUAGES.EN)}>EN</span>
            </div>
          </div>
        </Container>
      </div>
      {props.isShowBanner === true && (
        <div className="home-header-banner">
          <div className="content-up">
            <div className="title1">
              <FormattedMessage id="banner.title1" />
            </div>
            <div className="title2">
              <FormattedMessage id="banner.title2" />
            </div>
            <div className="search">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Tìm chuyên khoa khám bệnh" />
            </div>
          </div>
          <div className="content-down">
            <div className="options">
              <div className="option-child">
                <div className="icon-child">
                  <i className="far fa-hospital"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.child1" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="far fa-hospital"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.child2" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="far fa-hospital"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.child3" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="far fa-hospital"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.child4" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="far fa-hospital"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.child5" />
                </div>
              </div>
              <div className="option-child">
                <div className="icon-child">
                  <i className="far fa-hospital"></i>
                </div>
                <div className="text-child">
                  <FormattedMessage id="banner.child6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
