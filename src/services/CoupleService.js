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

// Función para obtener un usuario por correo electrónico
export async function getUserByEmail(email) {
  const userRef = collection(db, "users");
  const q = query(userRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return {
      success: false,
      message: "Usuario no encontrado.",
      data: null,
    };
  }

  const userDoc = querySnapshot.docs[0];

  return {
    success: true,
    message: "Usuario encontrado.",
    data: {
      uid: userDoc.id,
      ...userDoc.data(),
    },
  };
}

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

// Función para obtener las invitaciones pendientes entre dos usuarios
async function getPendingInvitation(fromUserId, toUserId) {
  const invitationsRef = collection(db, "relationship_requests");
  const receivedQuery = query(
    invitationsRef,
    where("fromUserId", "==", fromUserId),
    where("toUserId", "==", toUserId),
    where("status", "==", "pending"),
  );
  const sentQuery = query(
    invitationsRef,
    where("fromUserId", "==", toUserId),
    where("toUserId", "==", fromUserId),
    where("status", "==", "pending"),
  );

  const receivedSnapshot = await getDocs(receivedQuery);
  const sentSnapshot = await getDocs(sentQuery);

  if (receivedSnapshot.empty && sentSnapshot.empty) {
    return {
      success: true,
      exists: false,
    };
  }

  return {
    success: true,
    exists: true,
  };
}

// Función para crear una invitación entre dos usuarios
async function createInvitation(fromUserId, toUserId) {
  const invitationsRef = collection(db, "relationship_requests");
  const invitationDoc = await addDoc(invitationsRef, {
    fromUserId,
    toUserId,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return invitationDoc.id;
}

// Función para crear una relación de pareja entre dos usuarios
async function createCouple(user1Id, user2Id) {
  const coupleRef = collection(db, "couples");
  const coupleDoc = await addDoc(coupleRef, {
    members: [user1Id, user2Id],
    relationshipName: "",
    anniversary: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: "active",
    createdBy: user1Id,
  });

  return coupleDoc.id;
}

// Función para obtener una relación por su ID
async function getCoupleById(coupleId) {
  const coupleRef = doc(db, "couples", coupleId);
  const coupleSanp = await getDoc(coupleRef);

  if (!coupleSanp.exists()) {
    return {
      success: false,
      message: "Relación no encontrada.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Relación encontrada",
    data: {
      uid: coupleSanp.id,
      ...coupleSanp.data(),
    },
  };
}

// Función para actualizar el coupleId de un usuario
async function updateUserCouple(userId, coupleId) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    coupleId: coupleId,
    updatedAt: serverTimestamp(),
  });
}

