import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "../../../components/Common/TableContainer";
import { deleteSwal, errorSwal, successSwal } from "../../../components/Swal";

import {
  Button,

} from "reactstrap";

import { del, get, post, put } from "../../../helpers/api_helper.jsx";

const Index = () => {
  const [comprobantes, setComprobantes] = useState([]);
  const navigate = useNavigate();

  const getData = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/comprobantes`);
    setComprobantes(data);
  }

  useEffect(() => {
    getData();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "N°",
      },
      {
        Header: "Numero de comprobante",
        accessor: "nro_comprobante",
      },
      {
        Header: "Cliente",
        accessor: "cliente",
      },
      {
        Header: "Fecha creacion",
        accessor: "fecha_hora_creacion",
      },
      {
        Header: "Metodo",
        accessor: "metodo",
      },
      {
        Header: "Servicio",
        accessor: "servicio",
      },
      {
        Header: "Total",
        accessor: "costo_total",
        Cell: cellProps => (
          <>S/. {cellProps.value} </>
        )
      },
      {
        Header: "Acciones",
        disableFilters: true,
        accessor: "id",
        Cell: cellProps => {
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="button"
                color="success"
                className="btn-sm btn-rounded me-1"

                onClick={() => {
                  const id = cellProps.row.original.id;
                  navigate(`/comprobantes/view?id=${id}`);
                }}
              >
                <i className="far fa-eye"></i>
              </Button>
              <Button
                type="button"
                color="info"
                className="btn-sm btn-rounded me-1"
                onClick={() => {
                  const id = cellProps.row.original.id;
                  navigate(`/comprobantes/generate?id=${id}`);
                }}
              >
                <i className='bx bxs-pencil' ></i>
              </Button>
              <Button
                type="button"
                color="danger"
                className="btn-sm btn-rounded me-1"
                onClick={() => {
                  const id = cellProps.row.original.id;
                  deleteSwal("comprobantes").then((result) => {
                    if (result.isConfirmed) {
                      del(`${import.meta.env.VITE_API_URL}/comprobantes/${id}`)
                        .then((res) => {
                          successSwal("comprobante", "eliminado").then(() => {
                            getData();
                          });
                        })
                        .catch((err) => {
                          errorSwal(err);
                        });
                    }
                  });
                }}
              >
                <i className='bx bx-trash'></i>
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  //meta title
  document.title =
    "Comprobantes | Servicios Electricos Laser";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Comprobantes" breadcrumbItem="Comprobantes" />

        <TableContainer
          columns={columns}
          data={comprobantes}
          isGlobalFilter={true}
          isAddOptions={false}
          customPageSize={10}
          className="custom-header-css"
        />
      </div>
    </div>
  );
};

Index.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default Index;
