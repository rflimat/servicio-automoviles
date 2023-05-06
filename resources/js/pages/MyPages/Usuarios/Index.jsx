import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "../../../components/Common/TableContainer";

import {
    Button,
    Card,
    CardBody,
} from "reactstrap";

import { del, get, post, put } from "../../../helpers/api_helper.jsx";

const Index = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            const data = await get("http://127.0.0.1:8000/api/usuarios");
            setUsuarios(data);
        }
        getData();
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: "N°",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Username",
                accessor: "username",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Telefono",
                accessor: "telefono",
            },
            {
                Header: "Acciones",
                disableFilters: true,
                accessor: "id",
                Cell: cellProps => {
                    return (
                        <>
                            <Button
                                type="button"
                                color="primary"
                                className="btn-sm btn-rounded me-1"
                                onClick={() => {
                                    const id = cellProps.row.original.id;
                                    navigate(`/usuarios/edit/${id}`);
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
                                    del(`http://127.0.0.1:8000/api/usuario/${id}`)
                                    .then(() => {
                                        console.log("Usuario eliminado");
                                        getData();
                                    });
                                }}
                            >
                                Eliminar
                            </Button>
                        </>
                    );
                },
            },
        ],
        []
    );

    //meta title
    document.title =
        "Data Tables | Skote - Vite React Admin & Dashboard Template";

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Usuarios" breadcrumbItem="Listar Usuarios" />
                {/* <Table columns={columns} data={data} /> */}
                <TableContainer
                    columns={columns}
                    data={usuarios}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    customPageSize={10}
                    addText="Nuevo"
                    handleAddClick={() => {
                        navigate('/usuarios/add');
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
