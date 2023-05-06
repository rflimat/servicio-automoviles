import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import withRouter from "../Common/withRouter";

;
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.svg";
import logoLightPng from "../../assets/images/logo-light.png";
import logoLightSvg from "../../assets/images/logo-light.svg";
import logoDark from "../../assets/images/logo-dark.png";

const Sidebar = (props) => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark" style={{textDecoration: "none"}}>
            <span className="logo-sm">
              {/*<img src={logo} alt="" height="22" />*/}
              <h4 className="text-white my-4">Servicios Electricos Laser</h4>
            </span>
            <span className="logo-lg">
              {/*<img src={logoDark} alt="" height="17" />*/}
              <h4 className="text-white my-4">Servicios Electricos Laser</h4>
            </span>
          </Link>

          <Link to="/" className="logo logo-light" style={{textDecoration: "none"}}>
            <span className="logo-sm">
              {/*<img src={logoLightSvg} alt="" height="22" />*/}
              <h4 className="text-white my-4">Servicios Electricos Laser</h4>
            </span>
            <span className="logo-lg">
              {/*<img src={logoLightPng} alt="" height="19" />*/}
              <h4 className="text-white my-4">Servicios Electricos Laser</h4>
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>

        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter((Sidebar)));
