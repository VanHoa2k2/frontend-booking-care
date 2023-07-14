import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { postVerifyBookAppointment } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";
import "./VerifyEmail.scss"
const VerifyEmail = (props) => {
  const [statusVerify, setStatusVerify] = useState(false);
  const [errCode, setErrCode] = useState(0);

  useEffect(() => {
    const callApiPostVerifyBookAppointment = async () => {
      if (props.location && props.location.search) {
        let urlParams = new URLSearchParams(props.location.search);
        let token = urlParams.get("token");
        let doctorId = urlParams.get("doctorId");
        let res = await postVerifyBookAppointment({
          token,
          doctorId,
        });

        if (res && res.errCode === 0) {
          setStatusVerify(true);
          setErrCode(res.errCode)
        } else {
            setStatusVerify(true);
            setErrCode(res && res.errCode ? res.errCode : -1)
        }
      }
    };
    callApiPostVerifyBookAppointment();
  }, []);

  return (
    <>
      <HomeHeader />
      <div className="verify-email-container">
          {statusVerify ? 
          <div>
            {errCode === 0 ? <div className="infor-booking">Xác nhận lịch hẹn thành công!</div> : <div className="infor-booking">Lịch hẹn không tồn tại hoặc đã được xác nhận</div>}
          </div>
          : <div className="">Loading data...</div>}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
