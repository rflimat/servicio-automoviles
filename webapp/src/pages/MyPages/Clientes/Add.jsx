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
        nombres: "",
        apellidos: "",
        telefono: "",
        dni_ruc: "",
        correo: "",
    },
    validationSchema: Yup.object().shape({
        nombres: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
        apellidos: Yup.string().min(3, "Debe tener como mínimo 3 caracteres")
        .max(30, "Debe tener como máximo 30 caracteres").required("El valor es requerido"),
        telefono: Yup.string().required("El valor es requerido"),
        dni_ruc: Yup.string().min(8, "Debe tener como mínimo 8 caracteres").required("El valor es requerido"),
        correo: Yup.string().email("Debe ser un correo valido").required("El valor es requerido"),
    }),
    onSubmit: (element) => {
      addSwal("clientes").then((result) => {
        if (result.isConfirmed) {
          post(`${import.meta.env.VITE_API_URL}/clientes`, element)
            .then((res) => {
              successSwal("Cliente", "agregado").then(() => {
                navigate("/clientes");
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
            title="Clientes"
            breadcrumbItem="Registrar clientes"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Nombres</Label>
              <Input
                name="nombres"
                placeholder="Ingrese nombre del cliente"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.nombres || ""}
                invalid={
                  validationType.touched.nombres &&
                    validationType.errors.nombres
                    ? true
                    : false
                }
              />
              {validationType.touched.nombres &&
                validationType.errors.nombres ? (
                <FormFeedback type="invalid">
                  {validationType.errors.nombres}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Apellidos</Label>
              <Input
                name="apellidos"
                placeholder="Ingrese apellidos"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.apellidos || ""}
                invalid={
                  validationType.touched.apellidos &&
                    validationType.errors.apellidos
                    ? true
                    : false
                }
              />
              {validationType.touched.apellidos &&
                validationType.errors.apellidos ? (
                <FormFeedback type="invalid">
                  {validationType.errors.apellidos}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Telefono</Label>
              <Input
                name="telefono"
                placeholder="Ingrese telefono"
                type="number"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.telefono || ""}
                invalid={
                  validationType.touched.telefono &&
                    validationType.errors.telefono
                    ? true
                    : false
                }
              />
              {validationType.touched.telefono &&
                validationType.errors.telefono ? (
                <FormFeedback type="invalid">
                  {validationType.errors.telefono}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">DNI / RUC</Label>
              <Input
                name="dni_ruc"
                placeholder="Ingrese dni_ruc"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.dni_ruc || ""}
                invalid={
                  validationType.touched.dni_ruc &&
                    validationType.errors.dni_ruc
                    ? true
                    : false
                }
              />
              {validationType.touched.dni_ruc &&
                validationType.errors.dni_ruc ? (
                <FormFeedback type="invalid">
                  {validationType.errors.dni_ruc}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Correo electrónico</Label>
              <Input
                name="correo"
                placeholder="Ingrese correo electrónico válido"
                type="correo"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.correo || ""}
                invalid={
                  validationType.touched.correo &&
                    validationType.errors.correo
                    ? true
                    : false
                }
              />
              {validationType.touched.correo &&
                validationType.errors.correo ? (
                <FormFeedback type="invalid">
                  {validationType.errors.correo}
                </FormFeedback>
              ) : null}
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
              </Button>{" "}
              <Button type="reset" color="secondary" onClick={() => navigate("/clientes")}>
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
