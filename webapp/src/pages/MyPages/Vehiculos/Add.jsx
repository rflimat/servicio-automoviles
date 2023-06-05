import React, { useState, useMemo, useEffect } from "react";
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

import { format } from 'date-fns';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { addSwal, errorSwal, successSwal } from "../../../components/Swal";
import { get, post } from "../../../helpers/api_helper";

const Add = () => {
  const [clientes, setClientes] = useState([]);
  const [anios, setAnios] = useState([]);
  const navigate = useNavigate();

  const getClientes = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/clientes`);
    let optionsClientes = data.map((element) => {
      let { id, Nombres, Apellidos } = element;
      return {
        label: `${Nombres} ${Apellidos}`,
        value: id
      }
    })
    setClientes(optionsClientes);
  }

  const getAnios = () => {
    let anios = [];
    let anioAct = format(new Date(), "yyyy");
    for (let anio = anioAct; anio >= 1950; anio--) {
      anios.push({
        label: `${anio}`,
        value: `${anio}`
      });
    }
    setAnios(anios);
  }

  useEffect(() => {
    getClientes();
    getAnios();
  }, []);

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
        placa: "",
        marca: "",
        anio: "",
        modelo: "",
        tipo_vehiculo: "",
        cliente_id: "",
    },
    
    validationSchema: Yup.object().shape({
        placa: Yup.string().min(6, "Debe tener como mínimo 6 caracteres").required("El valor es requerido"),
        marca: Yup.string().min(3, "Debe tener como mínimo 3 caracteres")
        .max(30, "Debe tener como máximo 30 caracteres").required("El valor es requerido"),
        anio: Yup.string().required("El valor es requerido"),
        modelo: Yup.string().min(4, "Debe tener como mínimo 4 caracteres").required("El valor es requerido"),
        tipo_vehiculo: Yup.string().min(4, "Debe tener como mínimo 4 caracteres").required("El valor es requerido"),
    }),
    onSubmit: (element) => {
      addSwal("vehiculos").then((result) => {
        if (result.isConfirmed) {
          post(`${import.meta.env.VITE_API_URL}/vehiculos`, element)
            .then((res) => {
              successSwal("vehiculo", "agregado").then(() => {
                navigate("/vehiculos");
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
            title="Vehiculos"
            breadcrumbItem="Registrar vehiculos"
          />

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validationType.handleSubmit();
              return false;
            }}
          >
            <div className="mb-3">
              <Label className="form-label">Placa del vehiculo</Label>
              <Input
                name="placa"
                placeholder="Ingrese placa del vehiculo"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.placa || ""}
                invalid={
                  validationType.touched.placa &&
                    validationType.errors.placa
                    ? true
                    : false
                }
              />
              {validationType.touched.placa &&
                validationType.errors.placa ? (
                <FormFeedback type="invalid">
                  {validationType.errors.placa}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Marca</Label>
              <Input
                name="marca"
                placeholder="Ingrese marca"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.marca || ""}
                invalid={
                  validationType.touched.marca &&
                    validationType.errors.marca
                    ? true
                    : false
                }
              />
              {validationType.touched.marca &&
                validationType.errors.marca ? (
                <FormFeedback type="invalid">
                  {validationType.errors.marca}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Año</Label>
              <CustomSelect
                value={validationType.values.anio}
                options={anios}
                onChange={element => validationType.setFieldValue("anio", element.value)}
                placeholder="Seleccione Año"
                className="select2-selection"
              />
              {validationType.touched.anio &&
                validationType.errors.anio ? (
                <FormFeedback type="invalid">
                  {validationType.errors.anio}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label className="form-label">Modelo</Label>
              <Input
                name="modelo"
                placeholder="Ingrese modelo"
                type="text"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.modelo || ""}
                invalid={
                  validationType.touched.modelo &&
                    validationType.errors.modelo
                    ? true
                    : false
                }
              />
              {validationType.touched.modelo &&
                validationType.errors.modelo ? (
                <FormFeedback type="invalid">
                  {validationType.errors.modelo}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label>Tipo</Label>
              <Input
                name="tipo_vehiculo"
                type="text"
                placeholder="Ingrese tipo"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.tipo_vehiculo || ""}
                invalid={
                  validationType.touched.tipo_vehiculo &&
                    validationType.errors.tipo_vehiculo
                    ? true
                    : false
                }
              />
              {validationType.touched.tipo_vehiculo &&
                validationType.errors.tipo_vehiculo ? (
                <FormFeedback type="invalid">
                  {validationType.errors.tipo_vehiculo}
                </FormFeedback>
              ) : null}
            </div> 
            <div className="row">
              <Label>Cliente</Label>
              <div className="mb-3 col-8 col-sm-10">
                <CustomSelect
                  value={validationType.values.cliente_id}
                  options={clientes}
                  onChange={element => validationType.setFieldValue("cliente_id", element.value)}
                  placeholder="Seleccione Cliente"
                  className="select2-selection"
                  isSearchable={true}
                />
                {validationType.touched.cliente_id &&
                  validationType.errors.cliente_id ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.cliente_id}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-4 col-sm-2">
                <Button type="button" className="w-100" color="success" onClick={() => navigate("/clientes/add")}>
                  Nuevo
                </Button>
              </div>
            </div>          
            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
              </Button>{" "}
              <Button type="reset" color="secondary" onClick={() => navigate("/vehiculos")}>
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
