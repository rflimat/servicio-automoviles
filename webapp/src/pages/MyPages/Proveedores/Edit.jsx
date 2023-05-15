import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { editSwal, errorSwal, successSwal } from "../../../components/Swal";
import { get, put } from "../../../helpers/api_helper";

const Edit = () => {
  const [element, setElement] = useState({
    nombre: "",
    tipoDocumento: "",
    numeroDocumento: "",
    celular: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getById = async () => {
      const data = await get(`http://127.0.0.1:8000/api/proveedores/${id}`);
      setElement(data);
    }
    getById();
  }, []);

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      nombre: element.nombre,
      tipoDocumento: element.tipoDocumento,
      numeroDocumento: element.numeroDocumento,
      direccion: element.direccion,
      celular: element.celular,
    },
    validationSchema: Yup.object().shape({
      nombre: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
      tipoDocumento: Yup.string().required("El valor es requerido ser seleccionado"),
      numeroDocumento: Yup.string().matches(/^[0-9]+$/, "Solo numeros")
        .required("El valor es requerido").test({
          name: 'numeroDocumento',
          skipAbsent: true,
          test(value, ctx) {
            let tipoDocumento = validationType.values.tipoDocumento;
            if (tipoDocumento === "DNI" && value.length !== 8) {
              return ctx.createError({ message: 'Numero de DNI no valido' })
            }
            if (tipoDocumento === "RUC" && value.length !== 11) {
              return ctx.createError({ message: 'Numero de RUC no valido' })
            }
            return true
          }
        }),
      celular: Yup.string().required("El valor es requerido"),
    }),
    onSubmit: (element) => {
      editSwal("proveedor").then((result) => {
        if (result.isConfirmed) {
          put(`http://127.0.0.1:8000/api/proveedores/${id}`, element)
            .then((res) => {
              successSwal("proveedor", "actualizado").then(() => {
                navigate("/proveedores");
              });
            })
            .catch((err) => {
              errorSwal(err);
            });
        }
      });
    },
  });

  //meta title
  document.title = "Actualizar Proveedor | Servicios Electricos Laser";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Proveedor"
            breadcrumbItem="Actualizar Proveedor"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Nombre de proveedor</Label>
              <Input
                name="nombre"
                placeholder="Ingrese nombre de proveedor"
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
              <Label>Tipo de documento</Label>
              <CustomSelect
                defaultValue={{ label: "RUC", value: "RUC" }}
                value={validationType.values.tipoDocumento}
                onChange={element => validationType.setFieldValue("tipoDocumento", element.value)}
                options={[
                  { label: "DNI", value: "DNI" },
                  { label: "RUC", value: "RUC" },
                  { label: "Carnet de Extranjeria", value: "Carnet de Extranjeria" },
                  { label: "Pasaporte", value: "Pasaporte" },
                ]}
                placeholder="Seleccione tipo de documento"
                className="select2-selection"
              />
              {validationType.touched.tipoDocumento &&
                validationType.errors.tipoDocumento ? (
                <FormFeedback type="invalid">
                  {validationType.errors.tipoDocumento}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Numero de documento</Label>
              <Input
                name="numeroDocumento"
                placeholder="Ingrese numero de documento"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.numeroDocumento || ""}
                invalid={
                  validationType.touched.numeroDocumento &&
                    validationType.errors.numeroDocumento
                    ? true
                    : false
                }
              />
              {validationType.touched.numeroDocumento &&
                validationType.errors.numeroDocumento ? (
                <FormFeedback type="invalid">
                  {validationType.errors.numeroDocumento}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Numero de contacto</Label>
              <Input
                name="celular"
                placeholder="Ingrese numero de contacto"
                type="tel"
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
            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
              </Button>{" "}
              <Button type="reset" color="secondary" onClick={() => navigate("/proveedores")}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default Edit