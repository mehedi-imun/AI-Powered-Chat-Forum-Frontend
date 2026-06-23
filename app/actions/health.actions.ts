"use server";

const BASE_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

interface HealthResponse {
	version: string;
	uptime: number;
}

export async function getHealthAction(): Promise<HealthResponse | null> {
	try {
		const response = await fetch(`${BASE_URL}/health`, {
			next: { revalidate: 60 },
		});

		if (!response.ok) return null;

		const data = await response.json();

		if (
			typeof data?.version === "string" &&
			typeof data?.uptime === "number"
		) {
			return { version: data.version, uptime: data.uptime };
		}

		return null;
	} catch {
		return null;
	}
}
