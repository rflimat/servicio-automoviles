import React from "react"
import { Card, CardBody, CardTitle, Progress } from "reactstrap"

const TopClientes = ({topClientes}) => {
  const firstCliente = topClientes[0];
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Top Clientes</CardTitle>
          <div className="text-center">
            <div className="mb-4">
              <i className="bx bx-user text-primary display-4" />
            </div>
            <h3>{firstCliente && firstCliente.cantidad}</h3>
            <p>{firstCliente && firstCliente.cliente}</p>
          </div>

          <div className="table-responsive mt-4">
            <table className="table align-middle table-nowrap">
              <tbody>
                {topClientes.map((element, index) => (
                  <tr key={index}>
                    <td style={{ width: "30%" }}>
                      <p className="mb-0">{element.cliente}</p>
                    </td>
                    <td style={{ width: "25%" }}>
                      <h5 className="mb-0">{element.cantidad}</h5>
                    </td>
                    <td>
                      <Progress
                        value={element.cantidad * 100 / firstCliente.cantidad}
                        color="primary"
                        className="bg-transparent progress-sm"
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default TopClientes
