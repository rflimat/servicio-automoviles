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
    const [Trabajador, setTrabajador] = useState([]);
    const navigate = useNavigate();

    const getData = async () => {
        const data = await get(`${import.meta.env.VITE_API_URL}/trabajadores`);
        setTrabajador(data);
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
                Header: "Nombres",
                accessor: "Nombres",
            },
            {
                Header: "Apellidos",
                accessor: "Apellidos",
            },
            {
                Header: "Telefono",
                accessor: "celular",
            },
            {
                Header: "Correo Electronico",
                accessor: "correo",
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
                                color="info"
                                className="btn-sm btn-rounded me-1"
                                onClick={() => {
                                    const id = cellProps.row.original.id;
                                    navigate(`/trabajadores/edit/${id}`);
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
                                    deleteSwal("Trabajador").then((result) => {
                                        if (result.isConfirmed) {
                                            del(`${import.meta.env.VITE_API_URL}/trabajadores/${id}`)
                                                .then((res) => {
                                                    successSwal("Trabajador", "eliminado").then(() => {
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
        "Trabajadores | Servicios Electricos Laser";

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Trabajadores" breadcrumbItem="Trabajadores" />
                
                <TableContainer
                    columns={columns}
                    data={Trabajador}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    customPageSize={10}
                    addText="Nuevo"
                    handleAddClick={() => {
                        navigate('/trabajadores/add');
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