import React, { useEffect, useState } from 'react'
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

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { editSwal, errorSwal, successSwal } from "../../../components/Swal";
import { get, put } from "../../../helpers/api_helper";


const Edit = () => {
    const [element, setElement] = useState({
        codigo: "",
        nombre: "",
        precio_venta: "",
        cantidad: "",
        unidad_medida: "",
      });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getById = async () => {
            const data = await get(`http://127.0.0.1:8000/api/productos/${id}`);
            setElement(data);
        }
        getById();
    }, []);

    const validationType = useFormik({
        enableReinitialize: true, // Use this flag when initial values needs to be changed
        initialValues: {
            codigo: element.codigo,
            nombre: element.nombre,
            precio_venta: element.precio_venta,
            cantidad: element.cantidad,
            unidad_medida: element.unidad_medida,
        },
        validationSchema: Yup.object().shape({
            codigo: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
            nombre: Yup.string().min(3, "Debe tener como mínimo 3 caracteres")
            .max(30, "Debe tener como máximo 30 caracteres").required("El valor es requerido"),
            precio_venta: Yup.string().min(1, "Debe tener como mínimo 1 caracter").required("El valor es requerido"),
            cantidad: Yup.string().required("El valor es requerido"),
            unidad_medida: Yup.string().min(2, "Debe tener como mínimo 8 caracteres").required("El valor es requerido"),
        }),
        onSubmit: (element) => {
          editSwal("productos").then((result) => {
            if (result.isConfirmed) {
              put(`http://127.0.0.1:8000/api/productos/${id}`, element)
                .then((res) => {
                  successSwal("producto", "actualizado").then(() => {
                    navigate("/productos");
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
                title="Productos"
                breadcrumbItem="Actualizar Productos"
              />
    
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validationType.handleSubmit();
                  return false;
                }}
              >
                <div className="mb-3">
                  <Label className="form-label">Codigo</Label>
                  <Input
                    name="codigo"
                    placeholder="Ingrese codigo"
                    type="text"
                    onChange={validationType.handleChange}
                    onBlur={validationType.handleBlur}
                    value={validationType.values.codigo || ""}
                    invalid={
                      validationType.touched.codigo &&
                        validationType.errors.codigo
                        ? true
                        : false
                    }
                  />
                  {validationType.touched.codigo &&
                    validationType.errors.codigo ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.codigo}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label className="form-label">Nombre</Label>
                  <Input
                    name="nombre"
                    placeholder="Ingrese nombre"
                    type="text"
                    onChange={validationType.handleChange}
                    onBlur={validationType.handleBlur}
                    value={validationType.values.nombre || ""}
                    invalid={
                      validationType.touched.nombre &&
                        validationType.errors.nombre
                        ? true
                        : false
                    }
                  />
                  {validationType.touched.nombre &&
                    validationType.errors.nombre ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.nombre}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label className="form-label">Precio de Venta</Label>
                  <Input
                    name="precio_venta"
                    placeholder="Ingrese precio de venta"
                    type="number"
                    onChange={validationType.handleChange}
                    onBlur={validationType.handleBlur}
                    value={validationType.values.precio_venta || ""}
                    invalid={
                      validationType.touched.precio_venta &&
                        validationType.errors.precio_venta
                        ? true
                        : false
                    }
                  />
                  {validationType.touched.precio_venta &&
                    validationType.errors.precio_venta ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.precio_venta}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label className="form-label">Cantidad</Label>
                  <Input
                    name="cantidad"
                    placeholder="Ingrese cantidad"
                    type="number"
                    onChange={validationType.handleChange}
                    onBlur={validationType.handleBlur}
                    value={validationType.values.cantidad || ""}
                    invalid={
                      validationType.touched.cantidad &&
                        validationType.errors.cantidad
                        ? true
                        : false
                    }
                  />
                  {validationType.touched.cantidad &&
                    validationType.errors.cantidad ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.cantidad}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="mb-3">
                  <Label>Unidad de Medida</Label>
                  <Input
                    name="unidad_medida"
                    type="text"
                    placeholder="Ingrese unidad de medida"
                    onChange={validationType.handleChange}
                    onBlur={validationType.handleBlur}
                    value={validationType.values.unidad_medida || ""}
                    invalid={
                      validationType.touched.unidad_medida &&
                        validationType.errors.unidad_medida
                        ? true
                        : false
                    }
                  />
                  {validationType.touched.unidad_medida &&
                    validationType.errors.unidad_medida ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.unidad_medida}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <Button type="submit" color="primary">
                    Guardar
                  </Button>{" "}
                  <Button type="reset" color="secondary" onClick={() => navigate("/productos")}>
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