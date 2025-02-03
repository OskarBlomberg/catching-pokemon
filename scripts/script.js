const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod

const nickRef = document.querySelector('#nick');
const ageRef = document.querySelector('#age');
// const genderRef = document.querySelectorAll('input[name ="gender"]')
const formRef = document.querySelector('#form');
const errorMsg = document.querySelector('#errorMsg');
const formWrapperRef = document.querySelector('#formWrapper');
let choosenGender;


formRef.addEventListener('submit', (event) => {
    event.preventDefault()
    if(validateForm()) {
        startGame();
    } 
})

function startGame(){
    formWrapperRef.classList.add('d-none');
}

function validateGender(){
    const genders = document.querySelectorAll('input[name ="gender"]');
    for (const input of genders){
        if(input.checked){
            choosenGender = input.value
        }
    }
}

function validateForm() {
    validateGender();
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
        } else if (!choosenGender) {
           throw {
            message: 'Must select gender',
           }
        }
        errorMsg.textContent = '';
        return true;

    } catch (error) {
        errorMsg.textContent = error.message;
        errorMsg.style.color = 'red';
        if(error.nodeREf){
            error.nodeRef.focus();
        }
    }

}