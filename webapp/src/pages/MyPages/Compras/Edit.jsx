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
    fecha_compra: "",
    fecha_recepcion: "",
    costo_compra: "",
    nombreProveedor: "",
  });

  const [estadoAnt, setEstadoAnt] = useState("");
  const [productosCompra, setProductosCompra] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChangeProducto = (index, name, newName) => {
    const newProductos = [...productosCompra]; // Obtén una copia del array
    const attributeProducto = {}
    attributeProducto[`${name}`] = newName;
    newProductos[index] = { ...newProductos[index], ...attributeProducto }; // Modifica el elemento específico dentro de la copia
    newProductos[index].importe = Number(newProductos[index].cantidad) * Number(newProductos[index].precio);
    setProductosCompra(newProductos); // Actualiza el estado con la copia modificada del array
  };

  useEffect(() => {
    const getById = async () => {
      const data = await get(`${import.meta.env.VITE_API_URL}/compras/${id}`);
      setElement(data);
      setProductosCompra(data.productosCompra)
      let estadoAnt = data.estado;
      setEstadoAnt(estadoAnt);
    }
    getById();
  }, []);

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      estado: element.estado == "Registrado" ? "0" : "1",
      datetimeCompra: element.fecha_compra,
      datetimeRecepcion: element.fecha_recepcion,
      proveedor: element.nombreProveedor,
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: (element) => {
      const compra = {
        fecha_compra: element.datetimeCompra,
        fecha_recepcion: estadoAnt == "Registrado" && element.estado == 1 ? format(new Date(), "yyyy-MM-dd HH:mm:ss") : element.datetimeRecepcion,
        estado: element.estado,
        costo_compra: productosCompra.reduce((total, producto) => total + Number(producto.importe), 0),
        productosCompra
      }
      editSwal("compras").then((result) => {
        if (result.isConfirmed) {
          put(`${import.meta.env.VITE_API_URL}/compras/${id}`, compra)
            .then((res) => {
              successSwal("compra", "actualizado").then(() => {
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
            breadcrumbItem="Editar Compras"
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
              { validationType.values.estado == 1 &&
              (<div className="mb-3 col-12 col-md-3">
                <Label className="form-label">Fecha y hora de recepcion</Label>
                <DateTimeInput name="datetimeRecepcion" value={validationType.values.datetimeRecepcion} onDateTimeChange={validationType.handleChange} />
                {validationType.touched.datetimeRecepcion &&
                  validationType.errors.datetimeRecepcion ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.datetimeRecepcion}
                  </FormFeedback>
                ) : null}
              </div>)}
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
                  {productosCompra.map((producto, index) => (
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
                            value={producto.precio}
                            onChange={(e) => handleChangeProducto(index, "precio", e.target.value)}
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
                    <td colSpan={5}>Costo total de la compra:</td>
                    <td colSpan={1}>
                      S/.{productosCompra.reduce((total, producto) => total + Number(producto.importe), 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

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

export default Edit
