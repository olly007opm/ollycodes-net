export function checkUsername(username: string) {
    if (!username) {
        return { valid: false, message: "Username is required." }
    } else if (username.length < 3) {
        return { valid: false, message: "Username must be at least 3 characters long." }
    } else if (username.length > 24) {
        return { valid: false, message: "Username must be at most 24 characters long." }
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, message: "Username can only contain letters, numbers, and underscores." }
    } else {
        return { valid: true }
    }
}