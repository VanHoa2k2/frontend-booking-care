import React from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import { FormattedMessage } from "react-intl";

const HandBook = (props) => {

    return (
      <div className="section-share section-handbook">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cẩm nang</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...props.settings}>
              <div className="section-customize">
                <div className="bg-img section-handbook" />
                <div>Bệnh viện chợ rẫy 1</div>
              </div>
              <div className="section-customize">
                <div className="bg-img section-handbook" />
                <div>Bệnh viện chợ rẫy 2</div>
              </div>
              <div className="section-customize">
                <div className="bg-img section-handbook" />
                <div>Bệnh viện chợ rẫy 3</div>
              </div>
              <div className="section-customize">
                <div className="bg-img section-handbook" />
                <div>Bệnh viện chợ rẫy 4</div>
              </div>
              <div className="section-customize">
                <div className="bg-img section-handbook" />
                <div>Bệnh viện chợ rẫy 5</div>
              </div>
              <div className="section-customize">
                <div className="bg-img section-handbook" />
                <div>Bệnh viện chợ rẫy 6</div>
              </div>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(HandBook);