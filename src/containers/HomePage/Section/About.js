import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

const About = (props) => {
  return (
    <div className="section-share section-about">
      <div className="section-about-header">
        Truyền thông nói về BookingCare
      </div>
      <div className="section-about-content">
        <div className="content-left">
          <iframe
            width="100%"
            height="400px"
            src="https://www.youtube.com/embed/FyDQljKtWnI"
            title="CÀ PHÊ KHỞI NGHIỆP VTV1 - BOOKINGCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div className="content-right">
          <img src="https://bookingcare.vn/assets/truyenthong/suckhoedoisong.png" />
          <img src="https://bookingcare.vn/assets/truyenthong/vnexpress.png" />
          <img src="https://bookingcare.vn/assets/truyenthong/vtv1.png" />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
