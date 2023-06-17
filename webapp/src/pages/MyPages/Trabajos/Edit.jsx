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
import { editSwal, errorSwal, successSwal, customSwal } from "../../../components/Swal";
import { get, post, put } from "../../../helpers/api_helper";
import DateTimeInput from "../../../components/Common/DateTimeInput";

const Edit = () => {
  const tdStyles = {
    background: "inherit",
    width: "100%",
    border: 0,
    padding: 0,
    outline: "none"
  };

  const [element, setElement] = useState({
    idTrabajador: "",
    idVehiculo: "",
    problema_inicial: "",
    fecha_hora_ingreso: "",
    fecha_hora_salida: "",
    nro_comprobante: "",
    costo: "",
    estado: ""
  });
  const [estadoAnt, setEstadoAnt] = useState(true);
  const [trabajadores, setTrabajadores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedFiles, setselectedFiles] = useState([]);
  const [detalleTrabajo, setDetalleTrabajo] = useState([]);
  const [descripcionTrabajo, setDescripcionTrabajo] = useState("");
  const [costoTrabajo, setCostoTrabajo] = useState("0.00");

  const navigate = useNavigate();
  const { id } = useParams();

  const getTrabajadores = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/trabajadores`);
    let optionsTrabajadores = data.map((element) => {
      let { id, Nombres, Apellidos } = element;
      return {
        label: `${Nombres} ${Apellidos}`,
        value: `${id}`
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
        value: `${id}`
      }
    })
    setVehiculos(optionsVehiculos);
  }

  const handleChangeTrabajo = (index, name, newName) => {
    const newTrabajos = [...detalleTrabajo]; // Obtén una copia del array
    const attributeTrabajo = {}
    attributeTrabajo[`${name}`] = newName; // Se asigna el nuevo dato al atributo
    newTrabajos[index] = { ...newTrabajos[index], ...attributeTrabajo }; // Modifica el elemento específico dentro de la copia
    setDetalleTrabajo(newTrabajos); // Actualiza el estado con la copia modificada del array
  };

  const addTrabajo = (e) => {
    e.preventDefault();
    let trabajo = {
      index: detalleTrabajo.length + 1,
      descripcion: descripcionTrabajo,
      fecha_hora: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      costo: costoTrabajo
    }
    setDetalleTrabajo([...detalleTrabajo, trabajo]);
    setDescripcionTrabajo("");
    setCostoTrabajo("0.00");
  };

  const eliminarTrabajo = (id) => {
    setDetalleTrabajo((current) =>
      current.filter((trabajo) => trabajo.index != id)
    );
  };

  const validationType = useFormik({
    enableReinitialize: true, // Use this flag when initial values needs to be changed
    initialValues: {
      idTrabajador: element.idTrabajador,
      idVehiculo: element.idVehiculo,
      problema_inicial: element.problema_inicial,
      fecha_hora_ingreso: element.fecha_hora_ingreso,
      fecha_hora_salida: element.fecha_hora_salida,
      costo: element.costo,
      nro_comprobante: element.nro_comprobante,
      estado: element.estado == "Iniciado" ? "0" : "1",
    },
    validationSchema: Yup.object().shape({
    }),
    onSubmit: (element) => {
      const evidencias = [];
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        if (Object.getPrototypeOf(file).constructor.name !== "Object") {
          formData.append('files[]', file);
        } else {
          evidencias.push(file.id);
        }
      });

      const trabajo = {
        ...element,
        fecha_hora_salida: !estadoAnt && element.estado == 1 ? format(new Date(), "yyyy-MM-dd HH:mm:ss") : element.fecha_hora_salida,
        costo: detalleTrabajo.reduce((total, trabajo) => total + Number(trabajo.costo), 0).toFixed(2),
        detalleTrabajo,
        evidencias
      }

      editSwal("trabajo").then((result) => {
        if (result.isConfirmed) {
          put(`${import.meta.env.VITE_API_URL}/trabajos/${id}`, trabajo)
            .then((res) => {
              post(`${import.meta.env.VITE_API_URL}/trabajos/upload/${id}`, formData).then(() => {
                successSwal("trabajo", "actualizado").then(() => {
                  if (trabajo.nro_comprobante.length > 0) {
                    customSwal({
                      confirmButton: "success",
                      cancelButton: "secondary",
                      title: "Actualizar comprobante para trabajo",
                      text: "¿Esta seguro de actualizar comprobante para trabajo?",
                      icon: "question",
                      textConfirmButton: "Actualizar",
                      textCancelButton: "Cancelar"
                    }).then((result) => {
                      if (result.isConfirmed) {
                        let id = res.idComprobante;
                        navigate(`/comprobante/generate?tipo=trabajo&id=${id}`);
                      } else {
                        navigate("/trabajos");
                      }
                    });
                  } else {
                    navigate("/trabajos");
                  }
                });
              }).catch((err) => {
                errorSwal(err);
              });
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

      let estadoAnt = data.estado == "Iniciado" ? false : true;
      setEstadoAnt(estadoAnt);
      setDetalleTrabajo(data.detalleTrabajo);
    }
    getById();
    getTrabajadores();
    getVehiculos();
  }, []);

  //meta title
  document.title = "Actualizar Trabajos | Servicios Electricos Laser";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Trabajo"
            breadcrumbItem="Actualizar Trabajo"
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

              {estadoAnt && (
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
                </div>
              )}
              {!estadoAnt && validationType.values.estado == "1" && (
                <div className="mb-3 col-12 col-md-6">
                  <Label className="form-label">
                    Fecha y hora de fin de trabajo
                  </Label>
                  <DateTimeInput
                    name="fecha_hora_salida"
                    value={validationType.values.fecha_hora_salida}
                    onDateTimeChange={validationType.handleChange}
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

                  {validationType.values.estado == 0 ? (
                    <CustomSelect
                      defaultValue={{ label: "Iniciado", value: "0" }}
                      value={validationType.values.estado}
                      onChange={element => validationType.setFieldValue("estado", element.value)}
                      options={[
                        { label: "Iniciado", value: "0" },
                        { label: "Finalizado", value: "1" },
                      ]}
                      placeholder="Seleccione estado"
                      className="select2-selection"
                    />

                  ) : (

                    <Input
                      type="text"
                      value={validationType.values.estado == 1 && "Finalizado"}
                      placeholder="Seleccione estado"
                      readOnly
                    />
                  )}

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
                  readOnly={estadoAnt}
                />
                {validationType.touched.problema_inicial &&
                  validationType.errors.problema_inicial ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.problema_inicial}
                  </FormFeedback>
                ) : null}
              </div>
            </div>

            {!estadoAnt && (
              <div className="card my-3">
                <div className="card-header bg-light">Agregar trabajo</div>
                <div className="card-body">
                  <div id="add-work" className="row mb-3">
                    <div className="col-12 col-md-5 col-lg-5 col-xl-6 px-0 ps-0 ps-md-2 ps-lg-3">
                      <input
                        type="text"
                        className="form-control"
                        aria-describedby="helpId"
                        placeholder="Ingrese nombre de trabajo"
                        onChange={(e) => { setDescripcionTrabajo(e.target.value) }}
                        value={descripcionTrabajo}
                      />
                    </div>
                    <div className="col-12 col-md-2 col-lg-2 mt-2 mt-md-0 px-0">
                      <input
                        type="text"
                        className="form-control"
                        aria-describedby="helpId"
                        placeholder="Precio de producto"
                        value={costoTrabajo}
                        onChange={(e) => setCostoTrabajo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-3 col-lg-3 col-xl-2 mt-2 mt-md-0 px-0">
                      <DateTimeInput
                        name="fecha_hora_trabajo"
                        value={validationType.values.fecha_hora_trabajo}
                        onDateTimeChange={validationType.handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-2 mt-2 mt-md-0 px-0 px-md-2">
                      <button
                        type="button"
                        className="btn btn-primary w-100 w-md-auto px-0 px-md-2"
                        onClick={(e) => { addTrabajo(e) }}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="table-responsive mt-3">
              <table className="table table-bordered text-center table-hover">
                <thead className="table-success">
                  <tr>
                    <th>N°</th>
                    <th className={`${!estadoAnt ? "col-5" : "col-6"}`}>Descripción</th>
                    <th className="col-3">Fecha y Hora</th>
                    <th className="col-2">Costo estimado</th>
                    {!estadoAnt && (<th>Accion</th>)}
                  </tr>
                </thead>
                <tbody>
                  {detalleTrabajo.map((trabajo, index) => (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>
                        <Input
                          name="descripcion"
                          type="text"
                          value={trabajo.descripcion}
                          onChange={(e) => handleChangeTrabajo(index, "descripcion", e.target.value)}
                          style={{ ...tdStyles, textAlign: "center" }}
                          readOnly={estadoAnt}
                        />
                      </td>
                      <td>
                        {format(new Date(trabajo.fecha_hora), "dd/MM/yyyy HH:mm:ss")}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          S/.
                          <Input
                            name="costo"
                            type="text"
                            value={trabajo.costo}
                            onChange={(e) => handleChangeTrabajo(index, "costo", e.target.value)}
                            style={tdStyles}
                            readOnly={estadoAnt}
                          />
                        </div>
                      </td>
                      {estadoAnt == 0 && (
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              eliminarTrabajo(trabajo.index);
                            }}
                            className="btn btn-danger"
                          >
                            <i className='bx bx-trash'></i>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3}>Costo total del trabajo:</td>
                    <td colSpan={1} style={{ textAlign: "left" }}>
                      S/.{detalleTrabajo.reduce((total, trabajo) => total + Number(trabajo.costo), 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
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

export default Edit