import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";

import { format } from 'date-fns'
import DateTimeInput from "../../../components/Common/DateTimeInput";
import CustomSelect from "../../../components/Common/CustomSelect";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { get } from "../../../helpers/api_helper";
import { useEffect } from "react";

const View = () => {
  const [estadoAnt, setEstadoAnt] = useState();
  const [productosVenta, setProductosVenta] = useState([]);
  const [detalleTrabajo, setDetalleTrabajo] = useState([]);
  const [element, setElement] = useState({
    idServicio: null,
    fecha_hora_creacion: "",
    fecha_hora_cancelacion: "",
    idMetodo_pago: null,
    nro_comprobante: "",
    estado: null,
    costo_total: 0
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      fecha_hora_creacion: element.fecha_hora_creacion,
      fecha_hora_cancelacion: element.fecha_hora_cancelacion,
      idMetodo_pago: element.idMetodo_pago,
      nro_comprobante: element.nro_comprobante,
      cliente: element.cliente,
      estado: element.estado,
      costo_total: element.costo_total,
    },
    validationSchema: Yup.object().shape({
      idMetodo_pago: Yup.string().required("El valor es requerido ser seleccionado"),
      nro_comprobante: Yup.string().required("El valor es requerido"),
      estado: Yup.string().required("El valor es requerido ser seleccionado"),
    }),
    onSubmit: (elementf) => {
    },
  });

  useEffect(() => {
    const getById = async () => {
      const data = await get(`${import.meta.env.VITE_API_URL}/comprobantes/${id}`);
      setElement(data);
      setProductosVenta(data.productosVenta);
      setDetalleTrabajo(data.detalleTrabajo);
      let estadoAnt = data.estado == 0 ? false : true;
      setEstadoAnt(estadoAnt);
    }
    getById();
  }, []);

  //meta title
  document.title =
    "Comprobantes | Servicios Electricos Laser";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Comprobante"
            breadcrumbItem="Ver Comprobante"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <Label className="form-label">Numero de comprobante</Label>
                <Input
                  name="nro_comprobante"
                  placeholder="Ingrese numero de comprobante"
                  type="text"
                  value={validationType.values.nro_comprobante || ""}
                  invalid={
                    validationType.touched.nro_comprobante &&
                      validationType.errors.nro_comprobante
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.nro_comprobante &&
                  validationType.errors.nro_comprobante ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.nro_comprobante}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="col-12 col-md-3 mb-3">
                <Label className="form-label">Fecha y hora de creación</Label>
                <Input
                  name="fecha_hora_creacion"
                  value={validationType.values.fecha_hora_creacion}
                  type="datetime-local"
                  readOnly
                />
                {validationType.touched.fecha_hora_creacion &&
                  validationType.errors.fecha_hora_creacion ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.fecha_hora_creacion}
                  </FormFeedback>
                ) : null}
              </div>
              {validationType.values.estado == 1 && (
                <div className="col-12 col-md-3 mb-3">
                  <Label className="form-label">Fecha y hora de cancelacion</Label>
                  {!estadoAnt && (
                    <DateTimeInput
                      name="fecha_hora_cancelacion"
                      value={validationType.values.fecha_hora_cancelacion}
                      onDateTimeChange={validationType.handleChange}
                    />
                  )}

                  {estadoAnt && (
                    <Input
                      name="fecha_hora_cancelacion"
                      value={validationType.values.fecha_hora_cancelacion}
                      type="datetime-local"
                      readOnly
                    />
                  )}

                  {validationType.touched.fecha_hora_cancelacion &&
                    validationType.errors.fecha_hora_cancelacion ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.fecha_hora_cancelacion}
                    </FormFeedback>
                  ) : null}
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <Label>Metodo de pago</Label>
                <CustomSelect
                  name="idMetodo_pago"
                  defaultValue={validationType.values.idMetodo_pago}
                  value={validationType.values.idMetodo_pago}
                  onChange={element => validationType.setFieldValue("idMetodo_pago", element.value)}
                  options={[
                    { label: "Boleta", value: 1 },
                    { label: "Factura", value: 2 },
                    { label: "Convencional", value: 3 },
                  ]}
                  placeholder="Seleccione metodo de pago"
                  className="select2-selection"
                  isSearchable={false}
                  menuIsOpen={false}
                  openMenuOnClick={false}
                />
                {validationType.touched.idMetodo_pago && validationType.errors.idMetodo_pago ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.idMetodo_pago}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="col-12 col-md-6 mb-3">
                <Label>Estado</Label>
                <CustomSelect
                  defaultValue={validationType.values.estado}
                  value={validationType.values.estado}
                  onChange={(element) =>
                    validationType.setFieldValue("estado", element.value)
                  }
                  options={[
                    { label: "Registrado", value: 0 },
                    { label: "Cancelado", value: 1 },
                  ]}
                  placeholder="Seleccione estado"
                  className="select2-selection"
                  isSearchable={false}
                  menuIsOpen={false}
                  openMenuOnClick={false}
                />
                {validationType.touched.estado && validationType.errors.estado ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.estado}
                  </FormFeedback>
                ) : null}
              </div>
            </div>
            
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <Label className="form-label">Cliente</Label>
                <Input
                  name="cliente"
                  placeholder="Ingrese nombre cliente"
                  type="text"
                  value={validationType.values.cliente || ""}
                  invalid={
                    validationType.touched.cliente &&
                      validationType.errors.cliente
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.cliente &&
                  validationType.errors.cliente ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.cliente}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="col-12 col-md-6 mb-3">
                <Label className="form-label">Costo total</Label>
                <div className="input-group">
                  <span className="input-group-text" id="basic-addon1">S/.</span>
                  <Input
                    name="costo_total"
                    placeholder="Ingrese costo total"
                    type="text"
                    value={validationType.values.costo_total || ""}
                    invalid={
                      validationType.touched.costo_total &&
                        validationType.errors.costo_total
                        ? true
                        : false
                    }
                    readOnly
                  />
                </div>
                {validationType.touched.costo_total &&
                  validationType.errors.costo_total ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.costo_total}
                  </FormFeedback>
                ) : null}
              </div>
            </div>

            { productosVenta.length > 0 && (
              <div className="my-4">
                <h5 className="mb-3">Ventas realizadas</h5>
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
                      {productosVenta.map((producto, index) => (
                        <tr key={index + 1}>
                          <td>{index + 1}</td>
                          <td>
                            {producto.nombre}
                          </td>
                          <td>
                            {producto.cantidad}
                          </td>
                          <td>
                            S/.{producto.precio_venta.toFixed(2)}
                          </td>
                          <td>
                            S/.{producto.importe}
                          </td>

                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4}>Costo total de la venta:</td>
                        <td colSpan={1}>
                          S/.{productosVenta.reduce((total, venta) => total + Number(venta.importe), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              )
            }

            { detalleTrabajo.length > 0 && (
              <div className="my-4">
                <h5 className="mb-3">Trabajos realizados</h5>
                <div className="table-responsive">
                  <table className="table table-bordered text-center table-hover">
                    <thead className="table-success">
                      <tr>
                        <th>N°</th>
                        <th className="col-6">Descripción</th>
                        <th className="col-3">Fecha y Hora</th>
                        <th className="col-2">Costo estimado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalleTrabajo.map((trabajo, index) => (
                        <tr key={index + 1}>
                          <td>{index + 1}</td>
                          <td>
                            {trabajo.descripcion}
                          </td>
                          <td>
                            {format(new Date(trabajo.fecha_hora), "dd/MM/yyyy HH:mm:ss")}
                          </td>
                          <td>
                            S/.{trabajo.costo.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3}>Costo total del trabajo:</td>
                        <td colSpan={1} style={{ textAlign: "left" }}>
                          S/.{detalleTrabajo.reduce((total, trabajo) => total + Number(trabajo.costo), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              )
            }

            <div className="d-flex flex-wrap gap-2">
              <Button type="button" color="primary" onClick={() => {
                navigate(`/comprobantes/generate?id=${id}`);
              }}>
                Editar
              </Button>{" "}
              <Button type="reset" color="secondary" onClick={() => navigate("/comprobantes")}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default View;