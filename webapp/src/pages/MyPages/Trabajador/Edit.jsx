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
      Nombres: "",
      Apellidos: "",
      celular: "",
      tipo_Documento: "",
      Nro_documento: "",
      correo: "",
      });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getById = async () => {
            const data = await get(`${import.meta.env.VITE_API_URL}/trabajadores/${id}`);
            setElement(data);
        }
        getById();
    }, []);

    const validationType = useFormik({
        enableReinitialize: true, // Use this flag when initial values needs to be changed
        initialValues: {
          Nombres: element.Nombres,
          Apellidos: element.Apellidos,
          celular: element.celular,
          correo: element.correo,
        },
        validationSchema: Yup.object().shape({
          Nombres: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
          Apellidos: Yup.string().min(3, "Debe tener como mínimo 3 caracteres")
          .max(30, "Debe tener como máximo 30 caracteres").required("El valor es requerido"),
          celular: Yup.string().required("El valor es requerido"),
          correo: Yup.string().email("Debe ser un correo valido").required("El valor es requerido"),
      }),
        onSubmit: (element) => {
          editSwal("trabajador").then((result) => {
            if (result.isConfirmed) {
              put(`${import.meta.env.VITE_API_URL}/trabajadores/${id}`, element)
                .then((res) => {
                  successSwal("Trabajador", "actualizado").then(() => {
                    navigate("/trabajadores");
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
            title="Trabajador"
            breadcrumbItem="Registrar trabajador"
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
                name="Nombres"
                placeholder="Ingrese nombres"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.Nombres || ""}
                invalid={
                  validationType.touched.Nombres &&
                    validationType.errors.Nombres
                    ? true
                    : false
                }
              />
              {validationType.touched.Nombres &&
                validationType.errors.Nombres ? (
                <FormFeedback type="invalid">
                  {validationType.errors.Nombres}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Apellidos</Label>
              <Input
                name="Apellidos"
                placeholder="Ingrese Apellidos"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.Apellidos || ""}
                invalid={
                  validationType.touched.Apellidos &&
                    validationType.errors.Apellidos
                    ? true
                    : false
                }
              />
              {validationType.touched.Apellidos &&
                validationType.errors.Apellidos ? (
                <FormFeedback type="invalid">
                  {validationType.errors.Apellidos}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Telefono</Label>
              <Input
                name="celular"
                placeholder="Ingrese celular"
                type="number"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.celular || ""}
                invalid={
                  validationType.touched.celular &&
                    validationType.errors.celular
                    ? true
                    : false
                }
              />
              {validationType.touched.celular &&
                validationType.errors.celular ? (
                <FormFeedback type="invalid">
                  {validationType.errors.celular}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Correo electrónico</Label>
              <Input
                name="correo"
                placeholder="Ingrese correo electrónico válido"
                type="email"
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
              <Button type="reset" color="secondary" onClick={() => navigate("/trabajadores")}>
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