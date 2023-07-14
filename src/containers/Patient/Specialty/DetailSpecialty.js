import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getAllCodeService,
  getAllDetailSpecialtyById,
} from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";

const DetailSpecialty = (props) => {
  const { language } = props;
  const [arrDoctorId, setArrDoctorId] = useState([]);
  const [dataDetailSpecialty, setDataDetailSpecialty] = useState({});
  const [listProvince, setListProvince] = useState([]);
  // const [valueProvince, setValueProvince] = useState("");
  // console.log(valueProvince);
  useEffect(() => {
    const fetchDetailInforDoctor = async () => {
      try {
        if (props.match && props.match.params && props.match.params.id) {
          let id = props.match.params.id;

          let res = await getAllDetailSpecialtyById({
            id: id,
            location: "ALL",
          });

          let resProvince = await getAllCodeService("PROVINCE");

          if (
            res &&
            res.errCode === 0 &&
            resProvince &&
            resProvince.errCode === 0
          ) {
            let data = res.data;
            let arrDoctorId = [];
            console.log(data);
            if (data && !_.isEmpty(res.data)) {
              let arr = data.doctorSpecialty;
              if (arr && arr.length > 0) {
                arr.map((item) => {
                  arrDoctorId.push(item.doctorId);
                });
              }
            }

            let dataProvince = resProvince.data;

            if(dataProvince && dataProvince.length > 0) {
              dataProvince.unshift({
                createdAt: null,
                keyMap: "ALL",
                type: "PROVINCE",
                valueEn: "All",
                valueVi: "Toàn quốc",
              })
            }


            setArrDoctorId(arrDoctorId);
            setDataDetailSpecialty(res.data);
            setListProvince(dataProvince ? dataProvince : []);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchDetailInforDoctor();
  }, []);

  const handleOnchangeSelect = async(e) => {
    if (props.match && props.match.params && props.match.params.id) {
      let id = props.match.params.id;
      let location = e.target.value

      let res = await getAllDetailSpecialtyById({
        id: id,
        location: location,
      });

      if (
        res &&
        res.errCode === 0
      ) {
        let data = res.data;
        let arrDoctorId = [];

        if (data && !_.isEmpty(res.data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }
        setArrDoctorId(arrDoctorId);
        setDataDetailSpecialty(res.data);
      }
    }
  }

  return (
    <div className="detail-specialty-container">
      <HomeHeader />
      <div className="detail-specialty-body">
        <div className="description-specialty">
          {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
            <div
              dangerouslySetInnerHTML={{
                __html: dataDetailSpecialty.descriptionHtml,
              }}
            ></div>
          )}
        </div>

        <div className="search-sp-doctor">
          <select onChange={(e) => handleOnchangeSelect(e)}>
            {listProvince &&
              listProvince.length > 0 &&
              listProvince.map((item, index) => (
                <option key={index} value={item.keyMap}>
                  {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                </option>
              ))}
          </select>
        </div>

        {arrDoctorId &&
          arrDoctorId.length > 0 &&
          arrDoctorId.map((item, index) => (
            <div className="each-doctor" key={index}>
              <div className="dt-container-left">
                <div className="doctor-infor">
                  <ProfileDoctor
                    doctorId={item}
                    isShowDescription={true}
                    isShowLinkDetail={false}
                    isShowPrice={false}
                    // dataTime={dataTime}
                  />
                </div>
              </div>
              <div className="dt-container-right">
                <div className="doctor-schedule">
                  <DoctorSchedule doctorIdFromParent={item} />
                </div>

                <div className="doctor-extra-infor">
                  <DoctorExtraInfor doctorIdFromParent={item} />
                </div>
              </div>
            </div>
          ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
