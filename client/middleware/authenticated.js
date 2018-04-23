

export default function(context, req) {
	if (process.server && !req) return;
}
