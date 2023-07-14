import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailClinic.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getAllCodeService,
  getAllDetailClinicById,
} from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";

const DetailClinic = (props) => {
  const { language } = props;
  const [arrDoctorId, setArrDoctorId] = useState([]);
  
  const [dataDetailClinic, setDataDetailClinic] = useState({});
  console.log(dataDetailClinic);

  useEffect(() => {
    const fetchDetailInforDoctor = async () => {
      try {
        if (props.match && props.match.params && props.match.params.id) {
          let id = props.match.params.id;

          let res = await getAllDetailClinicById({id: id});

          if (
            res &&
            res.errCode === 0
          ) {
            let data = res.data;
            let arrDoctorId = [];
            console.log(res);
            if (data && !_.isEmpty(res.data)) {
              let arr = data.doctorClinic;
              if (arr && arr.length > 0) {
                arr.map((item) => {
                  arrDoctorId.push(item.doctorId);
                });
              }
            }


            setArrDoctorId(arrDoctorId);
            setDataDetailClinic(res.data);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchDetailInforDoctor();
  }, []);

  return (
    <div className="detail-specialty-container">
      <HomeHeader />
      <div className="detail-specialty-body">
        <div className="description-specialty">
          {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
            <>
              <div>{dataDetailClinic.name}</div>
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailClinic.descriptionHtml,
                }}
              ></div>
            </>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
