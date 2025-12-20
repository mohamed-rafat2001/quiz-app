import { useQueryClient } from "@tanstack/react-query";
import { getToken } from "../api/localStorage";
import { useEffect, useState } from "react";

export default function useProtect() {
	const queryQlient = useQueryClient();
	const user = queryQlient.getQueryData(["userData"]);

	const token = getToken();
	if (token === user?.token) {
		return true;
	} else {
		return false;
	}
}
