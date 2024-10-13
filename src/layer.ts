import {
	CompositeLayer,
	type LayersList,
	ScenegraphLayer,
	SolidPolygonLayer,
	TileLayer,
} from "deck.gl";
import type { NahlunLayerData } from "./data.js";

export class NahlunLayer extends CompositeLayer {
	static layerName: string;
	static defaultProps: {
		data: NahlunLayerData;
	};
	renderLayers(): LayersList {
		return [
			new TileLayer({
				...this.getSubLayerProps({
					id: "VoxelLand",
					maxZoom: 15,
					minZoom: 1,
				}),
				renderSubLayers: (props) => {
					const { boundingBox, index } = props.tile;
					const { x, y, z } = index;

					const host = (this.props.data as NahlunLayerData).dataHost;

					return new ScenegraphLayer(props, {
						id: `voxel-land-${x}-${y}-${z}`,
						scenegraph: `${host}/tiles/land/${z}/${x}/${y}`,
						data: [{ position: boundingBox[0] }],
						getPosition: (d) => d.position,
						getOrientation: (_) => [0, 0, 90],
						_animations: null,
						pickable: false,
					});
				},
			}),
			new TileLayer({
				...this.getSubLayerProps({
					id: "WaterSurface",
					maxZoom: 15,
					minZoom: 15,
				}),
				renderSubLayers: (props) => {
					const { x, y, z } = props.tile.index;

					const host = (this.props.data as NahlunLayerData).dataHost;
					const datetime = (this.props.data as NahlunLayerData).lastUpdate;

					return new SolidPolygonLayer(props, {
						id: `water-surface-${x}-${y}-${z}`,
						data: `${host}/tiles/water/${z}/${x}/${y}?datetime=${datetime}`,
						getPolygon: (d) => d,
						getFillColor: [61, 154, 193, 50],
					});
				},
			}),
		];
	}
}

NahlunLayer.layerName = "NahlunLayer";
