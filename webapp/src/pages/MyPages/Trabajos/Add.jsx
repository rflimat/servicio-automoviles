import React, { useState, useEffect } from "react";
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
import CustomDropzone from "../../../components/Common/CustomDropzone";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { addSwal, errorSwal, successSwal, customSwal } from "../../../components/Swal";
import { get, post } from "../../../helpers/api_helper";
import DateTimeInput from "../../../components/Common/DateTimeInput";

const Add = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedFiles, setselectedFiles] = useState([])

  const navigate = useNavigate();

  const getTrabajadores = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/trabajadores`);
    let optionsTrabajadores = data.map((element) => {
      let { id, Nombres, Apellidos } = element;
      return {
        label: `${Nombres} ${Apellidos}`,
        value: id
      }
    })
    setTrabajadores(optionsTrabajadores);
  }

  const getVehiculos = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/vehiculos`);
    let optionsVehiculos = data.map((element) => {
      let { id, placa } = element;
      return {
        label: `${placa}`,
        value: id
      }
    })
    setVehiculos(optionsVehiculos);
  }

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      idTrabajador: "",
      problema_inicial: "",
      fecha_hora_ingreso: "",
      fecha_hora_salida: "",
      costo: "",
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: (element) => {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('file', file));
      console.log(...formData);

      addSwal("trabajo").then((result) => {
        if (result.isConfirmed) {
          /*post(`${import.meta.env.VITE_API_URL}/trabajos`, element)
            .then((res) => {
              post(`${import.meta.env.VITE_API_URL}/trabajos/upload`, formData)
                .then((res) => {
                  successSwal("trabajo", "agregado").then(() => {
                    customSwal({
                      confirmButton: "success",
                      cancelButton: "secondary",
                      title: "Generar comprobante para trabajo",
                      text: "¿Esta seguro de generar comprobante para trabajo?",
                      icon: "question",
                      textConfirmButton: "Generar",
                      textCancelButton: "Cancelar"
                    }).then((result) => {
                      if (result.isConfirmed) {
                        let id = 1;
                        navigate(`/comprobante/generate?tipo=trabajo&id=${id}`);
                      } else {
                        navigate("/trabajos");
                      }
                    });
                  });
                })
                .catch((err) => {
                  errorSwal(err);
                });
            })
            .catch((err) => {
              errorSwal(err);
            });*/
          successSwal("trabajo", "agregado").then(() => {
            customSwal({
              confirmButton: "success",
              cancelButton: "secondary",
              title: "Generar comprobante para trabajo",
              text: "¿Esta seguro de generar comprobante para trabajo?",
              icon: "question",
              textConfirmButton: "Generar",
              textCancelButton: "Cancelar"
            }).then((result) => {
              if (result.isConfirmed) {
                let id = 1;
                navigate(`/comprobante/generate?tipo=trabajo&id=${id}`);
              } else {
                navigate("/trabajos");
              }
            });
          });
        }
      });
    },
  });

  useEffect(() => {
    getTrabajadores();
    getVehiculos();
  }, []);

  //meta title
  document.title = "Registrar Trabajo | Servicios Electricos Laser";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Trabajo"
            breadcrumbItem="Registrar Trabajo"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="row">
              <div className="mb-3 col-12 col-md-6">
                <Label>Trabajador</Label>
                <CustomSelect
                  value={validationType.values.idTrabajador}
                  options={trabajadores}
                  onChange={(element) => validationType.setFieldValue("idTrabajador", element.value)}
                  placeholder="Seleccione Trabajador"
                  className="select2-selection"
                  isSearchable={true}
                />
                {validationType.touched.idTrabajador &&
                  validationType.errors.idTrabajador ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.idTrabajador}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-12 col-md-6">
                <Label className="form-label">Trabajo a realizar</Label>
                <Input
                  name="nombre"
                  placeholder="Ingrese trabajo a realizar"
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
            </div>

            <div className="row">
              <div className="mb-3 col-12 col-md-6">
                <div className="row">
                  <Label>Vehiculo</Label>
                  <div className="col-10">
                    <CustomSelect
                      value={validationType.values.idVehiculo}
                      options={vehiculos}
                      onChange={element => validationType.setFieldValue("idVehiculo", element.value)}
                      placeholder="Seleccione Vehiculo"
                      className="select2-selection"
                      isSearchable={true}
                    />
                    {validationType.touched.idVehiculo &&
                      validationType.errors.idVehiculo ? (
                      <FormFeedback type="invalid">
                        {validationType.errors.idVehiculo}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="col-2 ps-0">
                    <Button type="button" className="w-100 p-1" color="success" onClick={() => navigate("/vehiculos/add")}>
                      <i className="mdi mdi-plus" style={{ fontSize: 20 }} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mb-3 col-12 col-md-6">
                <Label className="form-label">Fecha y hora de inicio de trabajo</Label>
                <DateTimeInput name="fecha_hora_ingreso" value={validationType.values.fecha_hora_ingreso} onDateTimeChange={validationType.handleChange} />
                {validationType.touched.fecha_hora_ingreso &&
                  validationType.errors.fecha_hora_ingreso ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.fecha_hora_ingreso}
                  </FormFeedback>
                ) : null}
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-12 col-md-6">
                <Label className="form-label">Descripcion del problema</Label>
                <Input
                  name="descripcion"
                  placeholder="Ingrese descripcion detallada"
                  type="textarea"
                  style={{ height: 117, resize: "none" }}
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.descripcion || ""}
                  invalid={
                    validationType.touched.descripcion &&
                      validationType.errors.descripcion
                      ? true
                      : false
                  }
                />
                {validationType.touched.descripcion &&
                  validationType.errors.descripcion ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.descripcion}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="col-12 col-md-6">
                {/*<div className="mb-3">
                  <Label className="form-label">Fecha y hora de fin de trabajo</Label>
                  <DateTimeInput name="fecha_hora_salida" value={validationType.values.fecha_hora_salida} onDateTimeChange={validationType.handleChange} />
                  {validationType.touched.fecha_hora_salida &&
                    validationType.errors.fecha_hora_salida ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.fecha_hora_salida}
                    </FormFeedback>
                  ) : null}
                </div>*/}
                <div className="mb-3">
                  <Label className="form-label">Costo estimado</Label>
                  <Input
                    name="precio_venta"
                    placeholder="Ingrese costo estimado"
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
              </div>
            </div>

            <div className="mb-3">
              <Label className="form-label">Estado del vehiculo</Label>
              <CustomDropzone selectedFiles={selectedFiles} setselectedFiles={setselectedFiles} />
            </div>


            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
              </Button>{" "}
              <Button type="reset" color="secondary" onClick={() => navigate("/trabajos")}>
                Cancelar
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Add