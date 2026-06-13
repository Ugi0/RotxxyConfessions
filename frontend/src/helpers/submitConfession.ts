import type { Confession } from "../types/Confession";

export async function refreshToken(): Promise<void> {
    await fetch("/api/confession", {
        method: "GET",
        credentials: "include",
    });
}

export async function submitConfession(
    confession: Confession
): Promise<Confession | void> {
    if (!confession.content.trim()) return;

    async function sendRequest() {
        return fetch("/api/confession", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(confession),
        });
    }

    let response = await sendRequest();

    if (response.status === 401) {
        await refreshToken();
        response = await sendRequest();
    }

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return confession;
}