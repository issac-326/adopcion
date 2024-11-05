
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
    const nombre = formData.nombre as string;
    const sexo = formData.sexo as string;
    const tipoAnimal = formData.tipoAnimal as string;
    const descripcion = formData.descripcion as string;
    const anos = Number(formData.anos); // ya que formData es un objeto React
    const meses = Number(formData.meses);
    const departamento = formData.departamento as string;
    const imagen = formData.imagen as string;
    const peso = formData.peso as string;
    
  
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

    if (sexo === '') {
      errors.sexo = 'El sexo es requerido';
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

    const mesess = parseInt(meses, 10); // Convertir a número entero
    const anoss = parseInt(anos, 10); // Convertir a número entero

    if (mesess > 11 || mesess < 0) {
        errors.meses = 'Meses no puede ser mayor que 11 o menor que 0';
        isValid = false;
    }

    if (anoss < 0) {
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

    if (imagen === null) {
      errors.image = 'La imagen es requerida';
      isValid = false;
    }
    return { isValid, errors };
  }
  