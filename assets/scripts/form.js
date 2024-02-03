const form = document.getElementById('form');

const inputs = [
    {
        element: document.getElementById('first-name'),
        validations: [isLength({ min: 3, max: 50 })],
    },
    {
        element: document.getElementById('last-name'),
        validations: [isLength({ min: 3, max: 50 })],
    },
    {
        element: document.getElementById('email'),
        validations: [isEmail],
    },
    {
        element: document.getElementById('phone'),
        validations: [isPhone],
    },
    {
        element: document.getElementById('password'),
        validations: [
            isLength({ min: 8 }),
        ],
    },
    {
        element: document.getElementById('confirm-password'),
        validations: [
            isLength({ min: 8 }),
            isPasswordMatch({
                mirrorElement: document.getElementById('password'),
            }),
        ],
    },
];

form.addEventListener('submit', function handleSubmit(event) {
    event.preventDefault();

    let hasError = false;

    outerLoop:
    for (const { element, validations } of inputs) {
        for (const validate of validations) {
            try {
                validate(element.value);
            } catch (err) {
                hasError = true;
                displayErrorMessage(element, err.message);
                continue outerLoop;
            }
        }
    }

    if (!hasError) {
        alert('Form submitted! :)\nBut not really...');
    }
});

inputs.forEach((input) => {
    input.element.addEventListener('input', () => {
        clearErrorMessage(input.element);
    });
});

function displayErrorMessage(element, message) {
    element.classList.add('invalid');
    const span = element.parentElement.querySelector('.message');
    span.textContent = message;
}

function clearErrorMessage(element) {
    element.classList.remove('invalid');
    const span = element.parentElement.querySelector('.message');
    span.textContent = '';
}

function isLength({ min, max }) {
    return function validateLength(value) {
        const len = value.trim().length;

        let err;

        if (
            min !== undefined &&
            max !== undefined &&
            (len < min || len > max)
        ) {
            err = `Should have ${min}-${max} characters.`;
        } else if (min !== undefined && len < min) {
            err = `Should have a minimum of ${min} characters.`;
        } else if (max !== undefined && len > max) {
            err = `Should have a maximum of ${max} characters.`;
        }

        if (err !== undefined) {
            throw new Error(err);
        }
    };
}

function isEmail(value) {
    const regex = /^\S+@\S+\.\S+$/;
    if (!regex.test(value)) {
        throw new Error(`Should be a valid email. e.g.: johhdoe@email.com.`);
    }
}

// See: https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
function isPhone(value) {
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (!regex.test(value)) {
        throw new Error(`Should be a valid phone. e.g.: (123) 456-7890.`);
    }
}

function isPasswordMatch({ mirrorElement }) {
    return function validatePasswordMatch(value) {
        if (
            mirrorElement.value.length !== value.length ||
            mirrorElement.value !== value
        ) {
            throw new Error(`Passwords should match!`);
        }
    };
}
