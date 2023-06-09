import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { format } from 'date-fns'
import CustomSelect from "../../../components/Common/CustomSelect";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { editSwal, errorSwal, successSwal } from "../../../components/Swal";
import { get, post } from "../../../helpers/api_helper";

const View = () => {
  const tdStyles = {
    background: "inherit",
    width: "100%",
    border: 0,
    padding: 0,
    outline: "none"

  };
  const [element, setElement] = useState({
    fecha_compra: "",
    fecha_recepcion: "",
    costo_compra: 0,
    nombre: "",
    productosCompra: [],
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getById = async () => {
      const data = await get(`${import.meta.env.VITE_API_URL}/compras/${id}`);
      setElement(data);
    }
    getById();
  }, []);

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      estado: element.estado,
      datetimeCompra: element.fecha_compra,
      datetimeRecepcion: element.fecha_recepcion,
      proveedor: element.nombreProveedor,
      costo_compra: element.costo_compra
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: (element) => {
      const compra = {
        fecha_compra: element.datetimeCompra,
        fecha_recepcion: element.datetimeRecepcion,
        costo_compra: productosCompra.reduce((total, producto) => total + producto.importe, 0),
        proveedor_id: element.proveedor,
        productosCompra
      }
      editSwal("compras").then((result) => {
        if (result.isConfirmed) {
          console.log(compra);
          post(`${import.meta.env.VITE_API_URL}/compras`, compra)
            .then((res) => {
              successSwal("compra", "agregado").then(() => {
                navigate("/compras");
              });
            })
            .catch((err) => {
              errorSwal(err);
            });
        }
      })
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Compras"
            breadcrumbItem="Ver Compras"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="row">
              <div className="mb-3 col-12 col-md-6">
                <Label>Proveedor</Label>
                <Input
                  value={validationType.values.proveedor}
                  placeholder="Seleccione Proveedor"
                  readOnly
                />
                {validationType.touched.proveedor &&
                  validationType.errors.proveedor ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.proveedor}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-12 col-md-3">
                <Label className="form-label">Fecha y hora de compra</Label>
                <Input
                  name="datetimeCompra"
                  type="datetime-local"
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.datetimeCompra || ""}
                  invalid={
                    validationType.touched.datetimeCompra &&
                      validationType.errors.datetimeCompra
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.datetimeCompra &&
                  validationType.errors.datetimeCompra ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.datetimeCompra}
                  </FormFeedback>
                ) : null}
              </div>
              { validationType.values.estado == "Recepcionado" &&
              (<div className="mb-3 col-12 col-md-3">
                <Label className="form-label">Fecha y hora de recepcion</Label>
                <Input
                  name="datetimeRecepcion"
                  type="datetime-local"
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.datetimeRecepcion || ""}
                  invalid={
                    validationType.touched.datetimeRecepcion &&
                      validationType.errors.datetimeRecepcion
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.datetimeRecepcion &&
                  validationType.errors.datetimeRecepcion ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.datetimeRecepcion}
                  </FormFeedback>
                ) : null}
              </div>) }
            </div>

            <div className="mb-3">
              <Label>Estado</Label>
              <Input
                value={validationType.values.estado}
                placeholder="Seleccione estado"
                readOnly
              />
              {validationType.touched.estado &&
                validationType.errors.estado ? (
                <FormFeedback type="invalid">
                  {validationType.errors.estado}
                </FormFeedback>
              ) : null}
            </div>

            <div className="table-responsive">
            <table className="table table-bordered text-center table-hover">
              <thead className="table-success">
                <tr>
                  <th>N°</th>
                  <th className="col-3">Nombre</th>
                  <th className="col-3">Observacion</th>
                  <th className="col-1">Cantidad</th>
                  <th className="col-2">Precio</th>
                  <th className="col-2">Importe</th>
                </tr>
              </thead>
              <tbody>
                {element.productosCompra.map((producto, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>
                      {producto.nombre}
                    </td>
                    <td>
                      {producto.observacion}
                    </td>
                    <td>
                      {producto.cantidad}
                    </td>
                    <td>
                      {producto.precio}
                    </td>
                    <td>
                      {producto.importe}
                    </td>
                   
                  </tr>
                ))}
                <tr>
                  <td colSpan={5}>Costo total de la compra:</td>
                  <td colSpan={1}>
                    S/.{validationType.values.costo_compra}
                  </td>
                </tr>
              </tbody>
            </table>
            </div>

            <div className="d-flex flex-wrap gap-2">
            <Button type="button" color="primary" onClick={() => {                                 
                                    navigate(`/compras/edit/${id}`);
                                }}>
                  Editar  
                </Button>{" "}
              <Button type="reset" color="secondary" onClick={() => navigate("/compras")}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default View
