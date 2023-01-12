import {
    auth,
    googleAuthProvider,
    appleAuthProvider,
    secondaryProvider
} from "@/plugins/firebase/firebase";
import request from "@/Rest";

async function SignIn({ email, password }) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        if (error.code === "auth/network-request-failed") {
            throw new Error("No internet connection");
        }
        else {
            throw new Error("The username or password is incorrect");
        }
    }
}

async function LogInWithGoogle() {
    try {
        await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
        throw new Error(error);
    }
}

async function LogInWithAppleId() {
    try {
        await auth.signInWithPopup(appleAuthProvider);
    } catch (error) {
        throw new Error(error);
    }
}

async function SignUpNoPassword(email, studies) {
    const { v4: uuidv4 } = require("uuid");
    try {
        const { user } = await secondaryProvider.createUserWithEmailAndPassword(email, uuidv4());
        await secondaryProvider.sendPasswordResetEmail(email);
        request.POST(`users_roles/${user.uid}`, { data: { rol: "doctor", studies: studies } })
    } catch (error) {
        throw new Error(error);
    }
}

async function Logout() {
    try {
        await auth.signOut();
    } catch (error) {
        throw new Error(error)
    }
}

export {
    SignIn,
    SignUpNoPassword,
    Logout,
    LogInWithGoogle,
    LogInWithAppleId
}