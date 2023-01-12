import {
    auth,
    googleAuthProvider,
    appleAuthProvider,
    secondaryProvider,
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

async function SignUp(email, password) {
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        return {
            // ...
        }
    } catch (error) {
        throw new Error(error)
    }
}

async function SingUpNoPassword(payload) {
    const { v4: uuidv4 } = require("uuid");
    try {
        secondaryProvider.createUserWithEmailAndPassword(payload.email, uuidv4());
        secondaryProvider.sendPasswordResetEmail(payload.email);
        request.POST(`users_roles/${user.uid}`, { data: { rol: "doctor", studies: payload.studies } })
    } catch (error) {
        throw new Error(error)
    }
}

export {
    SignIn,
    SignUp,
    SingUpNoPassword,
    Logout,
    LogInWithGoogle,
    LogInWithAppleId
}