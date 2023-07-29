import { TimeLinePlugin } from "../types";
import { getNearestPoint, isPointInBox } from "../utils";

/**
 * This plugin draws a marker on the nearest point to the mouse, when the mouse is over the canvas.
 * @returns {TimeLinePlugin}
 */
export const highlightNearestPointPlugin = (): TimeLinePlugin => ({
	data: {
		mouseX: -1,
		mouseY: -1,
	},
	construct: function () {
		window.addEventListener("mousemove", (event) => {
			this.data.mouseX = event.clientX;
			this.data.mouseY = event.clientY;
		});
	},
	"draw:after": function (chart) {
		// Check if the mouse is over the chart
		if (chart.helpfulInfo.cursor.overChart) {
			// Get the nearest point
			const point = getNearestPoint(chart, {
				x: chart.helpfulInfo.cursor.chartX,
				y: chart.helpfulInfo.cursor.chartY,
			});
			if (!point) {
				return;
			}

			// Ticker line
			chart.ctx.lineWidth = 1.2;

			// Draw a marker on it
			const r = 10;
			chart.ctx.beginPath();
			chart.ctx.arc(point.renderX, point.renderY, r, 0, 2 * Math.PI);
			chart.ctx.stroke();

			// Crosshair
			chart.ctx.beginPath();
			chart.ctx.moveTo(point.renderX, point.renderY - r);
			chart.ctx.lineTo(point.renderX, point.renderY + r);
			chart.ctx.stroke();
			chart.ctx.beginPath();
			chart.ctx.moveTo(point.renderX - r, point.renderY);
			chart.ctx.lineTo(point.renderX + r, point.renderY);
			chart.ctx.stroke();
		}
	},
});
