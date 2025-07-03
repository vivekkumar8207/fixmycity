document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("serviceForm");

  if (!form) {
    console.error("Form not found!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const service = document.getElementById("serviceType").value;

    const statusDiv = document.getElementById("status");
    statusDiv.innerText = "⏳ Submitting request...";

    try {
      const response = await fetch("https://fixmycity.onrender.com/request-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, pincode, service })
      });

      const result = await response.json();

      if (response.ok) {
        statusDiv.innerText = `✅ ${result.message}`;
        form.reset();
      } else {
        statusDiv.innerText = `❌ ${result.message || "Submission failed."}`;
      }
    } catch (error) {
      console.error("Error:", error);
      statusDiv.innerText = "❌ Failed to connect to server.";
    }
  });
});