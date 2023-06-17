import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "../../components/Common/withRouter";
import { useNavigate } from "react-router-dom";
import { post } from "../../helpers/api_helper.jsx";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    post(`${import.meta.env.VITE_API_URL}/logout`, {}).then(() => {
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
