import { windows, Window } from "$stores/windows"
import SignIn from "$components/windows/SignIn.svelte"

export function createSignInWindow() {
    const signInWindow = new Window({
        id: "signin",
        title: "Sign In",
        icon: "/icon/users_key-3.png",
        component: SignIn,
        width: 768,
        height: 512,
        minWidth: 768,
        minHeight: 512,
        resizable: false,
        closable: true,
        minimizable: false,
        movable: false,
        forceFocus: true,
        center: true,
        focused: true,
        taskbarIndex: 0
    })

    windows.update(wins => [...wins, signInWindow])
}