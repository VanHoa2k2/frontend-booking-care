import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import { getAllHandbook } from "../../../services/userService";

const HandBook = (props) => {
  console.log(props);
  const [arrHandbooks, setArrHandbooks] = useState([]);

  useEffect(() => {
    const fetchApiGetAllHandbook = async () => {
      let res = await getAllHandbook();

      if (res && res.errCode === 0) {
        setArrHandbooks(res.data ? res.data : []);
      }
    };
    fetchApiGetAllHandbook();
  }, []);

  const handleViewDetailDoctor = (handbook) => {
    props.history.push(`/detail-handbook/${handbook.id}`);
  };

  return (
    <div className="section-share section-handbook">
      <div className="section-container pc">
        <div className="section-header">
          <span className="title-section">
            {" "}
            <FormattedMessage id="homepage.handbook" />
          </span>
          <button className="btn-section">
            {" "}
            <FormattedMessage id="homepage.more-info" />
          </button>
        </div>
        <div className="section-body">
          <Slider {...props.settings}>
            {arrHandbooks &&
              arrHandbooks.length > 0 &&
              arrHandbooks.map((item, i) => (
                <div
                  className="section-customize section-customize-handbook specialty-child"
                  key={i}
                  onClick={() => handleViewDetailDoctor(item)}
                >
                  <div
                    className="bg-img section-handbook"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="specialty-name">{item.name}</div>
                </div>
              ))}
          </Slider>
        </div>
      </div>

      <div className="section-container mobile">
        <div className="section-header">
          <span className="title-section">Cẩm nang</span>
          <button className="btn-section">Xem thêm</button>
        </div>
        <div className="section-body">
          <Slider {...props.settingsMobile}>
            {arrHandbooks &&
              arrHandbooks.length > 0 &&
              arrHandbooks.map((item, i) => (
                <div
                  className="section-customize section-customize-handbook specialty-child"
                  key={i}
                  onClick={() => handleViewDetailDoctor(item)}
                >
                  <div
                    className="bg-img section-handbook"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="specialty-name">{item.name}</div>
                </div>
              ))}
          </Slider>
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HandBook)
);
