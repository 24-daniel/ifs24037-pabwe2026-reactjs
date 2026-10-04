// SweetAlert2 dimuat saat pertama kali dibutuhkan agar bundle utama lebih kecil.
const getSwal = async () => (await import("sweetalert2")).default;

export const showSuccessDialog = async (text) =>
  (await getSwal()).fire({ icon: "success", title: "Berhasil", text });
export const showSuccessToast = async (text) =>
  (await getSwal()).fire({
    toast: true, position: "top-end", icon: "success", title: text,
    showConfirmButton: false, timer: 1500, timerProgressBar: true,
  });
export const showErrorDialog = async (text) =>
  (await getSwal()).fire({ icon: "error", title: "Gagal", text });
export const showWarningDialog = async (text) =>
  (await getSwal()).fire({ icon: "warning", title: "Perhatian", text });
export const showConfirmDialog = async (text) => {
  const r = await (await getSwal()).fire({
    icon: "question", title: "Konfirmasi", text,
    showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal",
  });
  return r.isConfirmed;
};

export const formatDate = (date) =>
  new Date(date).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
