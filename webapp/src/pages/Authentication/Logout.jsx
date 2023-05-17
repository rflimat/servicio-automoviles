import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";
import { useNavigate } from "react-router-dom";
import { postJwtLogout } from "../../helpers/fakebackend_helper";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    postJwtLogout({}).then(() => {
    localStorage.removeItem("authUser");
    navigate('/login');
    }).catch(() => {
      localStorage.removeItem("authUser");
      navigate('/login');
    });
  }, []);

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);
