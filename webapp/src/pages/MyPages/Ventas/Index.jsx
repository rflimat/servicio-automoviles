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
    const [ventas, setVentas] = useState([]);
    const navigate = useNavigate();

    const getData = async () => {
        const data = await get(`${import.meta.env.VITE_API_URL}/ventas`);
        setVentas(data);
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
                Header: "Cliente",
                accessor: "nombreCliente",
            },
            {
                Header: "Fecha Venta",
                accessor: "fecha",
            },
            {
                Header: "Importe",
                accessor: "total_importe",
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
                                    navigate(`/ventas/view/${id}`);
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
                                    navigate(`/ventas/edit/${id}`);
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
                                    deleteSwal("ventas").then((result) => {
                                        if (result.isConfirmed) {
                                            del(`${import.meta.env.VITE_API_URL}/ventas/${id}`)
                                                .then((res) => {
                                                    successSwal("venta", "eliminado").then(() => {
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
        "Ventas | Servicios Electricos Laser";

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Ventas" breadcrumbItem="Ventas" />

                <TableContainer
                    columns={columns}
                    data={ventas}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    customPageSize={10}
                    addText="Nuevo"
                    handleAddClick={() => {
                        navigate('/ventas/add');
                    }}
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
