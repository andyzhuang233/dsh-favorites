import { Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";

/**
 * dsh-favorites — host half.
 *
 * Registers the `favorites` settings namespace (a list of favorited session
 * ids) so the client can persist the collection through the ordinary settings
 * transport. The client owns all reads/writes; this service only declares the
 * namespace and its schema.
 */

const NAMESPACE = settingsNamespace("favorites");
const SCHEMA = z.object({
	sessionIds: z.array(z.string())
});

class FavoritesService extends Service {
	constructor(ctx) {
		super(ctx, "favorites");
		installSettingsSection(ctx, NAMESPACE, SCHEMA, { sessionIds: [] }, {
			setSource: () => {},
			onChange: () => {}
		});
	}
}

export { FavoritesService, FavoritesService as default };
