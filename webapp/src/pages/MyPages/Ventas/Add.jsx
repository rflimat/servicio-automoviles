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
import DateTimeInput from "../../../components/Common/DateTimeInput";

import { format } from 'date-fns'
import CustomSelect from "../../../components/Common/CustomSelect";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { addSwal, errorSwal, successSwal, customSwal } from "../../../components/Swal";
import { get, post } from "../../../helpers/api_helper";

const Add = () => {
  const tdStyles = {
    background: "inherit",
    width: "100%",
    border: 0,
    padding: 0,
    outline: "none"
  };

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoTemp, setProductoTemp] = useState({});
  const [cantidad, setCantidad] = useState(1);
  const [productosVenta, setProductosVenta] = useState([]);
  const navigate = useNavigate();

  const getClientes = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/clientes`);
    let optionsClientes = data.map((element) => {
      let { id, Nombres, Apellidos } = element;
      return {
        label: `${Nombres} ${Apellidos}`,
        value: id
      }
    })
    setClientes(optionsClientes);
  }

  const getProductos = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/productos`);
    let optionsProductos = data.map((element) => {
      let { id, codigo, nombre, cantidad, precio_venta } = element;
      return {
        element: {
          idProducto: id,
          nombre,
          cantidad,
          precio_venta
        },
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
    if (!productosVenta.find((element) => element.idProducto == producto.idProducto)) {
      producto.index = productosVenta.length + 1;
      producto.cantidadAct = Number(cantidad);
      producto.importe = Number(cantidad) * Number(producto.precio_venta);
      setProductosVenta([...productosVenta, producto]);
      setCantidad(1);
    } else {
      errorSwal({ message: "Producto ya agregado" });
    }
  };

  const verifyCantidadProducto = (value) => {
    let producto = productoTemp;
    let cantidadAct = value;
    // Condicion para determinar si la cantidad de productos ingresada es superior a la cantidad existente
    if (cantidadAct > producto.cantidad) {
      cantidadAct = producto.cantidad; // Si se cumple la condicion, se asigna la cantidad maxima del producto
    }
    setCantidad(cantidadAct);
  }

  const handleChangeProducto = (index, name, newName) => {
    const newProductos = [...productosVenta]; // Obtén una copia del array
    const attributeProducto = {}
    attributeProducto[`${name}`] = newName; // Se asigna el nuevo dato al atributo
    
    newProductos[index] = { ...newProductos[index], ...attributeProducto }; // Modifica el elemento específico dentro de la copia
    
    // Condicion para determinar si la cantidad de productos ingresada es superior a la cantidad existente
    if (newProductos[index].cantidadAct > newProductos[index].cantidad) {
      newProductos[index].cantidadAct = newProductos[index].cantidad; // Si se cumple la condicion, se asigna la cantidad maxima del producto
    }
    
    newProductos[index].importe = Number(newProductos[index].cantidadAct) * Number(newProductos[index].precio_venta); // Se hace la actualizacion del importe del producto
    
    setProductosVenta(newProductos); // Actualiza el estado con la copia modificada del array
  };

  const eliminarProducto = (id) => {
    setProductosVenta((current) =>
      current.filter((producto) => producto.index != id)
    );
  };

  useEffect(() => {
    getClientes();
    getProductos();
  }, []);

  const validationType = useFormik({
    enableReinitialize: false, // Use this flag when initial values needs to be changed
    initialValues: {
      nro_comprobante: "",
      fecha_venta: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      idCliente: null,
    },
    validationSchema: Yup.object().shape({

    }),
    onSubmit: (element) => {
      const venta = {
        ...element,
        total_importe: productosVenta.reduce((total, producto) => total + producto.importe, 0),
        productosVenta
      }
      addSwal("ventas").then((result) => {
        if (result.isConfirmed) {
          post(`${import.meta.env.VITE_API_URL}/ventas`, venta)
            .then((res) => {
              successSwal("venta", "agregado").then(() => {
                if (venta.nro_comprobante) {
                  customSwal({
                    confirmButton: "success",
                    cancelButton: "secondary",
                    title: "Agregar o actualizar comprobante para venta",
                    text: "¿Esta seguro de agregar o actualizar comprobante para venta?",
                    icon: "question",
                    textConfirmButton: "Ok",
                    textCancelButton: "Cancelar"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      let id = res.idComprobante;
                      navigate(`/comprobantes/generate?tipo=venta&id=${id}`);
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
            breadcrumbItem="Registrar Ventas"
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
                <CustomSelect
                  value={validationType.values.idCliente}
                  options={clientes}
                  onChange={(element) => validationType.setFieldValue("idCliente", element.value)}
                  placeholder="Seleccione Cliente"
                  className="select2-selection"
                  isSearchable={true}
                />
                {validationType.touched.idCliente &&
                  validationType.errors.idCliente ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.idCliente}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-12 col-md-3">
                <Label className="form-label">Fecha de venta</Label>
                <DateTimeInput name="fecha_venta" value={validationType.values.fecha_venta} onDateTimeChange={validationType.handleChange} />
                {validationType.touched.fecha_venta &&
                  validationType.errors.fecha_venta ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.fecha_venta}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-12 col-md-3">
                <Label className="form-label">Numero de comprobante</Label>
                <Input
                  name="nro_comprobante"
                  placeholder="Ingrese numero de comprobante"
                  type="text"
                  value={validationType.values.nro_comprobante || ""}
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  invalid={
                    validationType.touched.nro_comprobante &&
                    validationType.errors.nro_comprobante
                      ? true
                      : false
                  }
                />
                {validationType.touched.nro_comprobante &&
                validationType.errors.nro_comprobante ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.nro_comprobante}
                  </FormFeedback>
                ) : null}
              </div>
            </div>

            <div className="card my-3">
              <div className="card-header bg-light">Agregar producto</div>
              <div className="card-body">
                <div id="add-product" className="row mb-3">
                  <div className="col-12 col-md-6 px-0 ps-0 ps-md-2 ps-lg-3">
                    <CustomSelect
                      options={productos}
                      onChange={(element) => getProducto(element)}
                      placeholder="Seleccione Producto"
                      className="select2-selection"
                      isSearchable={true}
                    />
                  </div>
                  <div className="col-12 col-md-2 mt-2 mt-md-0 px-0">
                    <input
                      type="number"
                      className="form-control"
                      aria-describedby="helpId"
                      placeholder="Cantidad de producto"
                      value={cantidad}
                      onChange={(e) => verifyCantidadProducto(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-2 mt-2 mt-md-0 px-0 px-md-2">
                    <button
                      type="button"
                      className="btn btn-primary w-100 w-md-auto px-0 px-md-2"
                      onClick={(e) => addProducto(e)}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered text-center table-hover">
                <thead className="table-success">
                  <tr>
                    <th>N°</th>
                    <th className="col-5">Nombre</th>
                    <th className="col-1">Cantidad</th>
                    <th className="col-2">Precio</th>
                    <th className="col-2">Importe</th>
                    <th>Accion</th>
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
                          S/.{producto.importe.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            eliminarProducto(producto.index);
                          }}
                          className="btn btn-danger"
                        >
                          <i className='bx bx-trash'></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4}>Costo total de la venta:</td>
                    <td colSpan={1} style={{ textAlign: "left" }}>
                      S/.{productosVenta.reduce((total, producto) => total + producto.importe, 0).toFixed(2)}
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

export default Add