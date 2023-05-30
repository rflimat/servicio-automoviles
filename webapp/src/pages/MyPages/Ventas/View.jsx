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
    fecha: "",
    hora: "",
    costo_venta: 0,
    nombre: "",
    productosVenta: [],
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getById = async () => {
      const data = await get(`${import.meta.env.VITE_API_URL}/ventas/${id}`);
      setElement(data);
    }
    getById();
  }, []);

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      datetimeVenta: `${element.fecha} ${element.hora}`,
      cliente: element.nombreCliente,
      costo_venta: element.costo_venta
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: (element) => {
      const venta = {
        fecha_venta: element.datetimeVenta,
        costo_venta: productosVenta.reduce((total, producto) => total + producto.importe, 0),
        cliente_id: element.cliente,
        productosVenta
      }
      editSwal("ventas").then((result) => {
        if (result.isConfirmed) {
          console.log(venta);
          post(`${import.meta.env.VITE_API_URL}/ventas`, venta)
            .then((res) => {
              successSwal("venta", "agregado").then(() => {
                navigate("/ventas");
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
            title="Ventas"
            breadcrumbItem="Ver Ventas"
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
                <Label>Cliente</Label>
                <Input
                  value={validationType.values.cliente}
                  placeholder="Seleccione Cliente"
                  readOnly
                />
                {validationType.touched.cliente &&
                  validationType.errors.cliente ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.cliente}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-12 col-md-6">
                <Label className="form-label">Fecha y hora de venta</Label>
                <Input
                  name="datetimeVenta"
                  type="datetime-local"
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.datetimeVenta || ""}
                  invalid={
                    validationType.touched.datetimeVenta &&
                      validationType.errors.datetimeVenta
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.datetimeVenta &&
                  validationType.errors.datetimeVenta ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.datetimeVenta}
                  </FormFeedback>
                ) : null}
              </div>
            </div>

            <div className="table-responsive">
            <table className="table table-bordered text-center table-hover">
              <thead className="table-success">
                <tr>
                  <th>N°</th>
                  <th className="col-6">Nombre</th>
                  <th className="col-1">Cantidad</th>
                  <th className="col-2">Precio</th>
                  <th className="col-2">Importe</th>
                </tr>
              </thead>
              <tbody>
                {element.productosVenta.map((producto, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>
                      {producto.nombre}
                    </td>
                    <td>
                      {producto.cantidadAct}
                    </td>
                    <td>
                      S/. {producto.precio_venta.toFixed(2)}
                    </td>
                    <td>
                      S/. {producto.importe}
                    </td>
                   
                  </tr>
                ))}
                <tr>
                  <td colSpan={4}>Costo total de la venta:</td>
                  <td colSpan={1}>
                    S/.{validationType.values.costo_venta}
                  </td>
                </tr>
              </tbody>
            </table>
            </div>

            <div className="d-flex flex-wrap gap-2">
            <Button type="button" color="primary" onClick={() => {                                 
                                    navigate(`/ventas/edit/${id}`);
                                }}>
                  Editar  
                </Button>{" "}
              <Button type="reset" color="secondary" onClick={() => navigate("/ventas")}>
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