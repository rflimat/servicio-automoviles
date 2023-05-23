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
import { addSwal, errorSwal, successSwal } from "../../../components/Swal";
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
  const [clienteId, setClienteId] = useState(0);
  const [estado, setEstado] = useState(0);
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
          id,
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
    if (!productosVenta.find((element) => element.id == producto.id)) {
      producto.index = productosVenta.length + 1;

      if (cantidad > producto.cantidad) {
        producto.cantidadAct = producto.cantidad;
      } else {
        producto.cantidadAct = cantidad;
      }

      producto.importe = cantidad * Number(producto.precio_venta);
      setProductosVenta([...productosVenta, producto]);
      setCantidad(1);
    } else {
      errorSwal({ message: "Producto ya agregado" });
    }
  };

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
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      estado: estado,
      datetimeVenta: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
      clienteId: clienteId,
    },
    validationSchema: Yup.object().shape({

    }),
    onSubmit: (element) => {
      const venta = {
        fecha_venta: element.datetimeVenta,
        costo_venta: productosVenta.reduce((total, producto) => total + producto.importe, 0),
        estado: element.estado,
        cliente_id: element.clienteId,
        productosVenta
      }
      addSwal("ventas").then((result) => {
        if (result.isConfirmed) {
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
                  value={validationType.values.clienteId}
                  options={clientes}
                  onChange={(element) => setClienteId(element.value)}
                  placeholder="Seleccione Cliente"
                  className="select2-selection"
                  isSearchable={true}
                />
                {validationType.touched.clienteId &&
                  validationType.errors.clienteId ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.clienteId}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-12 col-md-6">
                <Label className="form-label">Fecha y hora de venta</Label>
                <DateTimeInput name="datetimeventa" value={validationType.values.datetimeVenta} onDateTimeChange={validationType.handleChange} />
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
              <CustomSelect
                value={validationType.values.estado}
                onChange={element => setEstado(element.value)}
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
                      onChange={(e) => setCantidad(e.target.value)}
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
                            value={producto.precio_venta.toFixed(2)}
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