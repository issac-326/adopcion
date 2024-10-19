export function loginValidator(formData: FormData) {
    let isValid = true
    const errors = {message: ''};
  
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (email === '' || password === '') {
        errors.message = 'Wrong Credentials'
        isValid = false
    }

    return {isValid, errors}
  }
  