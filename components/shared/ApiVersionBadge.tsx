import { getHealthAction } from "@/app/actions/health.actions";

export default async function ApiVersionBadge() {
	const health = await getHealthAction();

	if (!health) return null;

	const { version, uptime } = health;
	const uptimeDisplay =
		uptime < 3600
			? `${Math.floor(uptime / 60)}m uptime`
			: `${Math.floor(uptime / 3600)}h uptime`;

	return (
		<span className="text-sm font-medium text-foreground border border-border rounded px-2 py-1">
			v{version} · {uptimeDisplay}
		</span>
	);
}
