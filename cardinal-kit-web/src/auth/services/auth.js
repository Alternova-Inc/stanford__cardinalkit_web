import {
    auth,
    googleAuthProvider,
    appleAuthProvider,
} from "@/plugins/firebase/firebase";

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

async function Logout() {
    try {
        await auth.signOut();
    } catch (error) {
        throw new Error(error)
    }
}

export {
    SignIn,
    Logout,
    LogInWithGoogle,
    LogInWithAppleId
}