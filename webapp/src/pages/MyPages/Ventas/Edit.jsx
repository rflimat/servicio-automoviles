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
import DateTimeInput from "../../../components/Common/DateTimeInput";

import { format } from 'date-fns'
import CustomSelect from "../../../components/Common/CustomSelect";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { editSwal, errorSwal, successSwal, customSwal } from "../../../components/Swal";
import { get, put } from "../../../helpers/api_helper";

const Edit = () => {
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
    costo_venta: "",
    nombreCliente: "",
    nro_comprobante: ""
  });

  const [productos, setProductos] = useState([]);
  const [productosVenta, setProductosVenta] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const getProductos = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/productos`);
    setProductos(data);
  }

  const handleChangeProducto = (index, name, newName) => {
    const newProductos = [...productosVenta]; // Obtén una copia del array
    const attributeProducto = {}
    attributeProducto[`${name}`] = newName; // Se asigna el nuevo dato al atributo

    newProductos[index] = { ...newProductos[index], ...attributeProducto }; // Modifica el elemento específico dentro de la copia
    
    // Condicion para determinar si la cantidad de productos ingresada es superior a la cantidad existente
    let productoAct = productos.find((element) => element.idProducto == newProductos[index].idProducto);
    if (newProductos[index].cantidadAct > productoAct.cantidad) {
      newProductos[index].cantidadAct = productoAct.cantidad; // Si se cumple la condicion, se asigna la cantidad maxima del producto
    }

    newProductos[index].importe = Number(newProductos[index].cantidadAct) * Number(newProductos[index].precio_venta); // Se hace la actualizacion del importe del producto

    setProductosVenta(newProductos); // Actualiza el estado con la copia modificada del array
  };

  useEffect(() => {
    const getById = async () => {
      const data = await get(`${import.meta.env.VITE_API_URL}/ventas/${id}`);
      setElement(data);
      setProductosVenta(data.productosVenta)
    }
    getById();
    getProductos();
  }, []);

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      datetimeVenta: `${element.fecha} ${element.hora}`,
      datetimeVentaAct: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      cliente: element.nombreCliente,
      nro_comprobante: element.nro_comprobante,
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: (element) => {
      const venta = {
        ...element,
        fecha: format(new Date(element.datetimeVentaAct), "yyyy-MM-dd"),
        hora: format(new Date(element.datetimeVentaAct), "HH:mm:ss"),
        costo_venta: productosVenta.reduce((total, producto) => total + Number(producto.importe), 0),
        productosVenta
      }
      editSwal("ventas").then((result) => {
        if (result.isConfirmed) {
          put(`${import.meta.env.VITE_API_URL}/ventas/${id}`, venta)
            .then((res) => {
              successSwal("venta", "actualizado").then(() => {
                if (element.nro_comprobante.length > 0) {
                  customSwal({
                    confirmButton: "success",
                    cancelButton: "secondary",
                    title: "Actualizar comprobante para venta",
                    text: "¿Esta seguro de actualizar comprobante para venta?",
                    icon: "question",
                    textConfirmButton: "Actualizar",
                    textCancelButton: "Cancelar"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      let id = res.idComprobante;
                      navigate(`/comprobante/generate?tipo=venta&id=${id}`);
                    } else {
                      navigate("/ventas");
                    }
                  })
                } else {
                  navigate("/ventas");
                }
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
            breadcrumbItem="Editar Ventas"
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
              <div className="mb-3 col-12 col-md-3">
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
              <div className="mb-3 col-12 col-md-3">
                <Label className="form-label">Fecha y hora de venta al actualizar</Label>
                <DateTimeInput
                  name="datetimeVentaAct"
                  value={validationType.values.datetimeVentaAct}
                  onDateTimeChange={validationType.handleChange}
                />
                {validationType.touched.datetimeVentaAct &&
                  validationType.errors.datetimeVentaAct ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.datetimeVentaAct}
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
                  {productosVenta.map((producto, index) => (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>
                        {producto.nombre}
                      </td>
                      <td>
                        <Input
                          name="cantidad"
                          type="text"
                          value={producto.cantidadAct}
                          onChange={(e) => handleChangeProducto(index, "cantidadAct", e.target.value)}
                          style={{ ...tdStyles, textAlign: "center" }}
                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          S/.{producto.precio_venta}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          S/.{producto.importe}
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4}>Costo total de la venta:</td>
                    <td colSpan={1}>
                      S/.{productosVenta.reduce((total, producto) => total + Number(producto.importe), 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
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

export default Edit