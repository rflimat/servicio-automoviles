import React from "react";
import Swal from "sweetalert2";

const successSwal = (element, action) =>
  Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
    },
    buttonsStyling: false,
  }).fire({
    title: "Successful!",
    text: `${element.at(0).toUpperCase()}${element.substring(1)} ${action} successfully`,
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
    text: err.message,
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
    title: `Add ${element}`,
    text: `Are you sure to add ${element}?`,
    icon: "question",
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
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
    title: `Update ${element}`,
    text: `Are you sure to update ${element}?`,
    icon: "question",
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
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
    title: `Delete ${element}`,
    text: `Are you sure to delete ${element}?`,
    icon: "error",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

export { successSwal, errorSwal, addSwal, editSwal, deleteSwal };
