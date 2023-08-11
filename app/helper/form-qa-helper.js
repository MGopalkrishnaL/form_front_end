let user = { role: "Admin" };
let data = {};
let requestId = "57346834843133";

const generateForm = (id) => {
  requestId = id;
  let formDiv = "";
  let fetchDataPromise = fetchExistingFormData(requestId);
  fetchDataPromise = fetchDataPromise.then((qAFormObject) => {
    qAFormArray = Object.values(qAFormObject);
    let formHeader = user.role === "Agent" ? "Agent QA Form" : "Admin QA Form";
    $(".sec-div1 h4").text(formHeader);
    qAFormArray.forEach((question) => {
      let divs = "";
      console.log(requestId);
      if (
        question.type === "text" ||
        question.type === "date" ||
        question.type === "time" ||
        question.type === "datetime-local"
      ) {
        const inputValue = question.value !== null ? question.value : "";
        divs += `
        <label for="${question.key}">${question.label}
          ${question.mandatory ? '<b class="required-tag">*</b>' : ""}
        </label>
        <input type="${question.type}" class="form-control" ${
          question.mandatory ? "required" : ""
        } id="${question.key}" value="${inputValue}">`;
        if (user.role == "Agent") {
          divs = divs.replace("<input", "<input readonly");
        }
      } else if (question.type === "select") {
        let options = question.extraParam
          .map((value) => `<option value="${value}">${value}</option>`)
          .join("");
        const selectedOption = question.value !== null ? question.value : "";
        divs += `
        <label for="${question.key}">${question.label}
          ${question.mandatory ? '<b class="required-tag">*</b>' : ""}
        </label>
        <select class="custom-select" ${
          question.mandatory ? "required" : ""
        } id="${question.key}">
          <option value="">Select a value</option>${options}
        </select>`;
        if (selectedOption !== "") {
          divs = divs.replace(
            `value="${selectedOption}"`,
            `value="${selectedOption}" selected`
          );
        }
        if (user.role == "Agent") {
          divs = divs.replace("<select", "<select disabled");
        }
      }
      if (user.role === "Agent") {
        $(".submit-form").css("display", "none");
      }
      let eachElementDiv = `
      <div class="form-row d-flex justify-content-center">
        <div class="col-8 mb-3">${divs}</div>
      </div>`;
      formDiv += eachElementDiv;
    });
    $(".qa-form").html(formDiv);
  });
};

$(".close-btn").click(function () {
  window.top.close();
});

$(".submit-form").click(function (event) {
  event.preventDefault();
  ("use strict");
  var forms = document.querySelectorAll(".needs-validation");
  let isvalidated = false;
  Array.prototype.slice.call(forms).forEach(function (form) {
    if (!form.checkValidity()) {
      event.stopPropagation();
    } else {
      isvalidated = true;
    }
    form.classList.add("was-validated");
  });
  console.log(isvalidated);
  if (isvalidated) {
    let formData = {};
    qAFormArray.forEach((innerDivs) => {
      let objValue = $(`#${innerDivs.key}`).val();
      console.log(objValue);
      if (objValue != null && objValue != undefined) {
        formData[`${innerDivs.key}`] = objValue;
      }
    });
    console.log("The Form object created is ", formData);
    putFormData(requestId, formData);
    alert("Data submitted successfully!");
  } else {
    console.log("The form is not validated");
  }
});

generateForm(requestId, user);
