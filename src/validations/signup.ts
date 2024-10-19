export function signupValidator(formData: FormData) {
    const errors = {email: '', password: '', confirmPassword: '', phone: ''};
  
    // Obtén los valores de los campos
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string // confirmación de contraseña
    const phone = formData.get('phone') as string

    let isValid = true
  
    // Verifica que la contraseña y su confirmación coincidan
    if (email === '') {
      errors.email = 'Email is required'
      isValid= false
    }

    if(email){
      const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if(!emailRegexp.test(email)){
        errors.email = 'Email is not valid'
        isValid= false
      }

    }
  
    if (password === '') {
      errors.password = 'Password is required'
      isValid= false
    }
  
    if (phone === '') {
      errors.phone = 'Phone is required'
      isValid= false
    }

    if (phone) {
      const phoneRegexp = /^\d{8}$/
      if (!phoneRegexp.test(phone)) {
        errors.phone = 'Phone is not valid'
        isValid= false
      }
    }
  
    if (confirmPassword === '') {
      errors.confirmPassword = 'Confirm password is required'
      isValid= false
    }
  
    // Verifica que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
      isValid= false
    }
  
    // Verifica que la contraseña y su confirmación coincidan
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid= false
    }

    return {isValid, errors}
  }
  