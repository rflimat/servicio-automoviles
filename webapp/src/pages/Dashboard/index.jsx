import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { Link } from "react-router-dom";

import { get } from "../../helpers/api_helper.jsx";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import TopClientes from "./TopClientes";
import PTrabajos from "./PTrabajos";

const Index = props => {
  const [reports, setReports] = useState([]);
  const [topClientes, setTopClientes] = useState([]);
  const [trabajosPendientes, setTrabajosPendientes] = useState([]);

  useEffect(() => {
    const getReport = async () => {
      const data = await get(`${import.meta.env.VITE_API_URL}/report`);
      setReports(data.reports);
      setTopClientes(data.topClientes);
      setTrabajosPendientes(data.trabajosPendientes);
    }
    getReport();
  }, []);

  //meta title
  document.title = "Dashboard | Servicios Electricos Laser";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={"Dashboard"}
            breadcrumbItem={"Dashboard"}
          />

          <Row>
            {/* Reports Render */}
            {reports.map((report, key) => (
              <Col md="4" key={"_col_" + key}>
                <Card className="mini-stats-wid">
                  <CardBody>
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <p className="text-muted fw-medium">
                          {report.title}
                        </p>
                        <h4 className="mb-0">{report.description}</h4>
                      </div>
                      <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                        <span className="avatar-title rounded-circle bg-primary">
                          <i
                            className={
                              "bx " + report.iconClass + " font-size-24"
                            }
                          ></i>
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          <Row>
            <Col xl="6">
              <PTrabajos trabajosPendientes={trabajosPendientes} />
            </Col>

            <Col xl="6">
              <TopClientes topClientes={topClientes} />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Index