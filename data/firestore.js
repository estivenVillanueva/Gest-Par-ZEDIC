import { 
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './config';

// Función genérica para agregar un documento
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Función genérica para obtener todos los documentos de una colección
export const getDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// Función genérica para obtener un documento específico
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Document does not exist");
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

// Función genérica para actualizar un documento
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return { id: docId, ...data };
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Función genérica para eliminar un documento
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { id: docId };
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

// Función genérica para consultar documentos con filtros
export const queryDocuments = async (collectionName, conditions = [], orderByField = null) => {
  try {
    let q = collection(db, collectionName);
    
    // Aplicar condiciones de filtro
    if (conditions.length > 0) {
      q = query(q, ...conditions.map(condition => where(condition.field, condition.operator, condition.value)));
    }
    
    // Aplicar ordenamiento si se especifica
    if (orderByField) {
      q = query(q, orderBy(orderByField));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error querying documents: ", error);
    throw error;
  }
}; 