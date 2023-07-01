import React from "react";
import Swal from "sweetalert2";

const successSwal = (element, action) =>
  Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
    },
    buttonsStyling: false,
  }).fire({
    title: "Correcto!",
    text: `${element.at(0).toUpperCase()}${element.substring(1)} ${action} correctamente`,
    icon: "success",
    confirmButtonText: "Ok",
  });

const errorSwal = (err) =>
  Swal.mixin({
    customClass: {
      confirmButton: "btn btn-danger",
    },
    buttonsStyling: false,
  }).fire({
    title: "Error!",
    text: err.response.data.message ? err.response.data.message : err.message,
    icon: "error",
    confirmButtonText: "Ok",
  }).then(() => (err.response.status === 401));

const addSwal = (element) =>
  Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success ms-1",
      cancelButton: "btn btn-secondary me-1",
    },
    buttonsStyling: false,
  }).fire({
    title: `Registrar ${element}`,
    text: `¿Esta seguro de registrar ${element}?`,
    icon: "question",
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });

const editSwal = (element) =>
  Swal.mixin({
    customClass: {
      confirmButton: "btn btn-primary ms-1",
      cancelButton: "btn btn-secondary me-1",
    },
    buttonsStyling: false,
  }).fire({
    title: `Actualizar ${element}`,
    text: `¿Esta seguro de actualizar ${element}?`,
    icon: "question",
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });

const deleteSwal = (element) =>
  Swal.mixin({
    customClass: {
      confirmButton: "btn btn-danger ms-1",
      cancelButton: "btn btn-secondary me-1",
    },
    buttonsStyling: false,
  }).fire({
    title: `Eliminar ${element}`,
    text: `¿Esta seguro de eliminar ${element}?`,
    icon: "error",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });

const customSwal = (element) =>
  Swal.mixin({
    customClass: {
      confirmButton: `btn btn-${element.confirmButton} ms-1`,
      cancelButton: `btn btn-${element.cancelButton} me-1`,
    },
    buttonsStyling: false,
  }).fire({
    title: `${element.title}`,
    text: `${element.text}`,
    icon: `${element.icon}`,
    showCancelButton: true,
    confirmButtonText: `${element.textConfirmButton}`,
    cancelButtonText: `${element.textCancelButton}`,
    reverseButtons: true,
  });

export { successSwal, errorSwal, addSwal, editSwal, deleteSwal, customSwal };
