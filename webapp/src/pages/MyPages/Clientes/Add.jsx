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
import CustomSelect from "../../../components/Common/CustomSelect";

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
        Nombres: "",
        Apellidos: "",
        celular: "",
        tipo_Documento: "",
        Nro_documento: "",
        correo: "",
    },
    validationSchema: Yup.object().shape({
        Nombres: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
        Apellidos: Yup.string().min(3, "Debe tener como mínimo 3 caracteres")
        .max(30, "Debe tener como máximo 30 caracteres").required("El valor es requerido"),
        celular: Yup.string().required("El valor es requerido"),
        tipo_Documento: Yup.string().required("El valor es requerido"),
        Nro_documento: Yup.string().matches(/^[0-9]+$/, "Solo numeros")
        .required("El valor es requerido").test({
          name: 'Nro_documento',
          skipAbsent: true,
          test(value, ctx) {
            let tipo_Documento = ctx.parent.tipo_Documento;
            if (tipo_Documento === "DNI" && value.length !== 8) {
              return ctx.createError({ message: 'Numero de DNI no valido' })
            }
            if (tipo_Documento === "RUC" && value.length !== 11) {
              return ctx.createError({ message: 'Numero de RUC no valido' })
            }
            return true;
          }
        }),
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
                name="Nombres"
                placeholder="Ingrese nombre del cliente"
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
              <Label>Tipo de documento</Label>
              <CustomSelect
                defaultValue={{ label: "Seleccione", value: "Seleccione" }}
                value={validationType.values.tipo_Documento}
                onChange={element => validationType.setFieldValue("tipo_Documento", element.value)}
                options={[
                  { label: "DNI", value: "DNI" },
                  { label: "RUC", value: "RUC" },
                ]}
                placeholder="Seleccione tipo de documento"
                className="select2-selection"
              />
              {validationType.touched.tipo_Documento &&
                validationType.errors.tipo_Documento ? (
                <FormFeedback type="invalid">
                  {validationType.errors.tipo_Documento}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Numero de documento</Label>
              <Input
                name="Nro_documento"
                placeholder="Ingrese numero de documento"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.Nro_documento || ""}
                invalid={
                  validationType.touched.Nro_documento &&
                    validationType.errors.Nro_documento
                    ? true
                    : false
                }
              />
              {validationType.touched.Nro_documento &&
                validationType.errors.Nro_documento ? (
                <FormFeedback type="invalid">
                  {validationType.errors.Nro_documento}
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
