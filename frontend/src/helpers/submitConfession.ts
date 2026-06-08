import type { Confession } from "../types/Confession";

export function submitConfession(confession: Confession): Confession | void {
    if (!confession.text.trim()) return;

    fetch("/api/confession", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(confession),
    });

    return confession;
}