import { type Socket, io } from "socket.io-client";
import { z } from "zod";

const WaterSurfaceTileData = z.array(z.number()).length(4);

type TileId = string;

export class NahlunLayerData {
	dataHost: string;
	updateNotificationHost: string;
	socket: Socket;
	waterLevelTileData: Map<string, z.infer<typeof WaterSurfaceTileData> | null>;
	constructor(dataHost: string, updateNotificationHost: string) {
		this.dataHost = dataHost;
		this.updateNotificationHost = updateNotificationHost;

		this.socket = io(`${updateNotificationHost}/water-level-tile`);

		this.waterLevelTileData = new Map();

		this.socket.on(
			"update",
			(tileId: TileId, data: z.infer<typeof WaterSurfaceTileData>) => {
				if (this.waterLevelTileData.has(tileId)) {
					this.waterLevelTileData.set(tileId, data);
				}
			},
		);
	}

	private async fetchTileData(
		tileId: TileId,
	): Promise<z.infer<typeof WaterSurfaceTileData> | null> {
		try {
			const fetchedData = await (
				await fetch(`${this.dataHost}/tiles/water-level/${tileId}`, {
					mode: "cors",
				})
			).json();
			return WaterSurfaceTileData.parse(fetchedData);
		} catch (e) {
			return null;
		}
	}

	async loadData(
		tileId: TileId,
	): Promise<z.infer<typeof WaterSurfaceTileData> | null> {
		const fetchedData = await this.fetchTileData(tileId);

		this.waterLevelTileData.set(tileId, fetchedData);

		return fetchedData;
	}

	unloadData(tileId: TileId): void {
		this.waterLevelTileData.delete(tileId);
	}
}
