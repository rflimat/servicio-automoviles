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
    const [productos, setProductos] = useState([]);
    const navigate = useNavigate();

    const getData = async () => {
        const data = await get("http://127.0.0.1:8000/api/productos");
        setProductos(data);
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
                Header: "Codigo",
                accessor: "codigo",
            },
            {
                Header: "Observacion",
                accessor: "observacion",
            },
            {
                Header: "Fecha Registro",
                accessor: "fecha",
            },
            {
                Header: "Fecha de Recepcion",
                accessor: "feccha",
            },
            {
                Header: "Proveedor",
                accessor: "proveedor",
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
                                color="info"
                                className="btn-sm btn-rounded me-1"
                                onClick={() => {
                                    const id = cellProps.row.original.id;
                                    navigate(`/compras/edit/${id}`);
                                }}
                            >
                               <i className='bx bxs-pencil' ></i>
                            </Button>
                            <Button
                                type="button"
                                color="danger"
                                className="btn-sm btn-rounded ms-1"
                                onClick={() => {
                                    const id = cellProps.row.original.id;
                                    deleteSwal("compras").then((result) => {
                                        if (result.isConfirmed) {
                                            del(`http://127.0.0.1:8000/api/productos/${id}`)
                                                .then((res) => {
                                                    successSwal("compra", "eliminado").then(() => {
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
                        </>
                    );
                },
            },
        ],
        []
    );

    //meta title
    document.title =
        "Compras | Servicios Electricos Laser";

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Compras" breadcrumbItem="Compras" />
                {/* <Table columns={columns} data={data} /> */}
                <TableContainer
                    columns={columns}
                    data={Compras}
                    isGlobalFilter={true}
                    isAddOptions={true}
                    customPageSize={10}
                    addText="Nuevo"
                    handleAddClick={() => {
                        navigate('/compras/add');
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
