import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { getAllSpecialty } from "../../../services/userService"
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
const Specialty = (props) => {
  const [dataSpecialty, setDataSpecialty] = useState([])

  useEffect(() => {
    const fetchApiGetAllSpecialty = async() => {
      let res = await getAllSpecialty()

      if(res && res.errCode === 0 ) {
        setDataSpecialty(res.data ? res.data : [])
      }
    }
    fetchApiGetAllSpecialty()
  },[])

  const handleViewDetailSpecialty = (item) => {
    if(props.history) {
      props.history.push(`/detail-specialty/${item.id}`)
    }
  } 

  return (
    <section className="section-share section-specialty" id="specialty">
      <div className="section-container">
        <div className="section-header">
          <span className="title-section"><FormattedMessage id="homepage.specialty-popular" /></span>
          <button className="btn-section"><FormattedMessage id="homepage.more-info" /></button>
        </div>
        <div className="section-body">
          <Slider {...props.settings}>
            {dataSpecialty && dataSpecialty.length > 0 && dataSpecialty.map((item,i) => (
            <div className="section-customize specialty-child" key={i}  onClick={() => handleViewDetailSpecialty(item)}>
              <div className="bg-img section-specialty" style={{ backgroundImage: `url(${item.image})`}} />
              <div className="specialty-name">{item.name}</div>
            </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
