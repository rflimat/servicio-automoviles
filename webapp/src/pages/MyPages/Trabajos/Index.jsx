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
    const [trabajos, setTrabajos] = useState([]);
    const navigate = useNavigate();

    const getData = async () => {
        //const data = await get(`${import.meta.env.VITE_API_URL}/trabajos`);
        const data = [{estado: "Prod"}]
        setTrabajos(data);
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
                Header: "Estado",
                accessor: "estado",
            },
            {
                Header: "Vehiculo",
                accessor: "vehiculo",
            },
            {
                Header: "Cliente",
                accessor: "cliente",
            },
            {
                Header: "Fecha",
                accessor: "fecha",
            },
            {
                Header: "Pago",
                accessor: "estadoPago",
            },
            {
                Header: "Total",
                accessor: "total",
            },
            {
                Header: "Acciones",
                disableFilters: true,
                accessor: "id",
                Cell: cellProps => {
                    return (
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Button
                                type="button"
                                color="success"
                                className="btn-sm btn-rounded me-1"
                                
                                onClick={() => {
                                    const id = cellProps.row.original.id;
                                    navigate(`/trabajos/view/${id}`);
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
                                    navigate(`/trabajos/edit/${id}`);
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
                                    deleteSwal("trabajos").then((result) => {
                                        if (result.isConfirmed) {
                                            del(`${import.meta.env.VITE_API_URL}/trabajos/${id}`)
                                                .then((res) => {
                                                    successSwal("trabajo", "eliminado").then(() => {
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
        "Trabajos | Servicios Electricos Laser";

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Trabajos" breadcrumbItem="Trabajos" />
                {/* <Table columns={columns} data={data} /> */}
                <TableContainer
                    columns={columns}
                    data={trabajos}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    customPageSize={10}
                    addText="Nuevo"
                    handleAddClick={() => {
                        navigate('/trabajos/add');
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

export default Index