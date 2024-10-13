import { type Socket, io } from "socket.io-client";

type TileId = string;

export class NahlunLayerData {
	shouldUpdate = false;
	lastUpdate = "";
	dataHost: string;
	updateNotificationHost: string;
	socket: Socket;

	constructor(dataHost: string, updateNotificationHost: string) {
		this.dataHost = dataHost;
		this.updateNotificationHost = updateNotificationHost;

		this.socket = io(`${updateNotificationHost}/water-surface`);

		this.socket.on("update", (tileId: TileId, data: string) => {
			this.lastUpdate = data;
			this.shouldUpdate = true;
		});
	}
}
