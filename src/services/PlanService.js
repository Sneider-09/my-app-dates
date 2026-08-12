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

// Función para crear planes por relacion
async function createPlan(
  coupleId,
  title,
  description,
  plannedDate,
  type,
  userId,
) {
  const plansRef = collection(db, "plans");
  const plansDoc = await addDoc(plansRef, {
    coupleId,
    title,
    description,
    plannedDate,
    type,
    completedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "pending",
    createdBy: userId,
  });

  return plansDoc.id;
}

// Función para obtener un plan por ID
async function getPlanById(planId) {
  const planRef = doc(db, "plans", planId);
  const planSanp = await getDoc(planRef);

  if (!planSanp.exists()) {
    return {
      success: false,
      message: "Plan no encontrado.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Plan encontrado.",
    data: {
      uid: coupleSanp.id,
      ...coupleSanp.data(),
    },
  };
}

// Función para actualizar un plan
async function updatePlan(planId, title, description, plannedDate, type) {
  const plansRef = doc(db, "plans", planId);
  await updateDoc(plansRef, {
    title,
    description,
    plannedDate,
    type,
    updatedAt: serverTimestamp(),
  });

  return {
    success: true,
    message: "Plan actualizado exitosamente.",
    data: {
      planId,
    },
  };
}

// Función para actualizar el estado de un plan
async function updateStatus(planId, status) {
  const planRef = doc(db, "plans", planId);
  await updateDoc(planRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  return {
    success: true,
    message: "Estado del plan actualizado exitosamente.",
    data: {
      planId,
    },
  };
}

// Función para obtener los planes por relación
async function getPlansByCouple(coupleId) {
  const plansRef = collection(db, "plans");
  const q = query(plansRef, where("coupleId", "==", coupleId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return {
      success: true,
      exists: false,
      message: "Aún no hay planes creados.",
      data: [],
    };
  }

  const plans = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    success: true,
    exists: true,
    message: "Planes encontrados.",
    data: plans,
  };
}

export const addPlan = async (
  title,
  description,
  plannedDate,
  type,
  userId,
) => {
  const currentUser = await getUserById(userId);

  if (!currentUser.success) {
    return currentUser;
  }

  const currentUserData = currentUser.data;

  // Comprobar que el usuario tenga una relación asociada
  if (!currentUserData.coupleId) {
    return {
      success: false,
      message: "El usuario no tiene una pareja asociada.",
      data: null,
    };
  }

  const planId = await createPlan(
    currentUserData.coupleId,
    title,
    description,
    plannedDate,
    type,
    userId,
  );

  return {
    success: true,
    message: "Plan agregado.",
    data: {
      planId,
    },
  };
};

export const getPlans = async (userId) => {
  const currentUser = await getUserById(userId);

  if (!currentUser.success) {
    return currentUser;
  }

  const currentUserData = currentUser.data;

  if (!currentUserData.coupleId) {
    return {
      success: false,
      message: "El usuario no tiene una pareja asociada.",
      data: null,
    };
  }

  const plans = await getPlansByCouple(currentUserData.coupleId);

  return plans;
};

export const updatePlanDetail = async (
  planId,
  title,
  description,
  plannedDate,
  type,
) => {
  const planRef = await getPlanById(planId);

  if (!planRef.success) {
    return planRef;
  }

  const planData = planRef.data;

  if (planData.status !== "pending") {
    return {
      success: false,
      message: "El plan no puede ser modificado.",
      data: null,
    };
  }

  const result = await updatePlan(
    planId,
    title,
    description,
    plannedDate,
    type,
  );

  return result;
};

export const updateStatusPlan = async (planId, status) => {
  const validStatuses = ["pending", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    return {
      success: false,
      message: "El estado proporcionado no es válido.",
      data: null,
    };
  }

  const planRef = await getPlanById(planId);

  if (!planRef.success) {
    return planRef;
  }

  const planData = planRef.data;

  if (planData.status !== "pending") {
    return {
      success: false,
      message: "El plan no puede ser modificado.",
      data: null,
    };
  }

  const result = await updateStatus(planId, status);

  return result;
};
