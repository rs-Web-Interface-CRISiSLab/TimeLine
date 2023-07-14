import { TimeLinePlugin } from "../types";
import { getNearestPoint, isPointInBox } from "../utils";

/**
 * This plugin shows an HTMl popup with info about the nearest point to the mouse.
 * @param formatX A function to convert x-axis values into a human-readable format
 * @param formatY A function to convert y-axis values into a human-readable format
 * @returns {TimeLinePlugin}
 */
export const nearestPointInfoPopupPlugin = (
	formatX: (x: number) => string = (x) => x + "",
	formatY: (x: number) => string = (x) => x + "",
): TimeLinePlugin => ({
	data: {
		hoverText: document.createElement("div"),
		styleTag: document.createElement("style"),
	},
	construct: function (chart) {
		this.data.styleTag.innerText = `.crisislab-timeline-hover-text {
			display: block;
			position: absolute;
			background-color: white;
			color: black;
			padding: 5px;
			border: 1px solid black;
		}`;
		chart.container.appendChild(this.data.styleTag);
		this.data.hoverText.classList.add("crisislab-timeline-hover-text");
		chart.container.appendChild(this.data.hoverText);
		window.addEventListener("mousemove", (event) => {
			this.data.mouseX = event.pageX;
			this.data.mouseY = event.pageY;
		});
	},
	"draw:after": function (chart) {
		const rect = chart.canvas.getBoundingClientRect();
		// Check if the mouse is over the chart
		if (
			isPointInBox(
				this.data.mouseX,
				this.data.mouseY,
				rect.x,
				rect.y,
				rect.width,
				rect.height,
			)
		) {
			const chartX = this.data.mouseX - rect.x;
			const chartY = this.data.mouseY - rect.y;

			// Get the nearest point
			const point = getNearestPoint(chart, { x: chartX, y: chartY });
			if (!point) {
				this.data.hoverText.style.display = "none";
				return;
			}

			// Text
			this.data.hoverText.innerText = `${chart.yLabel}: ${formatY(
				point.y,
			)}
${chart.xLabel}: ${formatX(point.x)}`;
			this.data.hoverText.style.top = rect.y + "px";
			this.data.hoverText.style.display = "block";

			if (chartX > chart.widthWithoutPadding / 2) {
				// The -1 is to avoid a double border
				this.data.hoverText.style.left =
					rect.x + chart.leftPadding + "px";
			} else {
				// Don't need -1 here since clientWidth excludes borders
				this.data.hoverText.style.left =
					rect.right - this.data.hoverText.clientWidth - 1 + "px";
			}
		} else {
			this.data.hoverText.style.display = "none";
		}
	},
});
