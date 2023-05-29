import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";

import { format } from 'date-fns'
import DateTimeInput from "../../../components/Common/DateTimeInput";
import CustomSelect from "../../../components/Common/CustomSelect";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { addSwal, errorSwal, successSwal } from "../../../components/Swal";
import { post } from "../../../helpers/api_helper";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleChangeMetodo = (option, formikProps) => {
    let numeroComprobante = "";
    console.log(option);
    formikProps.setFieldValue("metodo", option.value);
    if (option.value === "Boleta") {
      numeroComprobante = "B-000000001";
    } else if (option.value === "Factura") {
      numeroComprobante = "F-000000001";
    }
    formikProps.setFieldValue(
      "nroComprobante",
      numeroComprobante
    );
  }

  const validationType = useFormik({
    enableReinitialize: false, // Use this flag when initial values needs to be changed
    initialValues: {
      datetimeCreacion: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      metodo: null,
      nroComprobante: "",
      estado: null,
    },
    validationSchema: Yup.object().shape({
      metodo: Yup.string().required("El valor es requerido ser seleccionado"),
      nroComprobante: Yup.string().required("El valor es requerido"),
      estado: Yup.string().required("El valor es requerido ser seleccionado"),
    }),
    onSubmit: (element) => {
      addSwal("comprobante").then((result) => {
        if (result.isConfirmed) {
          /*post(`${import.meta.env.VITE_API_URL}/comprobante`, element)
                                .then((res) => {
                                  successSwal("comprobante", "generado").then(() => {
                                    navigate("/productos");
                                  });
                                })
                                .catch((err) => {
                                  errorSwal(err);
                                });*/
        }
      });
    },
  });
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Comprobante"
            breadcrumbItem="Generar Comprobante"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Fecha y hora de creación</Label>
              <DateTimeInput
                name="datetimeCreacion"
                value={validationType.values.datetimeCreacion}
                onDateTimeChange={validationType.handleChange}
              />
              {validationType.touched.datetimeCreacion &&
              validationType.errors.datetimeCreacion ? (
                <FormFeedback type="invalid">
                  {validationType.errors.datetimeCreacion}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label>Metodo de pago</Label>
              <CustomSelect
                value={validationType.values.metodo}
                onChange={(option) => handleChangeMetodo(option, validationType)}
                options={[
                  { label: "Boleta", value: "Boleta" },
                  { label: "Factura", value: "Factura" },
                ]}
                placeholder="Seleccione metodo de pago"
                className="select2-selection"
              />
              {validationType.touched.metodo && validationType.errors.metodo ? (
                <FormFeedback type="invalid">
                  {validationType.errors.metodo}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Numero de comprobante</Label>
              <Input
                name="nroComprobante"
                placeholder="Ingrese numero de comprobante"
                type="text"
                value={validationType.values.nroComprobante || ""}
                invalid={
                  validationType.touched.nroComprobante &&
                  validationType.errors.nroComprobante
                    ? true
                    : false
                }
                readOnly
              />
              {validationType.touched.nroComprobante &&
              validationType.errors.nroComprobante ? (
                <FormFeedback type="invalid">
                  {validationType.errors.nroComprobante}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label>Estado</Label>
              <CustomSelect
                value={validationType.values.estado}
                onChange={(element) =>
                  validationType.setFieldValue("estado", element.value)
                }
                options={[
                  { label: "Registrado", value: "0" },
                  { label: "Cancelado", value: "1" },
                ]}
                placeholder="Seleccione estado"
                className="select2-selection"
              />
              {validationType.touched.estado && validationType.errors.estado ? (
                <FormFeedback type="invalid">
                  {validationType.errors.estado}
                </FormFeedback>
              ) : null}
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
              </Button>{" "}
              <Button
                type="reset"
                color="secondary"
                onClick={() => navigate(`/${searchParams.get('tipo') == "trabajo" ? "trabajos" : "ventas"}`)}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Index;
