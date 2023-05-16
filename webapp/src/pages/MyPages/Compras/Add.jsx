import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import TableContainer from "../../../components/Common/TableContainer";
import { addSwal, errorSwal, successSwal } from "../../../components/Swal";
import { get, post } from "../../../helpers/api_helper";

const Add = () => {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoTemp, setProductoTemp] = useState({});
  const [cantidad, setCantidad] = useState(1);
  const [productosCompra, setProductosCompra] = useState([]);
  const navigate = useNavigate();

  const getProveedores = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/proveedores`);
    let optionsProveedores = data.map((element) => {
      let { id, nombre } = element;
      return {
        label: nombre,
        value: id
      }
    })
    setProveedores(optionsProveedores);
  }

  const getProductos = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/productos`);
    let optionsProductos = data.map((element) => {
      let { id, codigo, nombre } = element;
      return {
        element: element,
        label: `${codigo} => ${nombre}`,
        value: id
      }
    })
    setProductos(optionsProductos);
  }

  const getProducto = (producto) => {
    setProductoTemp(producto.element);
  }

  const addProducto = (e) => {
    e.preventDefault();
    let producto = productoTemp;
    producto.cantidad = cantidad;
    producto.importe = cantidad * productoTemp.precio_venta;
    setProductosCompra([...productosCompra, producto]);
    setCantidad(1);
  };

  const eliminarProducto = (id) => {
    setProductosCompra((current) =>
      current.filter((producto) => producto.id != id)
    );
  };

  useEffect(() => {
    getProveedores();
    getProductos();
  }, []);



  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      estado: 0,
      datetimeCompra: format(new Date(), "yyyy-MM-dd hh:mm"),
      datetimeRecepcion: format(new Date(), "yyyy-MM-dd hh:mm"),
      proveedorId: 0,
    },
    validationSchema: Yup.object().shape({

    }),
    onSubmit: (element) => {
      //console.log(element);
      //console.log(productosCompra);
      const compra = {
        ...element,
        productosCompra
      }
      addSwal("compras").then((result) => {
        if (result.isConfirmed) {
          console.log(compra);
          /*post(`${import.meta.env.VITE_API_URL}/compras`, element)
            .then((res) => {
              successSwal("compra", "agregado").then(() => {
                navigate("/productos");
              });
            })
            .catch((err) => {
              errorSwal(err);
            });*/
        }
      })
    },
  });

  setInterval(() => {
    validationType.values.datetimeCompra = format(new Date(), "yyyy-MM-dd hh:mm:ss");
    validationType.values.datetimeRecepcion = format(new Date(), "yyyy-MM-dd hh:mm:ss");
  }, 1000);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Compras"
            breadcrumbItem="Registrar Compras"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="row">
              <div className="mb-3 col-6">
                <Label>Proveedor</Label>
                <CustomSelect
                  value={validationType.values.proveedorId}
                  options={proveedores}
                  onChange={(element) => validationType.setFieldValue("proveedorId", element.value)}
                  placeholder="Seleccione Proveedor"
                  className="select2-selection"
                />
                {validationType.touched.proveedor &&
                  validationType.errors.proveedor ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.proveedor}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-3">
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
                />
                {validationType.touched.datetimeCompra &&
                  validationType.errors.datetimeCompra ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.datetimeCompra}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-3">
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
                />
                {validationType.touched.datetimeRecepcion &&
                  validationType.errors.datetimeRecepcion ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.datetimeRecepcion}
                  </FormFeedback>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <Label>Estado</Label>
              <CustomSelect
                defaultValue={{ label: "Registrado", value: 0 }}
                value={validationType.values.estado}
                onChange={element => validationType.setFieldValue("estado", element.value)}
                options={[
                  { label: "Registrado", value: "0" },
                  { label: "Recepcionado", value: "1" },
                  
                ]}
                placeholder="Seleccione estado"
                className="select2-selection"
              />
              {validationType.touched.estado &&
                validationType.errors.estado ? (
                <FormFeedback type="invalid">
                  {validationType.errors.estado}
                </FormFeedback>
              ) : null}
            </div>

            <div className="card my-3">
              <div className="card-header">Agregar producto</div>
              <div className="card-body">
                <div id="add-product" className="mb-3 input-group">
                  <CustomSelect
                    options={productos}
                    onChange={(element) => getProducto(element)}
                    placeholder="Seleccione Producto"
                    className="select2-selection"
                  />
                  <input
                    type="number"
                    className="form-control"
                    aria-describedby="helpId"
                    placeholder="Cantidad de producto"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-primary px-2 px-sm-5"
                    onClick={(e) => addProducto(e)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            <table className="table table-bordered text-center table-hover">
              <thead className="table-success">
                <tr>
                  <th className="col-1">N°</th>
                  <th className="col-3">Nombre</th>
                  <th className="col-3">Observacion</th>
                  <th className="col-2">Cantidad</th>
                  <th className="col-2">Precio</th>
                  <th className="col-2">Importe</th>
                  <th className="col-1">Accion</th>
                </tr>
              </thead>
              <tbody>
                {productosCompra.map((producto, index) => (
                  <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td>{producto.nombre}</td>
                    <td>{"Observacion"}</td>
                    <td>{producto.cantidad}</td>
                    <td>S/.{producto.precio_venta}</td>
                    <td>S/.{producto.importe.toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          eliminarProducto(producto.id);
                        }}
                        className="btn btn-danger w-100"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={6}>Costo total de la compra:</td>
                  <td>
                    S/.{productosCompra.reduce((total, producto) => total + producto.importe, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
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

export default Add;
