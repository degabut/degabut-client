/* @refresh reload */
import { Main } from "@views/Main";
import { Router } from "solid-app-router";
import { render } from "solid-js/web";
import "./index.css";

render(
	() => (
		<Router>
			<Main />
		</Router>
	),
	document.getElementById("root") as HTMLElement
);
