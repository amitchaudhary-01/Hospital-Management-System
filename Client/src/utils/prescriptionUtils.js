import API from "../api/axios"; // Your Axios instance with interceptors/baseURL
import toast from "react-hot-toast";

export const downloadPrescription = async (prescriptionId) => {
  if (!prescriptionId) {
    toast.error("Prescription ID is missing.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    // CRITICAL: responseType must be 'blob' to receive PDF binary data
    const response = await API.get(`/prescriptions/${prescriptionId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    // Create a Blob from the PDF Stream
    const blob = new Blob([response.data], { type: "application/pdf" });
    const downloadUrl = window.URL.createObjectURL(blob);

    // Create a temporary hidden link element to trigger the download
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `prescription-${prescriptionId}.pdf`);
    document.body.appendChild(link);
    link.click();

    // Cleanup DOM and release memory object
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    toast.success("Prescription downloaded successfully!");
  } catch (error) {
    console.error("Prescription Download Error:", error);
    toast.error(
      error.response?.data?.message || "Failed to download prescription PDF"
    );
  }
};