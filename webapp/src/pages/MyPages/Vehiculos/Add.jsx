import React from "react";
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

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { addSwal, errorSwal, successSwal } from "../../../components/Swal";
import { post } from "../../../helpers/api_helper";

const Add = () => {
  const navigate = useNavigate();

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
        placa: "",
        marca: "",
        anio: "",
        modelo: "",
        chasis: "",
    },
    validationSchema: Yup.object().shape({
        placa: Yup.string().min(6, "Debe tener como mínimo 6 caracteres").required("El valor es requerido"),
        marca: Yup.string().min(3, "Debe tener como mínimo 3 caracteres")
        .max(30, "Debe tener como máximo 30 caracteres").required("El valor es requerido"),
        anio: Yup.string().required("El valor es requerido"),
        modelo: Yup.string().min(4, "Debe tener como mínimo 4 caracteres").required("El valor es requerido"),
        chasis: Yup.string().min(17, "Debe tener como mínimo 17 caracteres").required("El valor es requerido"),
    }),
    onSubmit: (element) => {
      addSwal("vehiculos").then((result) => {
        if (result.isConfirmed) {
          post(`${import.meta.env.VITE_API_URL}/vehiculos`, element)
            .then((res) => {
              successSwal("vehiculo", "agregado").then(() => {
                navigate("/vehiculos");
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
            title="Vehiculos"
            breadcrumbItem="Registrar vehiculos"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Placa del vehiculo</Label>
              <Input
                name="placa"
                placeholder="Ingrese placa del vehiculo"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.placa || ""}
                invalid={
                  validationType.touched.placa &&
                    validationType.errors.placa
                    ? true
                    : false
                }
              />
              {validationType.touched.placa &&
                validationType.errors.placa ? (
                <FormFeedback type="invalid">
                  {validationType.errors.placa}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Marca</Label>
              <Input
                name="marca"
                placeholder="Ingrese marca"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.marca || ""}
                invalid={
                  validationType.touched.marca &&
                    validationType.errors.marca
                    ? true
                    : false
                }
              />
              {validationType.touched.marca &&
                validationType.errors.marca ? (
                <FormFeedback type="invalid">
                  {validationType.errors.marca}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Año</Label>
              <Input
                name="precio_venta"
                placeholder="Ingrese año"
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
              <Label className="form-label">Modelo</Label>
              <Input
                name="modelo"
                placeholder="Ingrese modelo"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.modelo || ""}
                invalid={
                  validationType.touched.modelo &&
                    validationType.errors.modelo
                    ? true
                    : false
                }
              />
              {validationType.touched.modelo &&
                validationType.errors.modelo ? (
                <FormFeedback type="invalid">
                  {validationType.errors.modelo}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label>N° Chasis</Label>
              <Input
                name="chasis"
                type="text"
                placeholder="Ingrese numero de chasis"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.chasis || ""}
                invalid={
                  validationType.touched.chasis &&
                    validationType.errors.chasis
                    ? true
                    : false
                }
              />
              {validationType.touched.chasis &&
                validationType.errors.chasis ? (
                <FormFeedback type="invalid">
                  {validationType.errors.chasis}
                </FormFeedback>
              ) : null}
            </div>           
            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
              </Button>{" "}
              <Button type="reset" color="secondary" onClick={() => navigate("/vehiculos")}>
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
