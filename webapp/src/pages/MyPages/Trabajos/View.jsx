import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from 'date-fns';
import {
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";

import CustomSelect from "../../../components/Common/CustomSelect";
import CustomDropzone, { formatBytes } from "../../../components/Common/CustomDropzone";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { addSwal, errorSwal, successSwal, customSwal } from "../../../components/Swal";
import { get, post } from "../../../helpers/api_helper";
import DateTimeInput from "../../../components/Common/DateTimeInput";

const View = () => {
  const [element, setElement] = useState({
    idTrabajador: "",
    idVehiculo: "",
    problema_inicial: "",
    fecha_hora_ingreso: "",
    fecha_hora_salida: "",
    costo: "",
    estado: "",
    detalleTrabajo: []
  });
  const [trabajadores, setTrabajadores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedFiles, setselectedFiles] = useState([])

  const navigate = useNavigate();
  const { id } = useParams();

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
      idTrabajador: element.idTrabajador,
      idVehiculo: element.idVehiculo,
      problema_inicial: element.problema_inicial,
      fecha_hora_ingreso: element.fecha_hora_ingreso,
      fecha_hora_salida: element.fecha_hora_salida,
      costo: element.costo,
      estado: element.estado,
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: (element) => {
    },
  });

  useEffect(() => {
    const getById = async () => {
      const data = await get(`${import.meta.env.VITE_API_URL}/trabajos/${id}`);
      setElement(data);

      const evidencias = data.evidencias.map((file) => {
        return {
          id: file.id,
          name: file.ruta.split('_')[1],
          preview: `${import.meta.env.VITE_APP_STORAGE}/trabajos/${id}/${file.ruta}`,
          formattedSize: formatBytes(file.size)
        }
      });
      setselectedFiles(evidencias);
    }
    getById();
    getTrabajadores();
    getVehiculos();
  }, []);

  //meta title
  document.title = "Ver Trabajo | Servicios Electricos Laser";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Trabajo"
            breadcrumbItem="Ver Trabajo"
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
                <Label className="form-label">
                  Fecha y hora de inicio de trabajo
                </Label>
                <Input
                  name="fecha_hora_ingreso"
                  value={validationType.values.fecha_hora_ingreso}
                  type="datetime-local"
                  readOnly
                />
                {validationType.touched.fecha_hora_ingreso &&
                  validationType.errors.fecha_hora_ingreso ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.fecha_hora_ingreso}
                  </FormFeedback>
                ) : null}
              </div>
              {validationType.values.estado == "Finalizado" && (
                <div className="mb-3 col-12 col-md-6">
                  <Label className="form-label">
                    Fecha y hora de fin de trabajo
                  </Label>
                  <Input
                    name="fecha_hora_salida"
                    value={validationType.values.fecha_hora_salida}
                    type="datetime-local"
                    readOnly
                  />
                  {validationType.touched.fecha_hora_salida &&
                    validationType.errors.fecha_hora_salida ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.fecha_hora_salida}
                    </FormFeedback>
                  ) : null}
                </div>)}
            </div>

            <div className="row">
              <div className="col-12 col-md-6">
                <div className="mb-3">
                  <Label>Trabajador</Label>
                  <CustomSelect
                    value={validationType.values.idTrabajador}
                    options={trabajadores}
                    onChange={(element) =>
                      validationType.setFieldValue(
                        "idTrabajador",
                        element.value
                      )
                    }
                    placeholder="Seleccione Trabajador"
                    className="select2-selection"
                    isSearchable={false}
                    menuIsOpen={false}
                    openMenuOnClick={false}
                  />
                  {validationType.touched.idTrabajador &&
                    validationType.errors.idTrabajador ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.idTrabajador}
                    </FormFeedback>
                  ) : null}
                </div>
                <div className="row mb-3">
                  <Label>Vehiculo</Label>
                    <CustomSelect
                      value={validationType.values.idVehiculo}
                      options={vehiculos}
                      onChange={(element) =>
                        validationType.setFieldValue(
                          "idVehiculo",
                          element.value
                        )
                      }
                      placeholder="Seleccione Vehiculo"
                      className="select2-selection"
                      isSearchable={false}
                      menuIsOpen={false}
                      openMenuOnClick={false}
                    />
                    {validationType.touched.idVehiculo &&
                      validationType.errors.idVehiculo ? (
                      <FormFeedback type="invalid">
                        {validationType.errors.idVehiculo}
                      </FormFeedback>
                    ) : null}
                </div>
                <div className="mb-3">
                  <Label>Estado</Label>
                  <Input
                    value={validationType.values.estado}
                    placeholder="Seleccione estado"
                    readOnly
                  />
                  {validationType.touched.estado &&
                    validationType.errors.estado ? (
                    <FormFeedback type="invalid">
                      {validationType.errors.estado}
                    </FormFeedback>
                  ) : null}
                </div>
              </div>
              <div className="mb-3 col-12 col-md-6">
                <Label className="form-label">Descripcion del problema</Label>
                <Input
                  name="problema_inicial"
                  placeholder="Ingrese descripcion del problema"
                  type="textarea"
                  style={{ height: 203, resize: "none" }}
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.problema_inicial || ""}
                  invalid={
                    validationType.touched.problema_inicial &&
                      validationType.errors.problema_inicial
                      ? true
                      : false
                  }
                  readOnly
                />
                {validationType.touched.problema_inicial &&
                  validationType.errors.problema_inicial ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.problema_inicial}
                  </FormFeedback>
                ) : null}
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered text-center table-hover">
                <thead className="table-success">
                  <tr>
                    <th>N°</th>
                    <th className="col-6">Descripción</th>
                    <th className="col-3">Fecha y Hora</th>
                    <th className="col-2">Costo estimado</th>
                  </tr>
                </thead>
                <tbody>
                  {element.detalleTrabajo.map((trabajo, index) => (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>
                        {trabajo.descripcion}
                      </td>
                      <td>
                        {format(new Date(trabajo.fecha_hora), "dd/MM/yyyy HH:mm:ss")}
                      </td>
                      <td>
                        S/.{trabajo.costo}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3}>Costo total del trabajo:</td>
                    <td colSpan={1} style={{ textAlign: "left" }}>
                      S/.{element.detalleTrabajo.reduce((total, trabajo) => total + Number(trabajo.costo), 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-3">
              <Label className="form-label">Estado del vehiculo</Label>
              <CustomDropzone selectedFiles={selectedFiles} setselectedFiles={setselectedFiles} isHidden={true} />
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Button type="button" color="primary" onClick={() => navigate(`/trabajos/edit/${id}`)}>
                Editar
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

export default View