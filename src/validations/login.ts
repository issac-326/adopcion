export function loginValidator(formData: FormData) {
    const errors = []
  
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (email === '' || password === '') {
        errors.push('Email and password are required')
    }

    return errors
  }
  