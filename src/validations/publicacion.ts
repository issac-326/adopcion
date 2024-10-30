
export function publicacionValidator(formData: FormData) {
    const errors: Error = {
        nombre: '',
        sexo: '',
        tipoAnimal: '',
        descripcion: '',
        anos: '',
        meses: '',
        departamento: '',
        imagen: '',
        peso: '',
    };
  
    // Obtén los valores de los campos
    const nombre = formData.get('nombre') as string;
    const sexo = formData.get('sexo') as string;
    const tipoAnimal = formData.get('tipoAnimal') as string;
    const descripcion = formData.get('descripcion') as string;
    const anos = Number(formData.get('anos'))
    const meses = Number(formData.get('meses'));
    const departamento = formData.get('departamento') as string;
    const imagen = formData.get('imagen') as string;
    const peso = formData.get('peso') as string;
  
    let isValid = true;
  
    // Verifica que el nombre no esté vacío
    if (nombre === '') {
      errors.nombre = 'El nombre es requerido';
      isValid = false;
    }
  
    // Verifica formato de nombre
    if (nombre) {
      const nombreRegexp = /^[A-Za-z]+$/;
      if (!nombreRegexp.test(nombre)) {
        errors.nombre = 'El nombre no es válido, no se permiten numeros ni caracteres especiales';
        isValid = false;
      }
    }

    if (descripcion === '') {
        errors.descripcion = 'El descripcion es requerido';
        isValid = false;
    }

    if (tipoAnimal === '') {
        errors.tipoAnimal = 'El tipo animal es requerido';
        isValid = false;
    }

    if (descripcion === '') {
        errors.descripcion = 'El descripcion es requerido';
        isValid = false;
    }

    if (anos === '' && meses === '') {
        errors.anos = 'La edad es requerida';
        isValid = false;
    }

    if (anos) {
        const anosregex = /^[0-9]+$/; 
        if (!anosregex.test(anos)) {
          errors.anos = 'Valor no valido';
          isValid = false;
        }
    }
    
    if (meses) {
        const anosregex = /^[0-9]+$/; 
        if (!anosregex.test(meses)) {
          errors.meses = 'Valor no valido';
          isValid = false;
        }
    }
    if (peso) {
        const anosregex = /^[0-9]+$/; 
        if (!anosregex.test(peso)) {
          errors.peso = 'Valor no valido';
          isValid = false;
        }
    }

    if (meses > 11 || meses < 0) {
        
        errors.meses = 'Meses no puede ser mayor que 11';
        isValid = false;
        
    }

    if (anos < 0) {
        errors.anos = 'Años no puede ser menor que 0';
        isValid = false;
    }

    if (departamento === '') {
        errors.departamento = 'El departamento es requerido';
        isValid = false;
    }
  
    if (peso === '') {
        errors.peso = 'El peso es requerido';
        isValid = false;
    }

    return { isValid, errors };
  }
  