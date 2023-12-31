# TimeLine

TimeLine is the dependency-free Typescript time-series web realtime graphing library developed in-house at [CRISiSLab](https://www.crisislab.org.nz/).

We use TimeLine in production [here](https://shakemap.crisislab.org.nz/).

However, this library is designed for one use-case: rendering live seismograph data. It might not be ideal for your use-case. You should also check out [huww98/TimeChart](https://github.com/huww98/TimeChart).

## Usage

### Installation

```
npm i @crisislab/timeline
```

Typescript definitions are included in the package.

### Important notes!

-   `data` should be sorted by x-value, with smallest values first. If you always add new data onto the end, this shouldn't be a problem.
-   Make sure that the `data` array you give to the chart isn't longer than `maxLength`
-   Call `chart.recompute()` whenever you've updated the data array. You can also use this to batch changes by waiting until you're done modifying `data` before recomputing.
-   The chart won't compute or draw anything if there are less than two points.
-   The chart doesn't automatically draw itself. You have to call `chart.draw()`. Note: calling `chart.recompute()` won't re-draw the chart
-   `chart.draw()` doesn't recompute any data, so if you never call `chart.recompute()`, adding new points to `data` won't show up.

### Examples

<details>
<summary>Basic live data</summary>

```ts
import {
	TimeLine,
	Point,
	xAxisPlugin,
	axisLabelPlugin,
} from "@crisislab/timeline";

const data: Point[] = [];
const maxPoints = 300;
const chart = new TimeLine({
	container: document.getElementById("chart-container") as HTMLElement,
	data,
	maxPoints,
	// Note that these aren't used by the chart itself, they're just used by plugins
	xLabel: "Time",
	yLabel: "Random numbers",
	plugins: [
		// By default, the chart doesn't draw an x or y axis.
		// You can use these built-in plugins though.
		xAxisPlugin((x) => new Date(x).toLocaleTimeString()),
		axisLabelPlugin(),
	],
});

let prev = 0;
setInterval(() => {
	const y =
		prev + Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? -1 : 1);
	prev = y;
	data.push({
		x: Date.now(),
		y,
	});
	// This is very important!
	// You can't have more points in the data array
	// than chart.maxPoints, or you'll have weird
	// rendering issues.
	while (data.length > maxPoints) {
		data.shift();
	}

	// Call chart.recompute() when you're done updating `data`
	chart.recompute();
}, 50);

// Note that you need to call chart.draw() yourself
function renderLoop() {
	requestAnimationFrame(renderLoop);
	chart.draw();
}
renderLoop();
```

</details>

More examples in the [examples folder](./examples/).

### Plugins

There are several plugins included:

-   `xAxisPlugin`: Adds an x-axis (but not an axis label)
-   `yAxisPlugin`: Adds an y-axis (but not an axis label)
-   `axisLabelPlugin`: Adds axis labels for the X and Y axis
-   `pointerCrosshairPlugin`: Adds a crosshair that follows the mouse
-   `highlightNearestPointPlugin`: Draws a marker on the nearest point to the mouse
-   `doubleClickCopyPlugin`: Makes double clicking on the canvas copy the values of the nearest point in tsv (csv) format to the clipboard

## Credit

This project was inspired by [TimeChart](https://github.com/huww98/TimeChart) by [huww98](https://github.com/huww98). We were originally using huww98's library, but found that webGL was excessive for our needs, and created too many problems to justify continuing to use it. Our library's API design is inspired by huww98's library, and the visuals are similar, but under the hood it's completly different. Our library uses the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) instead of [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) for rendering, so it won't be as performant for huge amounts of data.
