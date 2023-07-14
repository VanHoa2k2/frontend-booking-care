import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./DoctorExtraInfor.scss";
import { LANGUAGES } from "../../../utils";
import { getExtraInforDoctorById } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

const DoctorExtraInfor = (props) => {
  const [isShowDetailInfor, setIsShowDetailInfor] = useState(false);
  const [extraInfor, setExtraInfor] = useState([]);

  useEffect(() => {
    const fetchExtraInforDoctorById = async () => {
      let res = await getExtraInforDoctorById(props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        setExtraInfor(res.data);
      }
    };
    fetchExtraInforDoctorById();
  }, [props.doctorIdFromParent]);
  
  return (
    <div className="doctor-extra-infor-container">
      <div className="content-up">
        <div className="text-address">
          <FormattedMessage id="patient.extra-infor-doctor.text-address" />
        </div>
        <div className="name-clinic">
          {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ""}
        </div>
        <div className="detail-address">
          {extraInfor && extraInfor.addressClinic
            ? extraInfor.addressClinic
            : ""}
        </div>
      </div>
      <div className="content-down">
        {!isShowDetailInfor ? (
          <div className="short-infor">
            <FormattedMessage id="patient.extra-infor-doctor.price" />
            {extraInfor &&
              extraInfor.priceTypeData &&
              props.language === LANGUAGES.VI && (
                <NumberFormat
                  className="currency"
                  value={extraInfor.priceTypeData.valueVi}
                  displayType="text"
                  thousandSeparator={true}
                  suffix="VND"
                />
              )}
            {extraInfor &&
              extraInfor.priceTypeData &&
              props.language === LANGUAGES.EN && (
                <NumberFormat
                  className="currency"
                  value={extraInfor.priceTypeData.valueEn}
                  displayType="text"
                  thousandSeparator={true}
                  suffix="$"
                />
              )}
            <span
              className="detail"
              onClick={() => setIsShowDetailInfor(!isShowDetailInfor)}
            >
              <FormattedMessage id="patient.extra-infor-doctor.detail" />
            </span>
          </div>
        ) : (
          <>
            <div className="title-price">
              <FormattedMessage id="patient.extra-infor-doctor.price" />
            </div>
            <div className="detail-infor">
              <div className="price">
                <span className="left">
                  <FormattedMessage id="patient.extra-infor-doctor.price" />
                </span>
                <span className="right">
                  {extraInfor &&
                    extraInfor.priceTypeData &&
                    props.language === LANGUAGES.VI && (
                      <NumberFormat
                        className="currency"
                        value={extraInfor.priceTypeData.valueVi}
                        displayType="text"
                        thousandSeparator={true}
                        suffix="VND"
                      />
                    )}
                  {extraInfor &&
                    extraInfor.priceTypeData &&
                    props.language === LANGUAGES.EN && (
                      <NumberFormat
                        className="currency"
                        value={extraInfor.priceTypeData.valueEn}
                        displayType="text"
                        thousandSeparator={true}
                        suffix="$"
                      />
                    )}
                </span>
              </div>
              <div className="note">
                {extraInfor && extraInfor.note ? extraInfor.note : ""}
              </div>
            </div>
            <div className="payment">
              <FormattedMessage id="patient.extra-infor-doctor.payment" />
              {extraInfor &&
              extraInfor.paymentTypeData &&
              props.language === LANGUAGES.VI
                ? extraInfor.paymentTypeData.valueVi
                : extraInfor.paymentTypeData.valueEn}
            </div>
            <div className="hide-price">
              <span onClick={() => setIsShowDetailInfor(!isShowDetailInfor)}>
                <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
              </span>
            </div>
          </>
        )}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
