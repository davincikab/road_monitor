var formControls = document.querySelectorAll("input, select, textarea");

  formControls.forEach(control => {
    control.classList.add("form-control");
    control.classList.add("form-control-sm");
});