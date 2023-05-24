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
import CustomSelect from "../../../components/Common/CustomSelect";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { editSwal, errorSwal, successSwal } from "../../../components/Swal";
import { get, put } from "../../../helpers/api_helper";


const Edit = () => {
    const [element, setElement] = useState({
        placa: "",
        marca: "",
        anio: "",
        modelo: "",
        tipo: "",
        clienteId: "",
      });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getById = async () => {
            const data = await get(`${import.meta.env.VITE_API_URL}/vehiculos/${id}`);
            setElement(data);
        }
        getById();
    }, []);

    const validationType = useFormik({
        enableReinitialize: true, // Use this flag when initial values needs to be changed
        initialValues: {
          placa: element.codigo,
            nombre: element.nombre,
            marca: element.marca,
            anio: element.anio,
            modelo: element.modelo,
            tipo: element.tipo,
            clienteId: element.clienteId,
        },
        validationSchema: Yup.object().shape({
          codigo: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
          nombre: Yup.string().min(3, "Debe tener como mínimo 3 caracteres")
          .max(30, "Debe tener como máximo 30 caracteres").required("El valor es requerido"),
          marca: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
          precio_venta: Yup.string().min(1, "Debe tener como mínimo 1 caracter").required("El valor es requerido"),
          cantidad: Yup.string().required("El valor es requerido"),
          unidad_medida: Yup.string().min(2, "Debe tener como mínimo 8 caracteres").required("El valor es requerido"),
          descripcion: Yup.string().min(3, "Debe tener como mínimo 3 caracteres").required("El valor es requerido"),
        }),
        onSubmit: (element) => {
          editSwal("vehiculos").then((result) => {
            if (result.isConfirmed) {
              put(`${import.meta.env.VITE_API_URL}/vehiculos/${id}`, element)
                .then((res) => {
                  successSwal("producto", "actualizado").then(() => {
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
              <Input
                name="precio_venta"
                placeholder="Ingrese año"
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
                name="tipo"
                type="text"
                placeholder="Ingrese numero de tipo"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.tipo || ""}
                invalid={
                  validationType.touched.tipo &&
                    validationType.errors.tipo
                    ? true
                    : false
                }
              />
              {validationType.touched.tipo &&
                validationType.errors.tipo ? (
                <FormFeedback type="invalid">
                  {validationType.errors.tipo}
                </FormFeedback>
              ) : null}
            </div> 
            <div className="row">
            <Label>Cliente</Label>
              <div className="mb-3 col-12 col-md-11">
                <CustomSelect
                  value={validationType.values.clienteId}
                  options={clientes}
                  onChange={element => validationType.setFieldValue("clienteId", element.value)}
                  placeholder="Seleccione Cliente"
                  className="select2-selection"
                  isSearchable={true}
                />
                {validationType.touched.clienteId &&
                  validationType.errors.clienteId ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.clienteId}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3 col-12 col-md-1">
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

export default Edit