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
import { format } from 'date-fns';
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { editSwal, errorSwal, successSwal } from "../../../components/Swal";
import { get, put } from "../../../helpers/api_helper";
import CustomSelect from "../../../components/Common/CustomSelect";

const View = () => {
    const [element, setElement] = useState({
        placa: "",
        marca: "",
        anio: "",
        modelo: "",
        tipo_vehiculo: "",
        cliente_id: "",
      });
    const navigate = useNavigate();
    const [anios, setAnios] = useState([]);
    const { id } = useParams();
    const [clientes, setClientes] = useState([]);
    const getClientes = async () => {
      const data = await get(`${import.meta.env.VITE_API_URL}/clientes`);
      let optionsClientes = data.map((element) => {
        let { id, Nombres, Apellidos } = element;
        return {
          label: `${Nombres} ${Apellidos}`,
          value: `${id}`
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
        const getById = async () => {
            const data = await get(`${import.meta.env.VITE_API_URL}/vehiculos/${id}`);
            setElement(data);
        }
        getById();
        getClientes();
        getAnios();
    }, []);

    const validationType = useFormik({
        enableReinitialize: true, // Use this flag when initial values needs to be changed
        initialValues: {
          placa: element.placa,
          nombre: element.nombre,
          marca: element.marca,
          anio: `${element.anio}`,
          modelo: element.modelo,
          tipo_vehiculo: element.tipo_vehiculo,
          cliente_id: element.cliente_id,
        },
        
      });
      return (
        <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Vehiculos"
            breadcrumbItem="Ver vehiculos"
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
                readOnly
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
              <Label className="form-label">Año</Label>
              <CustomSelect
                defaultValue={validationType.values.anio}
                value={validationType.values.anio}
                options={anios}
                onChange={element => validationType.setFieldValue("anio", element.value)}
                placeholder="Seleccione Año"
                className="select2-selection"
                openMenuOnClick={false}
                menuIsOpen={false}
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
                readOnly
              />
              {validationType.touched.modelo &&
                validationType.errors.modelo ? (
                <FormFeedback type="invalid">
                  {validationType.errors.modelo}
                </FormFeedback>
              ) : null}
            </div>
            <div className="mb-3">
              <Label>tipo_vehiculo</Label>
              <Input
                name="tipo_vehiculo"
                type="text"
                placeholder="Ingrese numero de tipo_vehiculo"
                onChange={validationType.handleChange}
                onBlur={validationType.handleBlur}
                value={validationType.values.tipo_vehiculo || ""}
                invalid={
                  validationType.touched.tipo_vehiculo &&
                    validationType.errors.tipo_vehiculo
                    ? true
                    : false
                }
                readOnly
              />
              {validationType.touched.tipo_vehiculo &&
                validationType.errors.tipo_vehiculo ? (
                <FormFeedback type="invalid">
                  {validationType.errors.tipo_vehiculo}
                </FormFeedback>
              ) : null}
            </div> 
            <div className="mb-3">
            <Label>Cliente</Label>              
                <CustomSelect
                  defaultValue={validationType.values.cliente_id}
                  value={validationType.values.cliente_id}
                  options={clientes}
                  onChange={element => validationType.setFieldValue("cliente_id", element.value)}
                  placeholder="Seleccione Cliente"
                  className="select2-selection"
                  isSearchable={false}
                  menuIsOpen={false}
                  openMenuOnClick={false}
                />
                {validationType.touched.cliente_id &&
                  validationType.errors.cliente_id ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.cliente_id}
                  </FormFeedback>
                ) : null}
            </div>          
            <div className="d-flex flex-wrap gap-2">
              <Button type="button" color="primary" onClick={() => {                                 
                                    navigate(`/vehiculos/edit/${id}`);
                                }}>
                Editar
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

export default View