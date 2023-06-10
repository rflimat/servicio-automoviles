import React, { useState } from "react";
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
import { get, put } from "../../../helpers/api_helper";
import { useEffect } from "react";

const Index = () => {
  const [estadoAnt, setEstadoAnt] = useState();
  const [element, setElement] = useState({
    idServicio: null,
    fecha_hora_creacion: "",
    fecha_hora_cancelacion: "",
    idMetodo_pago: null,
    nro_comprobante: "",
    estado: null,
    costo_total: 0
  });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      fecha_hora_creacion: element.fecha_hora_creacion,
      fecha_hora_cancelacion: element.fecha_hora_cancelacion,
      idMetodo_pago: element.idMetodo_pago,
      nro_comprobante: element.nro_comprobante,
      estado: element.estado,
      costo_total: element.costo_total,
    },
    validationSchema: Yup.object().shape({
      idMetodo_pago: Yup.string().required("El valor es requerido ser seleccionado"),
      nro_comprobante: Yup.string().required("El valor es requerido"),
      estado: Yup.string().required("El valor es requerido ser seleccionado"),
    }),
    onSubmit: (elementf) => {
      const comprobante = {
        ...element,
        ...elementf,
        fecha_hora_cancelacion: !estadoAnt && elementf.estado == 1 ? format(new Date(), "yyyy-MM-dd HH:mm:ss") : elementf.fecha_hora_salida,
      }
      addSwal("comprobante").then((result) => {
        if (result.isConfirmed) {
          put(`${import.meta.env.VITE_API_URL}/comprobantes/${id}`, comprobante)
            .then((res) => {
              successSwal("comprobante", "generado").then((result) => {
                navigate(`/${searchParams.get('tipo') == "trabajo" ? "trabajos" : "ventas"}`);
              })
            })
            .catch((err) => {
              errorSwal(err);
            });
        }
      });
    },
  });

  useEffect(() => {
    const getById = async () => {
      const data = await get(`${import.meta.env.VITE_API_URL}/comprobantes/${id}`);
      setElement(data);
      let estadoAnt = data.estado == 0 ? false : true;
      setEstadoAnt(estadoAnt);
    }
    getById();
  }, []);

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
              <Input
                name="fecha_hora_creacion"
                value={validationType.values.fecha_hora_creacion}
                type="datetime-local"
                readOnly
              />
              {validationType.touched.fecha_hora_creacion &&
                validationType.errors.fecha_hora_creacion ? (
                <FormFeedback type="invalid">
                  {validationType.errors.fecha_hora_creacion}
                </FormFeedback>
              ) : null}
            </div>
            {validationType.values.estado == 1 && (
              <div className="mb-3">
                <Label className="form-label">Fecha y hora de cancelacion</Label>
                {!estadoAnt && (
                  <DateTimeInput
                    name="fecha_hora_cancelacion"
                    value={validationType.values.fecha_hora_cancelacion}
                    onDateTimeChange={validationType.handleChange}
                  />
                )}

                {estadoAnt && (
                  <Input
                    name="fecha_hora_cancelacion"
                    value={validationType.values.fecha_hora_cancelacion}
                    type="datetime-local"
                    readOnly
                  />
                )}

                {validationType.touched.fecha_hora_cancelacion &&
                  validationType.errors.fecha_hora_cancelacion ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.fecha_hora_cancelacion}
                  </FormFeedback>
                ) : null}
              </div>
            )}
            <div className="mb-3">
              <Label>Metodo de pago</Label>
              <CustomSelect
                name="idMetodo_pago"
                defaultValue={validationType.values.idMetodo_pago}
                value={validationType.values.idMetodo_pago}
                onChange={element => validationType.setFieldValue("idMetodo_pago", element.value)}
                options={[
                  { label: "Boleta", value: 1 },
                  { label: "Factura", value: 2 },
                  { label: "Convencional", value: 3 },
                ]}
                placeholder="Seleccione metodo de pago"
                className="select2-selection"
              />
              {validationType.touched.idMetodo_pago && validationType.errors.idMetodo_pago ? (
                <FormFeedback type="invalid">
                  {validationType.errors.idMetodo_pago}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Numero de comprobante</Label>
              <Input
                name="nro_comprobante"
                placeholder="Ingrese numero de comprobante"
                type="text"
                value={validationType.values.nro_comprobante || ""}
                invalid={
                  validationType.touched.nro_comprobante &&
                    validationType.errors.nro_comprobante
                    ? true
                    : false
                }
                readOnly
              />
              {validationType.touched.nro_comprobante &&
                validationType.errors.nro_comprobante ? (
                <FormFeedback type="invalid">
                  {validationType.errors.nro_comprobante}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label>Estado</Label>
              <CustomSelect
                defaultValue={validationType.values.estado}
                value={validationType.values.estado}
                onChange={(element) =>
                  validationType.setFieldValue("estado", element.value)
                }
                options={[
                  { label: "Registrado", value: 0 },
                  { label: "Cancelado", value: 1 },
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
            <div className="mb-3">
              <Label className="form-label">Costo total</Label>
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">S/.</span>
                <Input
                  name="costo_total"
                  placeholder="Ingrese costo total"
                  type="text"
                  value={validationType.values.costo_total || ""}
                  invalid={
                    validationType.touched.costo_total &&
                      validationType.errors.costo_total
                      ? true
                      : false
                  }
                  readOnly
                />
              </div>
              {validationType.touched.costo_total &&
                validationType.errors.costo_total ? (
                <FormFeedback type="invalid">
                  {validationType.errors.costo_total}
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
