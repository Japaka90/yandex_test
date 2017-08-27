import axios from 'axios';

let MyForm = {
    elems: {
          fio: document.querySelector("[name='fio']"),
          email: document.querySelector("[name='email']"),
          phone: document.querySelector("[name='phone']"),
          resultContainer: document.getElementById('resultContainer')
    },


    validate() {
        let el = this.elems,
            checkfio = validateFio(el.fio.value),
            checkPhone = validatePhone(el.phone.value),
            checkEmail = validateEmail(el.email.value),
            isValid = checkfio && checkPhone && checkEmail,
            valid = {
                isValid: false,
                errorFields: []
            },
            resetClassError = function () {
                el.fio.classList.remove('error');
                el.phone.classList.remove('error');
                el.email.classList.remove('error');
            }();

        function validateFio(name) {
            let countWords = name.split(' ').length
            return countWords === 3 ? true : false;
        }


        function validateEmail(email) {
          let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@ya\.ru$|yandex\.ru$|yandex\.ua$|yandex\.by$|yandex\.kz$|yandex\.com$/;            return re.test(email);
        }

        function validatePhone(phone) {
            let isPhone = /\+7\(\d\d\d\)\d\d\d-\d\d-\d\d$/.test(phone);
            if ( !isPhone ) return false;
            let phoneSum = phone.match(/\d/g).reduce( (sum, current) => sum + +current, 0);
            let allowableAmount = phoneSum <= 30 ? true : false;
            return isPhone && allowableAmount ? true : false;
        }

        if ( !checkfio ) {
            valid.errorFields.push('fio');
        }
        if ( !checkPhone ) {
            valid.errorFields.push('phone');
        }
        if ( !checkEmail ) {
            valid.errorFields.push('email');
        }


        valid.errorFields.forEach( item => {
            document.querySelector(`[name='${item}']`).classList.add('error');
        });

        valid.isValid = isValid ? true : false;

        return valid;
    },


    getData() {
        return {
            fio: this.elems.fio.value,
            email: this.elems.email.value,
            phone: this.elems.phone.value
        }
    },


    setData(object) {
        this.elems.fio.value = object.fio;
        this.elems.email.value = object.email;
        this.elems.phone.value = object.phone;
    },


    submit() {
        let validate = this.validate(),
            el = this.elems,
            resultContainer = el.resultContainer;
        if ( validate.isValid ) {
            document.getElementById('submitButton').onclick = function (e) {
                e.preventDefault();
            };
            axios.get(`${document.getElementById('myForm').action}`)
                .then( response => {
                    let data = response.data,
                    status = data.status;
                    if ( status === 'success' ) {
                        successRequest(data);
                    }

                    if ( status === 'error' ) {
                        errorRequest(data);
                    }

                    if ( status === 'progress' ) {
                        progressRequest(data);
                    }
                })
                .catch( error => console.log(error));

            function successRequest(data) {
                resultContainer.classList.add('success');
                resultContainer.innerHTML = data.message;
            }

            function errorRequest(data) {
                resultContainer.classList.add('error');
                resultContainer.innerHTML = data.reason;
            }

            function progressRequest(data) {
                resultContainer.classList.add('progress');
                setTimeout( () => MyForm.submit(), data.timeout);
            }
        }
    }
};

function randomResult() {
    let result = Math.floor(Math.random() * (4 - 1)) + 1;
    let path = null;
    if (result == 1) {
        path = "../json/success.json";
    }
    if (result == 2) {
        path = "../json/error.json";
    }
    if (result == 3) {
        path = "../json/progress.json";
    }
    return path
};

document.getElementById('myForm').action = randomResult();

document.getElementById('submitButton').onclick = function(e) {
    e.preventDefault();
    MyForm.submit();
};
