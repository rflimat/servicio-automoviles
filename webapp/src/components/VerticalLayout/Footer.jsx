import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>{new Date().getFullYear()} © Servicios Electricos Laser.</Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                <span style={{display: "block"}}>Desarrollado por Systec</span>
              </div>
            </Col>  
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
