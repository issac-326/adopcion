
export function publicacionValidator(formData: FormData) {
  console.log(formData)
    const errors: {
        nombre: string;
        sexo: string;
        tipoAnimal: string;
        descripcion: string;
        anos: string;
        meses: string;
        departamento: string;
        imagen: string;
        peso: string;
    } = {
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
    const anos = formData.get('anos') as string; // ya que formData es un objeto React
    const meses = formData.get('meses') as string;
    const departamento = formData.get('departamento') as string;
    const imagen = formData.get('image') as string;
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

    if (sexo === '') {
      errors.sexo = 'El sexo es requerido';
      isValid = false;
  }

    if (tipoAnimal === '') {
        errors.tipoAnimal = 'El tipo animal es requerido';
        isValid = false;
    }

    if (descripcion === '') {
        errors.descripcion = 'La descripción es requerida';
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
      errors.imagen = 'La imagen es requerida';
      isValid = false;
    }

    if (meses !== undefined && meses !== null && meses !== '') {
      const mesesRegex = /^[0-9]+$/;
      if (!mesesRegex.test(String(meses))) {
        errors.meses = 'Valor no válido';
        isValid = false;
      }
    }
    


    return { isValid, errors };
  }
  