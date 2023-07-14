import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DoctorDetail.scss";
import { getDetailInforDoctor } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor";
import Comment from "../SocialPlugin/Comment";
import LikeAndShare from "../SocialPlugin/LikeAndShare";

const DetailDoctor = (props) => {
  let { language } = props;
  const [detailDoctor, setDetailDoctor] = useState([]);
  const [currentDoctorId, setCurrentDoctorId] = useState(-1);
  console.log(detailDoctor)
  let nameVi = "";
  let nameEn = "";
  if (detailDoctor && detailDoctor.positionData) {
    nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
    nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
  }

  useEffect(() => {
    const fetchDetailInforDoctor = async () => {
      try {
        if (props.match && props.match.params && props.match.params.id) {
          let id = props.match.params.id;
          setCurrentDoctorId(id);

          let res = await getDetailInforDoctor(id);
          if (res && res.errCode === 0) {
            setDetailDoctor(res.data);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchDetailInforDoctor();
  }, []);

  let currentURL = +process.env.REACT_APP_IS_LOCALHOST === 1 ? "https://restaurant-chatbox-vanhoa.onrender.com" : window.location.href
  
  return (
    <>
      <HomeHeader isShowBanner={false} />
      <div className="doctor-detail-container">
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: `url(${
                detailDoctor && detailDoctor.image ? detailDoctor.image : ""
              })`,
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {detailDoctor.Markdown && detailDoctor.Markdown.description && (
                <span>{detailDoctor.Markdown.description}</span>
              )}
            </div>
              <LikeAndShare 
                dataHref={currentURL}
              />
          </div>
        </div>
        <div className="schedule-doctor">
          <div className="content-left">
            <DoctorSchedule doctorIdFromParent={currentDoctorId} />
          </div>
          <div className="content-right">
            <DoctorExtraInfor doctorIdFromParent={currentDoctorId} />
          </div>
        </div>
        <div className="detail-infor-doctor">
          {detailDoctor &&
            detailDoctor.Markdown &&
            detailDoctor.Markdown.contentHTML && (
              <div
                dangerouslySetInnerHTML={{
                  __html: detailDoctor.Markdown.contentHTML,
                }}
              ></div>
            )}
        </div>
        <div className="comment-doctor">
          <Comment
            dataHref={currentURL}
            width={"100%"}
          />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
