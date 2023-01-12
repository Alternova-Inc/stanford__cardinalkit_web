import {
    auth,
    googleAuthProvider,
    appleAuthProvider,
} from "@/plugins/firebase/firebase";

async function SignIn({ email, password }) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        return {
            isLogged: "true"
        }
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
        return {
            isLogged: "true"
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function LogInWithAppleId() {
    try {
        await auth.signInWithPopup(appleAuthProvider);
        return {
            isLogged: "true"
        }
    } catch (error) {
        throw new Error(error);
    }
}

async function Logout() {
    try {
        await auth.signOut();
        return {
            isLogged: "false"
        }
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