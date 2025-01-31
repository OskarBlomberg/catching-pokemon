const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod

const nickRef = document.querySelector('#nick');
const ageRef = document.querySelector('#age');
const genderRef = document.querySelectorAll('input[name ="gender"]')
const formRef = document.querySelector('#form');

log(genderRef)

formRef.addEventListener('submit', (event) => {
    event.preventDefault()

    if(validateForm()) {

    } 
})

function validateForm() {

    try {
        if(nickRef.value.trim().length < 5 || nickRef.value.trim().length > 10 ) {
            throw {
                message: 'Name must be between 5 and 10 characters.',
                nodeRef: nickRef
            }
        } else if(ageRef.value < 10 || ageRef.value > 15 ) {
            throw {
                message: 'You must be between 10 and 15 years old.',
                nodeRef: ageRef
            }
        } else if (!genderRef.checked) {
           throw {
            message: 'Must select gender',
            nodeRef: genderRef
           }
        }

        return true;

    } catch (error) {
        log(error.message);
        // error.message;
        error.nodeRef.foucs();
    }

}