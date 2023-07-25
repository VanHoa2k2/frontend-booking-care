import React, { useState } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleLogin = async() => {
    setErrMessage('')
    try {
      let data = await handleLoginApi(username, password)
      if(data && data.errCode !== 0) {
        setErrMessage(data.message)
      }
      if(data && data.errCode === 0) {
        //todo
        props.userLoginSuccess(data.user)
        console.log('login succeeds')
      }
    } catch (e) {
      if(e.response) {
        if(e.response.data) {
          setErrMessage(e.response.data.message)
        }
      }
    }
  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-content row">
          <div className="col-12 text-login">Login</div>
          <div className="col-12 form-group login-input">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="col-12 form-group login-input">
            <label>Password:</label>
            <div className="custom-input-password">
                <input
                  type={isShowPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                />
                <span 
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? <i class="far fa-eye"></i> : <i class="far fa-eye-slash"></i>}
                </span>
            </div>
          </div>
          <div className="cot-12" style={{ color: 'red'}}>
            {errMessage}
          </div>
          <div className="col-12">
            <button className="btn-login" onClick={() => handleLogin()}>Login</button>
          </div>
          <div className="col-12">
            <span className="forgot-password">Forgot your password</span>
          </div>
          <div className="col-12 text-center mt-3">
            <span className="text-other-login">Or login with:</span>
          </div>
          <div className="col-12 social-login">
            <i className="fab fa-google-plus-g google"></i>
            <i className="fab fa-facebook-f facebook"></i>
          </div>
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
  return {
    navigate: (path) => dispatch(push(path)),
    // userLoginFail: () => dispatch(actions.adminLoginFail()),
    userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
