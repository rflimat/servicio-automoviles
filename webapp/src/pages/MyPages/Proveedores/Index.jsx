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
    const [proveedores, setProveedores] = useState([]);
    const navigate = useNavigate();
    
    const getData = async () => {
        const data = await get(`${import.meta.env.VITE_API_URL}/proveedores`);
        setProveedores(data);
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
                Header: "Tipo Documento",
                accessor: "tipoDocumento",
            },
            {
                Header: "Numero Documento",
                accessor: "numeroDocumento",
            },
            {
                Header: "Nombre",
                accessor: "nombre",
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
                                color="primary"
                                className="btn-sm btn-rounded me-1"
                                onClick={() => {
                                    const id = cellProps.row.original.id;
                                    navigate(`/proveedores/edit/${id}`);
                                }}
                            >
                                Editar
                            </Button>
                            <Button
                                type="button"
                                color="danger"
                                className="btn-sm btn-rounded ms-1"
                                onClick={() => {
                                    const id = cellProps.row.original.id;
                                    deleteSwal("proveedor").then((result) => {
                                        if (result.isConfirmed) {
                                            del(`${import.meta.env.VITE_API_URL}/proveedores/${id}`)
                                                .then((res) => {
                                                    successSwal("proveedor", "eliminado").then(() => {
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
                                Eliminar
                            </Button>
                        </div>
                    );
                },
            },
        ],
        []
    );

    //meta title
    document.title = "Proveedores | Servicios Electricos Laser";

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Proveedores" breadcrumbItem="Listar Proveedores" />
                <TableContainer
                    columns={columns}
                    data={proveedores}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    customPageSize={10}
                    addText="Nuevo"
                    handleAddClick={() => {
                        navigate('/proveedores/add');
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
