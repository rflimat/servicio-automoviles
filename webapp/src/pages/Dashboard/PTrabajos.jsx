import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

const PTrabajos = ({ trabajosPendientes }) => {
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-3">Trabajos Pendientes</CardTitle>
          <ul className="verti-timeline list-unstyled">
            {trabajosPendientes.map((element, index) => (
              <li key={index} className="event-list active">
                <div className="event-timeline-dot">
                  <i className="bx bxs-right-arrow-circle font-size-18 bx-fade-right" />
                </div>
                <div className="flex-shrink-0 d-flex">
                  <div className="me-3">
                    <h5 className="font-size-14">
                      {element.fecha}{" "}
                      <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2" />
                    </h5>
                  </div>
                  <div className="flex-grow-1">
                    <div>{element.descripcion}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="text-center mt-4">
            <Link
              to="/trabajos"
              className="btn btn-primary  btn-sm"
            >
              Ver mas <i className="mdi mdi-arrow-right ms-1" />
            </Link>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default PTrabajos;