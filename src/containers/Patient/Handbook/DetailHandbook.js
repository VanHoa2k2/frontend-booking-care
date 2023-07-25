import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DetailHandbook.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getAllDetailHandbookById } from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";

const DetailHandbook = (props) => {
  const { language } = props;

  const [dataDetailHandbook, setDataDetailHandbook] = useState({});
  console.log(dataDetailHandbook);

  useEffect(() => {
    const fetchDetailInforDoctor = async () => {
      try {
        if (props.match && props.match.params && props.match.params.id) {
          let id = props.match.params.id;
          let res = await getAllDetailHandbookById({ id: id });

          if (res && res.errCode === 0) {
            setDataDetailHandbook(res.data);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchDetailInforDoctor();
  }, []);

  return (
    <div className="detail-handbook-container">
      <HomeHeader />
      <div className="detail-handbook-body">
        <div className="description-handbook">
          {dataDetailHandbook && !_.isEmpty(dataDetailHandbook) && (
            <>
              <h2>{dataDetailHandbook.name}</h2>
              <h3>{dataDetailHandbook.describe}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailHandbook.descriptionHtml,
                }}
              ></div>
            </>
          )}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);
