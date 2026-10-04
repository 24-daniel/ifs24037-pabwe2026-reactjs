import Swal from "sweetalert2";

export const showSuccessDialog = (text) => Swal.fire({ icon: "success", title: "Berhasil", text });
export const showSuccessToast = (text) =>
  Swal.fire({
    toast: true, position: "top-end", icon: "success", title: text,
    showConfirmButton: false, timer: 1500, timerProgressBar: true,
  });
export const showErrorDialog = (text) => Swal.fire({ icon: "error", title: "Gagal", text });
export const showWarningDialog = (text) => Swal.fire({ icon: "warning", title: "Perhatian", text });
export const showConfirmDialog = async (text) => {
  const r = await Swal.fire({
    icon: "question", title: "Konfirmasi", text,
    showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal",
  });
  return r.isConfirmed;
};

export const formatDate = (date) =>
  new Date(date).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
