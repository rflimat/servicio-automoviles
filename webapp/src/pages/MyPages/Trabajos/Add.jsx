import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from 'date-fns';
import {
  Row,
  Col,
  Card,
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";

import CustomSelect from "../../../components/Common/CustomSelect";
import Dropzone from "react-dropzone";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  addSwal,
  errorSwal,
  successSwal,
  customSwal,
} from "../../../components/Swal";
import { get, post } from "../../../helpers/api_helper";
import DateTimeInput from "../../../components/Common/DateTimeInput";

const Add = () => {
  const tdStyles = {
    background: "inherit",
    width: "100%",
    border: 0,
    padding: 0,
    outline: "none"
  };

  const [trabajadores, setTrabajadores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [selectedFiles, setselectedFiles] = useState([]);
  const [detalleTrabajo, setDetalleTrabajo] = useState([]);
  const [descripcionTrabajo, setDescripcionTrabajo] = useState("");
  const [datetimeTrabajo, setDatetimeTrabajo] = useState("");
  const [costoTrabajo, setCostoTrabajo] = useState("0.00");

  const navigate = useNavigate();

  /* Upload files functions */
  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const getTrabajadores = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/trabajadores`);
    let optionsTrabajadores = data.map((element) => {
      let { id, Nombres, Apellidos } = element;
      return {
        label: `${Nombres} ${Apellidos}`,
        value: id,
      };
    });
    setTrabajadores(optionsTrabajadores);
  };

  const getVehiculos = async () => {
    const data = await get(`${import.meta.env.VITE_API_URL}/vehiculos`);
    let optionsVehiculos = data.map((element) => {
      let { id, placa } = element;
      return {
        label: `${placa}`,
        value: id,
      };
    });
    setVehiculos(optionsVehiculos);
  };

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
      descripcion: descripcionTrabajo,
      datetimeTrabajo: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
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
    enableReinitialize: false, // Use this flag when initial values needs to be changed
    initialValues: {
      idTrabajador: "",
      problemaInicial: "",
      fecha_hora_ingreso: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      fecha_hora_salida: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      fecha_hora_trabajo: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: (element) => {
      const trabajo = {
        ...element,
        costo: detalleTrabajo.reduce((total, trabajo) => total + Number(trabajo.costo), 0).toFixed(2),
        detalleTrabajo
      }
      console.log(trabajo);
      addSwal("trabajo").then((result) => {
        if (result.isConfirmed) {
          /*post(`${import.meta.env.VITE_API_URL}/trabajos`, trabajo)
            .then((res) => {
              successSwal("trabajo", "agregado").then(() => {
                addSwal("trabajo con comprobante").then((result) => {
                  if (result.isConfirmed) {
                    navigate("/comprobante/generate");
                  } else {
                    navigate("/trabajos");
                  }
                })
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
              textCancelButton: "Cancelar",
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
          <Breadcrumbs title="Trabajo" breadcrumbItem="Registrar Trabajo" />

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
                <DateTimeInput
                  name="fecha_hora_ingreso"
                  value={validationType.values.fecha_hora_ingreso}
                  onDateTimeChange={validationType.handleChange}
                />
                {validationType.touched.fecha_hora_ingreso &&
                validationType.errors.fecha_hora_ingreso ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.fecha_hora_ingreso}
                  </FormFeedback>
                ) : null}
              </div>
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
              </div>
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
                    isSearchable={true}
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
                  <div className="col-10">
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
                    <Button
                      type="button"
                      className="w-100 p-1"
                      color="success"
                      onClick={() => navigate("/vehiculos/add")}
                    >
                      <i className="mdi mdi-plus" style={{ fontSize: 20 }} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mb-3 col-12 col-md-6">
                <Label className="form-label">Descripcion del problema</Label>
                <Input
                  name="problemaInicial"
                  placeholder="Ingrese descripcion del problema"
                  type="textarea"
                  style={{ height: 120, resize: "none" }}
                  onChange={validationType.handleChange}
                  onBlur={validationType.handleBlur}
                  value={validationType.values.problemaInicial || ""}
                  invalid={
                    validationType.touched.problemaInicial &&
                    validationType.errors.problemaInicial
                      ? true
                      : false
                  }
                />
                {validationType.touched.problemaInicial &&
                validationType.errors.problemaInicial ? (
                  <FormFeedback type="invalid">
                    {validationType.errors.problemaInicial}
                  </FormFeedback>
                ) : null}
              </div>
            </div>

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
                      onChange={(e) => {setDescripcionTrabajo(e.target.value)}}
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
                      onClick={(e) => {addTrabajo(e)}}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered text-center table-hover">
                <thead className="table-success">
                  <tr>
                    <th>N°</th>
                    <th className="col-5">Descripción</th>
                    <th className="col-3">Fecha y Hora</th>
                    <th className="col-2">Costo estimado</th>
                    <th>Accion</th>
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
                        />
                      </td>
                      <td>
                        {trabajo.datetimeTrabajo}
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
                          />
                        </div>
                      </td>
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
              <Dropzone
                onDrop={(acceptedFiles) => {
                  handleAcceptedFiles(acceptedFiles);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone">
                    <div
                      className="dz-message needsclick mt-2"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <div className="mb-3">
                        <i className="display-4 text-muted bx bxs-cloud-upload" />
                      </div>
                      <h4>Subir archivo</h4>
                    </div>
                  </div>
                )}
              </Dropzone>
              <div className="dropzone-previews mt-3" id="file-previews">
                {selectedFiles.map((f, i) => {
                  return (
                    <Card
                      className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                      key={i + "-file"}
                    >
                      <div className="p-2">
                        <Row className="align-items-center">
                          <Col className="col-auto">
                            <img
                              data-dz-thumbnail=""
                              height="80"
                              className="avatar-sm rounded bg-light"
                              alt={f.name}
                              src={f.preview}
                            />
                          </Col>
                          <Col>
                            <Link
                              to="#"
                              className="text-muted font-weight-bold"
                            >
                              {f.name}
                            </Link>
                            <p className="mb-0">
                              <strong>{f.formattedSize}</strong>
                            </p>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Button type="submit" color="primary">
                Guardar
              </Button>{" "}
              <Button
                type="reset"
                color="secondary"
                onClick={() => navigate("/trabajos")}
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

export default Add;
