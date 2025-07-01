document.getElementById("request-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const pincode = document.getElementById("pincode").value;
  const service = document.getElementById("service").value;
  const phone = document.getElementById("phone").value;

  try {
    const response = await fetch("https://fixmycity.onrender.com/submit-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pincode, service, phone }),
    });

    const result = await response.json();
    if (response.ok) {
      window.location.href = "thankyou.html";
    } else {
      alert(result.message || "Something went wrong.");
    }
  } catch (error) {
    alert("Something went wrong: " + error.message);
  }
});