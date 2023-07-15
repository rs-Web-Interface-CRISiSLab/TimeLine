import { TimeLinePlugin } from "../types";
import { getNearestPoint, isPointInBox } from "../utils";

/**
 * This plugin draws a marker on the nearest point to the mouse, when the mouse is over the canvas.
 * @returns {TimeLinePlugin}
 */
export const doubleClickCopyPlugin = (): TimeLinePlugin => ({
	construct: function (chart) {
		if ("clipboard" in navigator) {
			chart.container.addEventListener("dblclick", (event) => {
				// On double click, copy data to clipboard
				const rect = chart.canvas.getBoundingClientRect();

				const point = getNearestPoint(chart, {
					x: event.clientX - rect.x,
					y: event.clientY - rect.y,
				});
				if (!point) return;
				try {
					// Write in a spreadsheet-pasteable format
					navigator.clipboard.writeText(`${chart.yLabel}	${point.y}
${chart.xLabel}	${point.x}`);
				} catch (err) {
					console.warn("Error writing to clipboard: ", err);
				}
			});
		} else {
			console.warn(
				"Clipboard API not found - double click to copy won't work",
			);
		}
	},
});
