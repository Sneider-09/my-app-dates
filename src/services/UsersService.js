import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./FireBaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Función para obtener un usuario por ID
export const getUserById = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  // Validar si el usuario existe
  if (!userSnap.exists()) {
    return {
      success: false,
      message: "Usuario no encontrado.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Usuario encontrado.",
    data: {
      uid: userSnap.id,
      ...userSnap.data(),
    },
  };
};
