import React from "react";
import { Container } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const PagesStarter = () => {

    //meta title
    document.title="Stater Page | Servicios Electricos Laser";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Utility" breadcrumbItem="Starter Page" />
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PagesStarter
