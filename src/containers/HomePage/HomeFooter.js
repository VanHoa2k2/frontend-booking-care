import React from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

const Footer = (props) => {

    return (
      <div className="home-footer">
        &copy; Copyright 2023 developed by Hoa Pham. All rights reserved.
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Footer);