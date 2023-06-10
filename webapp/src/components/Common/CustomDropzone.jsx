import React from "react";
import { Link } from "react-router-dom";

import Dropzone from "react-dropzone"
import getFullScreen from "../../components/fullScreen";

import {
  Row,
  Col,
  Card,
  Button,
} from "reactstrap";

/**
   * Formats the size
   */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

const CustomDropzone = ({ selectedFiles, setselectedFiles, isHidden = false }) => {
  /* Upload files functions */
  function handleAcceptedFiles(files) {
    files.forEach(file => {
      const processedFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      });

      // Verificar si el archivo ya existe en la lista de archivos seleccionados
      const isDuplicate = selectedFiles.some(selectedFile => selectedFile.name === processedFile.name);
      if (!isDuplicate) {
        setselectedFiles(prevFiles => [...prevFiles, processedFile]);
      }
    });
  }

  function deleteFile(name) {
    setselectedFiles(files => files.filter(file => file.name !== name));
  }

  return (
    <>
      <Dropzone
        onDrop={(acceptedFiles) => {
          handleAcceptedFiles(acceptedFiles);
        }}
        accept={{
          'image/*': ['.jpeg', '.jpg', '.png']
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone" hidden={isHidden}>
            <div className="dz-message needsclick mt-2" {...getRootProps()}>
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
                      onClick={(e) => getFullScreen(e.target)}
                    />
                  </Col>
                  <Col xs={8} sm={9} lg={10}>
                    <Link to="#" className="text-muted font-weight-bold">
                      {f.name}
                    </Link>
                    <p className="mb-0">
                      <strong>{f.formattedSize}</strong>
                    </p>
                  </Col>
                  <Col xs={1} hidden={isHidden}>
                    <Button
                      type="button"
                      color="danger"
                      className="btn-sm btn-rounded me-1"
                      onClick={() => deleteFile(f.name)}
                    >
                      <i className="bx bx-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default CustomDropzone;
export { formatBytes };
