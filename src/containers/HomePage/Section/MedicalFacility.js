import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss"
import Slider from "react-slick";
import { getAllClinic } from "../../../services/userService";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const MedicalFacility = (props) => {
  const [dataClinics, setDataClinics] = useState([])

  useEffect(() => {
    const callApiGetAllClinic = async() => {
      let res = await getAllClinic()
      if(res && res.data.length > 0) {
        setDataClinics(res.data)
      }
    }
    callApiGetAllClinic()
  },[])

  const handleViewDetailClinics = (clinic) => {
    if(props.history) {
      props.history.push(`/detail-clinic/${clinic.id}`)
    }
  }
  
    return (
      <div className="section-share section-medical-facility" id="clinic">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cơ sở y tế nổi bật</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...props.settings}>
              {dataClinics && dataClinics.length > 0 && dataClinics.map((item, i) => (
              <div className="section-customize clinic-child" key={i} onClick={() => handleViewDetailClinics(item)}>
                <div className="bg-img section-medical-facility" style={{ backgroundImage: `url(${item.image})`}}  />
                <div className="clinic-name">{item.name}</div>
              </div>      
              ))
              }
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
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));