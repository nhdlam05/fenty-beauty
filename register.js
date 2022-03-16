// Hàm Validator
function Validator(object) {
  let allRules = {};
  //Hàm validate
  function validate(inputElement, rule) {
    let errorElement =
      inputElement.parentElement.querySelector(".form-message");
    let rules = allRules[rule.selector];
    let errorMessage;
    // gọi hàm test khi 1 selector dùng nhiều rule , khi xuất hiện rule thì sẽ dừng rule ở sau
    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
    return !!errorMessage;
  }
  let formElement = document.querySelector(object.form);
  if (formElement) {
    formElement.onsubmit = function (e) {
      let isFormValid = true;
      e.preventDefault();
      object.rules.forEach((rule) => {
        let inputElement = formElement.querySelector(rule.selector);
        let isValid = validate(inputElement, rule);
        console.log(isValid);
        if (!isValid) {
          isFormValid = false;
        }
      });
      if (isFormValid === true) {
        console.log("Có lỗi");
      } else {
        if (typeof object.onSubmit === "function") {
          let enableInput = formElement.querySelectorAll("[name]");
          let formValues = Array.from(enableInput).reduce((values, input) => {
            return (values[input.name] = input.value) && values;
          }, {});
          object.onSubmit(formValues);
        }
      }
    };
    object.rules.forEach((rule) => {
      // Lưu rule vào object để tránh trường hợp bị ghi đè
      if (Array.isArray(allRules[rule.selector])) {
        allRules[rule.selector].push(rule.test);
      } else {
        allRules[rule.selector] = [rule.test];
      }
      //get Element cần validate
      let inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        //Báo khi blur ra ngoài
        inputElement.onblur = function () {
          //gọi hàm logic validate
          validate(inputElement, rule);
        };
      }
      // Khi ng dùng gõ thì mất báo lỗi
      inputElement.oninput = function () {
        let errorElement =
          inputElement.parentElement.querySelector(".form-message");
        errorElement.innerText = "";
        inputElement.parentElement.classList.remove("invalid");
      };
    });
    console.log(allRules);
  }
}
Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập trường này";
    },
  };
};
Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Trường này phải là email";
    },
  };
};
Validator.checkPassword = function (selector, getPassword) {
  return {
    selector: selector,
    test: function (value) {
      return value === getPassword() ? undefined : "Xin nhập lại chính xác";
    },
  };
};
Validator.isPassword = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      let regex = /^([A-Z]){1}([\w_\.!@#$%^&*()]+){5,31}$/;
      return regex.test(value)
        ? undefined
        : "Mật khẩu bạn không đúng định dạng";
    },
  };
};
// Nguyên tắc của các rules:
// * Khi có lỗi thì message ra lỗi
// * ko có lỗi thì trả ra bth => không có lỗi(undefined)
