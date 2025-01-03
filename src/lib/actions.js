'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache';
import { obtenerVacunasID } from '@/lib/data'
import cloudinary from '@/lib/cloudinary';
import path from 'node:path'




async function imageUpload(file) {
  console.log(file);

  const fileBuffer = await file.arrayBuffer();

  let mime = file.type;
  let encoding = 'base64';
  let base64Data = Buffer.from(fileBuffer).toString('base64');
  let fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  try {
    // Transformamos imagen al subirla
    // width: 512, aspect-ratio: 1
    const result = await cloudinary.uploader.upload(fileUri, {
      invalidate: true,
      asset_folder: 'protectora',
      public_id: path.parse(file.name).name,
      aspect_ratio: "1.0",
      width: 512,
      crop: "fill",
      gravity: "center"
    })

    console.log(result);
    return result.secure_url
  } catch (error) {
    console.log(error);
    return null
  }
}




//// MASCOTAS

/* 
// EJEMPLO CREACIÓN
const result = await prisma.mascota.create({
  data: {
    nombre: 'Aquiles',
    vacunas: {
      connect: [{id: 4}, {id: 5}]     
    },
  },
  include: {
    vacunas: true,
  },
})

*/

export async function nuevaMascota(prevState, formData) {
  const nombre = formData.get('nombre')
  const descripcion = formData.get('descripcion')
  const fecha_nacimiento = new Date(formData.get('fecha_nacimiento'))
  const file = formData.get('file')
  let foto;  // URL de la foto


  // Array con IDs de todas las vacunas
  const vacunasID = await obtenerVacunasID()  // Formato: [ {id: 1}, {id: 2}, ...]

  // -> Si disponemos de NodeJS 21+
  // Objecto con 2 arrays: connect con IDs de vacunas marcadas por el usuario y disconnect con IDs no marcadas
  // const vacunas = Object.groupBy(vacunasID, ({ id }) => formData.get(id) !== null ? 'connect' : 'disconnect')

  // -> Si NO disponemos de NodeJS 21+ 
  // const connect = vacunasID.filter(({ id }) => formData.get(ids) !== null)
  // const vacunas = { connect }

  // Información de depuración
  // console.log('VACUNAS ', vacunas);



  try {
    // si tenemos nuevo archivo en el input type=file
    if (file.size > 0) {
      foto = await imageUpload(file)
      console.log('foto', foto);
    }

    const mascota = await prisma.mascota.create({
      data: {
        nombre,
        descripcion,
        fecha_nacimiento,
        foto,
        // vacunas,
      },
      // include: {
      //   vacunas: true,
      // },
    })


    revalidatePath('/mascotas')
    return { success: 'Creación exitosa' }
  } catch (error) {
    return { error: error.message }
  }
}


/* 
// EJEMPLO ACTUALIZACIÓN
const result = await prisma.mascota.update({
  where: {
    id: 16,
  },
  data: {
    nombre: 'Aquiles Junior',
    vacunas: {
      connect: [{id: 4}, {id: 5}],
      disconnect: [{ id: 12 }, { id: 19 }],
    },
  },
  include: {
    vacunas: true,
  },
})

*/

export async function modificarMascota(prevState, formData) {
  const id = Number(formData.get('id'))
  const nombre = formData.get('nombre')
  const descripcion = formData.get('descripcion')
  const fecha_nacimiento = new Date(formData.get('fecha_nacimiento'))
  const file = formData.get('file')
  let foto = formData.get('foto')


  // Array con IDs de todas las vacunas
  const vacunasID = await obtenerVacunasID()  // Formato: [ {id: 1}, {id: 2}, ...]

  // -> Si disponemos de NodeJS 21+
  // Objecto con 2 arrays: connect con IDs de vacunas marcadas por el usuario y disconnect con IDs no marcadas
  const vacunas = Object.groupBy(vacunasID, ({ id }) => formData.get(id) !== null ? 'connect' : 'disconnect')

  // -> Si NO disponemos de NodeJS 21+ 
  // const connect = vacunasID.filter(({ id }) => formData.get(id) !== null)
  // const disconnect = vacunasID.filter(({ id }) => formData.get(id) === null)
  // const vacunas = { connect, disconnect }

  // Información para depuración
  console.log('VACUNAS ', vacunas);

  try {
    // si tenemos nuevo archivo en el input type=file
    if (file.size > 0) {
      foto = await imageUpload(file)
      console.log('foto', foto);
    }

    const mascota = await prisma.mascota.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        fecha_nacimiento,
        foto,
        // vacunas,
      },
      // include: {
      //   vacunas: true,
      // },
    })


    revalidatePath('/mascotas')
    return { success: 'Modificación exitosa' }
  } catch (error) {
    return { error: error.message }
  }
}


export async function eliminarMascota(prevState, formData) {
  const id = Number(formData.get('id'))

  try {
    const mascota = await prisma.mascota.delete({
      where: {
        id: id,
      },
    })

    revalidatePath('/mascotas')
    return { success: 'Eliminación exitosa' }
  } catch (error) {
    return { error: error.message }
  }
}



//// VACUNAS

export async function nuevaVacuna(prevState, formData) {
  const nombre = formData.get('nombre')
  const especie = formData.get('especie')

  try {
    const vacuna = await prisma.vacuna.create({
      data: { nombre, especie },
    })

    revalidatePath('/vacunas')
    return { success: 'Creación exitosa' }
  } catch (error) {
    return { error: error.message }
  }
}


export async function modificarVacuna(prevState, formData) {
  const id = Number(formData.get('id'))
  const nombre = formData.get('nombre')
  const especie = formData.get('especie')

  try {
    const vacuna = await prisma.vacuna.update({
      where: { id },
      data: { nombre, especie },
    })

    revalidatePath('/vacunas')
    return { success: 'Modificación exitosa' }
  } catch (error) {
    return { error: error.message }
  }
}


export async function eliminarVacuna(prevState, formData) {
  const id = Number(formData.get('id'))

  try {
    const vacuna = await prisma.vacuna.delete({
      where: {
        id: id,
      },
    })

    revalidatePath('/vacunas')
    return { success: 'Eliminación exitosa' }
  } catch (error) {
    return { error: error.message }
  }
}