// Función para obtener una invitación por su ID
async function getInvitationById(invitationId) {
  const invitationRef = doc(db, "relationship_requests", invitationId);
  const invitationSnap = await getDoc(invitationRef);

  if (!invitationSnap.exists()) {
    return {
      success: false,
      message: "Invitación no encontrada.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Invitación encontrada.",
    data: {
      uid: invitationSnap.id,
      ...invitationSnap.data(),
    },
  };
}

// Función para actualizar el estado de una invitación
async function updateInvitationStatus(invitationId, status) {
  const invitationRef = doc(db, "relationship_requests", invitationId);
  const invitationSnap = await getDoc(invitationRef);

  if (!invitationSnap.exists()) {
    return {
      success: false,
      message: "Invitación no encontrada.",
      data: null,
    };
  }

  await updateDoc(invitationRef, {
    status: status,
    updatedAt: serverTimestamp(),
  });

  return {
    success: true,
    message: `Estado actualizado a ${status}.`,
    data: {
      invitationId,
      status,
    },
  };
}

// Función para obtener la invitación pendiente de un usuario
async function getPendingInvitationByField(field, userId) {
  const invitationsRef = collection(db, "relationship_requests");

  const q = query(
    invitationsRef,
    where(field, "==", userId),
    where("status", "==", "pending"),
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return {
      success: true,
      exists: false,
      data: null,
    };
  }

  const invitationDoc = querySnapshot.docs[0];

  return {
    success: true,
    exists: true,
    data: {
      uid: invitationDoc.id,
      ...invitationDoc.data(),
    },
  };
}

// Función para enviar una invitación a otro usuario
export const sendInvitation = async (currentUser, email) => {
  const targetUserResult = await getUserByEmail(email);
  const currentUserResult = await getUserById(currentUser.uid);

  // Validar si el usuario existe
  if (!targetUserResult.success) {
    return targetUserResult;
  }

  if (!currentUserResult.success) {
    return currentUserResult;
  }

  // Obtener los datos del usuario actual y del usuario objetivo
  const targetUser = targetUserResult.data;
  const currentUserData = currentUserResult.data;
  const pendingInvitationResult = await getPendingInvitation(
    currentUser.uid,
    targetUser.uid,
  );

  // Validar si el usuario es el mismo que está enviando la invitación
  if (targetUser.uid === currentUser.uid) {
    return {
      success: false,
      message: "No puedes enviarte una invitación a ti mismo.",
      data: null,
    };
  }

  // Validar si el usuario objetivo ya está en una relación
  if (targetUser.coupleId !== null) {
    return {
      success: false,
      message:
        "El usuario al que intentas enviar la invitación ya está en una relación.",
      data: null,
    };
  }

  // Validar si el usuario actual ya está en una relación
  if (currentUserData.coupleId !== null) {
    return {
      success: false,
      message: "Ya estás en una relación. No puedes enviar invitaciones.",
      data: null,
    };
  }

  // Validar si ya existe una invitación pendiente entre los dos usuarios
  if (pendingInvitationResult.exists) {
    return {
      success: false,
      message: "Ya existe una invitación pendiente entre estos usuarios.",
      data: null,
    };
  }

  const invitationId = await createInvitation(currentUser.uid, targetUser.uid);

  return {
    success: true,
    message: "Invitación enviada exitosamente.",
    data: {
      invitationId,
    },
  };
};

// Función para responder a una invitación (aceptar o rechazar)
export const respondInvitation = async (invitationId, accepted) => {
  const invitationResult = await getInvitationById(invitationId);

  if (!invitationResult.success) {
    return invitationResult;
  }
  const invitationData = invitationResult.data;

  if (invitationData.status !== "pending") {
    return {
      success: true,
      message: `La invitación ya fue ${invitationData.status}.`,
      data: invitationData,
    };
  }

  if (!accepted) {
    await updateInvitationStatus(invitationId, "rejected");

    return {
      success: true,
      message: "Invitación rechazada.",
      status: "rejected",
      data: null,
    };
  }

  const fromUserResult = await getUserById(invitationData.fromUserId);
  const toUserResult = await getUserById(invitationData.toUserId);

  // Validar si ambos usuarios existen
  if (!fromUserResult.success || !toUserResult.success) {
    return {
      success: false,
      message: "Uno de los usuarios no existe.",
      data: null,
    };
  }

  const fromUserData = fromUserResult.data;
  const toUserData = toUserResult.data;

  // Validar si alguno de los usuarios ya está en una relación
  if (fromUserData.coupleId !== null || toUserData.coupleId !== null) {
    return {
      success: false,
      message: "Uno de los usuarios ya está en una relación.",
      data: null,
    };
  }

  // Crear la relación de pareja entre los dos usuarios
  const coupleId = await createCouple(
    invitationData.fromUserId,
    invitationData.toUserId,
  );
  // Actualizar el coupleId de ambos usuarios
  await updateUserCouple(invitationData.fromUserId, coupleId);
  await updateUserCouple(invitationData.toUserId, coupleId);

  // Actualizar el estado de la invitación a "accepted"
  await updateInvitationStatus(invitationId, "accepted");

  return {
    success: true,
    message: "Invitación aceptada.",
    status: "accepted",
    data: { coupleId },
  };
};

// Función para conocer el estado de relación de un usuario
export const getRelationShipState = async (currentUser) => {
  const userResult = await getUserById(currentUser);

  if (!userResult.success) {
    return userResult;
  }
  const user = userResult.data;

  //
  if (user.coupleId !== null) {
    const coupleResult = await getCoupleById(user.coupleId);

    if (!coupleResult.success) {
      return coupleResult;
    }
    const coupleData = coupleResult.data;

    const partnerId = coupleData.members.find(
      (member) => member !== currentUser,
    );

    const partnerResult = await getUserById(partnerId);
    if (!partnerResult.success) {
      return partnerResult;
    }
    const partner = partnerResult.data;

    return {
      state: "couple",
      couple: coupleData,
      partner,
      invitation: null,
    };
  }

  // Comprobar si el usuario tiene una invitación enviada pendiente
  const invitationSentResult = await getPendingInvitationByField(
    "fromUserId",
    currentUser,
  );

  if (!invitationSentResult.success) {
    return invitationSentResult;
  }

  if (invitationSentResult.exists) {
    const invitation = invitationSentResult.data;

    const partnerResult = await getUserById(invitation.toUserId);
    if (!partnerResult.success) {
      return partnerResult;
    }

    return {
      state: "pending_sent",
      couple: null,
      partner: partnerResult.data,
      invitation,
    };
  }

  // Comprobar si el usuario tiene una invitación recibida pendiente
  const invitationReceivedResult = await getPendingInvitationByField(
    "toUserId",
    currentUser,
  );

  if (!invitationReceivedResult.success) {
    return invitationReceivedResult;
  }

  if (invitationReceivedResult.exists) {
    const invitation = invitationReceivedResult.data;

    const partnerResult = await getUserById(invitation.fromUserId);
    if (!partnerResult.success) {
      return partnerResult;
    }

    return {
      state: "pending_received",
      couple: null,
      partner: partnerResult.data,
      invitation,
    };
  }

  return {
    state: "available",
    couple: null,
    partner: null,
    invitation: null,
  };
};

export const cancelInvitation = async (invitationId) => {
  return await updateInvitationStatus(invitationId, "cancelled");
};
