import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from './config';

// Subir un archivo
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};

// Obtener la URL de descarga de un archivo
export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error getting file URL: ", error);
    throw error;
  }
};

// Eliminar un archivo
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file: ", error);
    throw error;
  }
};

// Listar todos los archivos en un directorio
export const listFiles = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    const urls = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url: url
        };
      })
    );
    return urls;
  } catch (error) {
    console.error("Error listing files: ", error);
    throw error;
  }
}; 