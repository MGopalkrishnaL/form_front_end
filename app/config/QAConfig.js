const fetchExistingFormData = async (requestId) => {
  const url = `http://localhost:8080/getDataByUsingRequestId/${requestId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch existing form data.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching existing form data:", error);
    return null;
  }
};

const putFormData = async (requestId, updatedFormData) => {
  const url = "http://localhost:8080/updateTheForm";

  const requestBody = {
    requestId: requestId,
    formData: updatedFormData,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  };
  try {
    const response = await fetch(url, requestOptions);
  } catch (error) {
    console.error("Error while sending data to the backend:", error);
  }
};
