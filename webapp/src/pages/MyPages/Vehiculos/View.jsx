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


const View = () => {
    const [element, setElement] = useState({
        codigo: "",
        nombre: "",
        marca: "",
        precio_venta: "",
        cantidad: "",
        unidad_medida: "",
        descripcion: "",
      });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getById = async () => {
            const data = await get(`${import.meta.env.VITE_API_URL}/productos/${id}`);
            setElement(data);
        }
        getById();
    }, []);

    const validationType = useFormik({
        enableReinitialize: true, // Use this flag when initial values needs to be changed
        initialValues: {
            codigo: element.codigo,
            nombre: element.nombre,
            marca: element.marca,
            precio_venta: element.precio_venta,
            cantidad: element.cantidad,
            unidad_medida: element.unidad_medida,
            descripcion: element.descripcion
        },
        
      });
      return (
        <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="Productos"
              breadcrumbItem="Ver Productos"
            />

            <Form
              
            >
              <div className="mb-3">
                <Label className="form-label">Codigo</Label>
                <Input
                  name="codigo"
                  placeholder="Ingrese codigo"
                  type="text"
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.codigo || ""}
                  invalid={
                    validationType.touched.codigo &&
                      validationType.errors.codigo
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.codigo &&
                  validationType.errors.codigo ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.codigo}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="form-label">Nombre del producto</Label>
                <Input
                  name="nombre"
                  placeholder="Ingrese nombre del producto"
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
                  readOnly
                />
                {validationType.touched.nombre &&
                  validationType.errors.nombre ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.nombre}
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
                  readOnly
                />
                {validationType.touched.marca &&
                  validationType.errors.marca ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.marca}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="form-label">Precio de Venta</Label>
                <Input
                  name="precio_venta"
                  placeholder="Ingrese precio de venta"
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
                  readOnly
                />
                {validationType.touched.precio_venta &&
                  validationType.errors.precio_venta ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.precio_venta}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="form-label">Cantidad</Label>
                <Input
                  name="cantidad"
                  placeholder="Ingrese cantidad"
                  type="number"
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.cantidad || ""}
                  invalid={
                    validationType.touched.cantidad &&
                      validationType.errors.cantidad
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.cantidad &&
                  validationType.errors.cantidad ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.cantidad}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label>Unidad de Medida</Label>
                <Input
                  name="unidad_medida"
                  type="text"
                  placeholder="Ingrese unidad de medida"
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.unidad_medida || ""}
                  invalid={
                    validationType.touched.unidad_medida &&
                      validationType.errors.unidad_medida
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.unidad_medida &&
                  validationType.errors.unidad_medida ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.unidad_medida}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="mb-3">
                <Label className="form-label">Descripcion detallada</Label>
                <Input
                  name="descripcion"
                  placeholder="Ingrese descripcion detallada"
                  type="textarea"
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.descripcion || ""}
                  invalid={
                    validationType.touched.descripcion &&
                      validationType.errors.descripcion
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.descripcion &&
                  validationType.errors.descripcion ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.descripcion}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="d-flex flex-wrap gap-2">
                <Button type="button" color="primary" onClick={() => {                                 
                                    navigate(`/productos/edit/${id}`);
                                }}>
                  Editar  
                </Button>{" "}
                <Button type="reset" color="secondary" onClick={() => navigate("/productos")}>
                  Cancelar
                </Button>
              </div>
            </Form>
          </Container>
        </div>
      </React.Fragment>
    );
  };

export default View