import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";

const Comment = (props) => {
  const { dataHref, width, numPost } = props
  const initFacebookSDK = () => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }

    let { language } = props;
    let locale = language === LANGUAGES.VI ? "vi_VN" : "en_US";
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: "v2.5", // use version 2.1
      });
    };
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = `//connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  };

  useEffect(() => {
    initFacebookSDK()
  }, []);
  
  return (
    <>
    <div
      className="fb-comments"
      data-href={dataHref}
      data-width={width ? width : ""}
      data-numposts = {numPost ? numPost : 5}
    ></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
