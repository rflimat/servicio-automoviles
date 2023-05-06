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
      name: "",
      username: "",
      password: "",
      password1: "",
      email: "",
      telefono: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
      username: Yup.string().min(5, "Debe tener como mínimo 5 caracteres")
        .max(30, "Debe tener como máximo 30 caracteres").required("El valor es requerido"),
      email: Yup.string()
        .email("Debe ser un email.valido")
        .max(255)
        .required("Email is required"),
      telefono: Yup.string().required("El valor es requerido"),
      password: Yup.string().min(8, "Debe tener como mínimo 8 caracteres").required("El valor es requerido"),
      password1: Yup.string().min(8, "Debe tener como mínimo 8 caracteres").when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Las contraseñas deben ser similares"
        ),
      }),
    }),
    onSubmit: (element) => {
      addSwal("usuario").then((result) => {
        if (result.isConfirmed) {
          post(`http://127.0.0.1:8000/api/usuario`, element)
            .then((res) => {
              successSwal("usuario", "added").then(() => {
                navigate("/usuarios");
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
            title="Usuarios"
            breadcrumbItem="Registrar Usuario"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Nombre de usuario</Label>
              <Input
                name="name"
                placeholder="Ingrese nombre de usuario"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.name || ""}
                invalid={
                  validationType.touched.name &&
                    validationType.errors.name
                    ? true
                    : false
                }
              />
              {validationType.touched.name &&
                validationType.errors.name ? (
                <FormFeedback type="invalid">
                  {validationType.errors.name}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Usuario</Label>
              <Input
                name="username"
                placeholder="Ingrese usuario"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.username || ""}
                invalid={
                  validationType.touched.username &&
                    validationType.errors.username
                    ? true
                    : false
                }
              />
              {validationType.touched.username &&
                validationType.errors.username ? (
                <FormFeedback type="invalid">
                  {validationType.errors.username}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Numero de telefono</Label>
              <Input
                name="telefono"
                placeholder="Ingrese numero de telefono"
                type="telefono"
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
              <Label className="form-label">Correo electrónico</Label>
              <Input
                name="email"
                placeholder="Ingrese correo electrónico válido"
                type="email"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.email || ""}
                invalid={
                  validationType.touched.email &&
                    validationType.errors.email
                    ? true
                    : false
                }
              />
              {validationType.touched.email &&
                validationType.errors.email ? (
                <FormFeedback type="invalid">
                  {validationType.errors.email}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label>Contraseña</Label>
              <Input
                name="password"
                type="password"
                placeholder="Ingrese contraseña de usuario"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.password || ""}
                invalid={
                  validationType.touched.password &&
                    validationType.errors.password
                    ? true
                    : false
                }
              />
              {validationType.touched.password &&
                validationType.errors.password ? (
                <FormFeedback type="invalid">
                  {validationType.errors.password}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label>Repite Contraseña</Label>
              <Input
                name="password1"
                type="password"
                placeholder="Repita contraseña de usuario"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.password1 || ""}
                invalid={
                  validationType.touched.password1 &&
                    validationType.errors.password1
                    ? true
                    : false
                }
              />
              {validationType.touched.password1 &&
                validationType.errors.password1 ? (
                <FormFeedback type="invalid">
                  {validationType.errors.password1}
                </FormFeedback>
              ) : null}
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
              </Button>{" "}
              <Button type="reset" color="secondary">
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
