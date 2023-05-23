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
import { editSwal, errorSwal, successSwal } from "../../../components/Swal";
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
    fecha_venta: "",
    fecha_recepcion: "",
    costo_venta: "",
    nombreCliente: "",
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
      estado: element.estado == "Registrado" ? "0" : "1",
      datetimeVenta: element.fecha_venta,
      cliente: element.nombreCliente,
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: (element) => {
      const venta = {
        fecha_venta: element.datetimeVenta,
        estado: element.estado,
        costo_venta: productosVenta.reduce((total, producto) => total + Number(producto.importe), 0),
        productosVenta
      }
      editSwal("ventas").then((result) => {
        if (result.isConfirmed) {
          put(`${import.meta.env.VITE_API_URL}/ventas/${id}`, venta)
            .then((res) => {
              successSwal("venta", "actualizado").then(() => {
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

            <div className="mb-3">
              <Label>Estado</Label>

              {validationType.values.estado == 0 ? (
                <CustomSelect
                  defaultValue={{ label: "Registrado", value: "0" }}
                  value={validationType.values.estado}
                  onChange={element => validationType.setFieldValue("estado", element.value)}
                  options={[
                    { label: "Registrado", value: "0" },
                    { label: "Recepcionado", value: "1" },
                  ]}
                  placeholder="Seleccione estado"
                  className="select2-selection"
                />

              ) : (

                <Input
                  type="text"
                  value={validationType.values.estado == 1 && "Recepcionado"}
                  placeholder="Seleccione estado"
                  readOnly
                />
              )}

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
                  {productosVenta.map((producto, index) => (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>
                        {producto.nombre}
                      </td>
                      <td>
                        {producto.observacion}
                      </td>
                      <td>
                        <Input
                          name="cantidad"
                          type="text"
                          value={producto.cantidad}
                          onChange={(e) => handleChangeProducto(index, "cantidad", e.target.value)}
                          style={{ ...tdStyles, textAlign: "center" }}
                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          S/.
                          <Input
                            name="precio"
                            type="text"
                            value={producto.precio_venta}
                            onChange={(e) => handleChangeProducto(index, "precio_venta", e.target.value)}
                            style={tdStyles}
                          />
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
                    <td colSpan={5}>Costo total de la venta:</td>
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