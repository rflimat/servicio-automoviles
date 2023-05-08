import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";
import Select from "react-select";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { addSwal, errorSwal, successSwal } from "../../../components/Swal";
import { post } from "../../../helpers/api_helper";

const Add = () => {
  const [tipoDocumento, setTipoDocumento] = useState(null); 
  const [numeroDocumento, setNumeroDocumento] = useState("");

  const navigate = useNavigate();

  const handleTipoDocumento = (tipoDocumento) => {
    setTipoDocumento(tipoDocumento.value);
  }

  /*const handleNumeroDocumento = (e) => {
    e.target.value.length <= 8 && setNumeroDocumento(e.target.value);
    validationType.handleChange(e);
  }*/

  const validationType = useFormik({
    enableReinitialize: false, // Use this flag when initial values needs to be changed
    initialValues: {
      nombre: "",
      tipoDocumento: tipoDocumento,
      numeroDocumento: numeroDocumento,
      direccion: "",
      telefono: "",
    },
    validationSchema: Yup.object().shape({
      nombre: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
      tipoDocumento: Yup.string().required("El valor es requerido ser seleccionado"),
      numeroDocumento: Yup.string().length(8, "Debe tener 8 caracteres"),
      direccion: Yup.string(),
      telefono: Yup.string().required("El valor es requerido"),
    }),
    onSubmit: (element) => {
      console.log(element);
      /*addSwal("proveedor").then((result) => {
        if (result.isConfirmed) {
          post(`http://127.0.0.1:8000/api/proveedor`, element)
            .then((res) => {
              successSwal("proveedor", "agregado").then(() => {
                navigate("/proveedores");
              });
            })
            .catch((err) => {
              errorSwal(err);
            });
        }
      });*/
    },
  });

  //meta title
  document.title = "Registrar Proveedores | Servicios Electricos Laser";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Proveedor"
            breadcrumbItem="Registrar Proveedor"
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
                <Select
                    value={tipoDocumento}
                    onChange={handleTipoDocumento}
                    options={[
                        { label: "DNI", value: "DNI" },
                        { label: "RUC", value: "RUC" },
                        { label: "Carnet de Extranjeria", value: "Carnet de Extranjeria" },
                        { label: "Pasaporte", value: "Pasaporte" },
                    ]}
                    placeholder="Seleccione tipo de documento"
                    className="select2-selection"
                />
            </div>
            <div className="mb-3">
              <Label className="form-label">Numero de documento</Label>
              <Input
                name="numeroDocumento"
                placeholder="Ingrese numero de documento"
                type="string"
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
              <Label className="form-label">Dirección</Label>
              <Input
                name="direccion"
                placeholder="Ingrese numero de direccion"
                type="tel"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.direccion || ""}
                invalid={
                  validationType.touched.direccion &&
                    validationType.errors.direccion
                    ? true
                    : false
                }
              />
              {validationType.touched.direccion &&
                validationType.errors.direccion ? (
                <FormFeedback type="invalid">
                  {validationType.errors.direccion}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Numero de telefono</Label>
              <Input
                name="telefono"
                placeholder="Ingrese numero de telefono"
                type="tel"
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
};

export default Add;
