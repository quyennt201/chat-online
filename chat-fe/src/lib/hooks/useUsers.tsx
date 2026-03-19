import { toast } from "react-toastify";
import { BASE_URL } from ".";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../../store/useUser";
import type User from "../../types/user.type";

export const useUsers = (ids?: string[]) => {
    const accessToken = useUserStore((state) => state.accessToken)

    const params = ids?.length ? {
        ids: ids.join(",")
    } : undefined
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => getUsers(accessToken ?? '', params),
        enabled: !!accessToken,
    })
}

const getUsers = async (accessToken: string, ids?: Record<string, string>) => {
    const queryParams = new URLSearchParams(ids)
    try {
        const res = await fetch(`${BASE_URL}/users?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        const data: User[] = await res.json()
        return data
    } catch {
        toast("Failed to get users");
    }
};