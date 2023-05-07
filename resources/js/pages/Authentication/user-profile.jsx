import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "../../components/Common/withRouter";
import { editSwal, errorSwal, successSwal } from "../../components/Swal.jsx";
import { get, put } from "../../helpers/api_helper.jsx";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/profile.png";

const UserProfile = (props) => {

  //meta title
  document.title = "Perfil | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const [element, setElement] = useState({
    name: "",
    username: "",
    password: "",
    password1: "",
    email: "",
    telefono: "",
  });
  const navigate = useNavigate();

  const obj = JSON.parse(localStorage.getItem("authUser"));
  const id = obj.id;

  useEffect(() => {
    const getById = async () => {
      const data = await get(`http://127.0.0.1:8000/api/usuario/${id}`);
      setElement(data);
    }
    getById();
  }, []);

  const { error, success } = useSelector(state => ({
    error: state,
    success: state,
  }));

  /*useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
        setname(obj.displayName);
        setemail(obj.email);
        setidx(obj.uid);
      } else if (
        import.meta.env.VITE_APP_DEFAULTAUTH === "fake" ||
        import.meta.env.VITE_APP_DEFAULTAUTH === "jwt"
      ) {
        setname(obj.username);
        setemail(obj.email);
        setidx(obj.uid);
      }
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, success]);*/

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      name: element.name,
      username: element.username,
      password: "",
      password1: "",
      email: element.email,
      telefono: element.telefono,
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
      password: Yup.string().min(8, "Debe tener como mínimo 8 caracteres"),
      password1: Yup.string().min(8, "Debe tener como mínimo 8 caracteres").when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Las contraseñas deben ser similares"
        ),
      }),
    }),
    onSubmit: (element) => {
      editSwal("usuario").then((result) => {
        if (result.isConfirmed) {
          put(`http://127.0.0.1:8000/api/usuario/${id}`, element)
            .then((res) => {
              successSwal("Perfil de usuario", "actualizado").then(() => {
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
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Dashboard" breadcrumbItem="Perfil" />

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{name}</h5>
                        <p className="mb-1">{element.email}</p>
                        <p className="mb-0">Id no: #{element.id}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Actualizar perfil</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validationType.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
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
                    <Label>Contraseña {"(Ingresar solo si desea nueva contraseña)"}</Label>
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
                    <Label>Repite Contraseña {"(Ingresar solo si desea nueva contraseña)"}</Label>
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
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="danger">
                    Actualizar
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
