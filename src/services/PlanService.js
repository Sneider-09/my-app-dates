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
async function getUserById(uid) {
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
}

export const getPlans = async (userId) => {
  const currentUser = await getUserById(userId);

  if (!currentUser.success) {
    return currentUser;
  }

  const currentUserData = currentUser.data;

  const plansRef = collection(db, "plans");
  const q = query(plansRef, where("coupleId", "==", currentUserData.coupleId));
  const plansSnapshot = await getDocs(q);

  // Validar si existen planes
  if (plansSnapshot.empty) {
    return {
      success: true,
      exists: false,
      message: "Aun no hay planes creados.",
      data: null,
    };
  }

  const plans = plansSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    success: true,
    exists: true,
    message: "Tus planes.",
    data: plans,
  };
};
