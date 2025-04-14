import admin from './firebaseAdmin';

// Export firestore từ admin
export const firestore = admin.firestore();
export const auth = admin.auth();

export default admin; 