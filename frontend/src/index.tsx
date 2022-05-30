/* @refresh reload */
import { Landing, Login, OAuth } from "@views";
import { App } from "@views/App";
import { Queue } from "@views/App/Queue";
import { Recommend } from "@views/App/Recommend";
import { Search } from "@views/App/Search";
import { VideoDetail } from "@views/App/VideoDetail";
import { Route, Router, Routes } from "solid-app-router";
import { render } from "solid-js/web";
import "./index.css";

render(
	() => (
		<Router>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/login" element={<Login />} />
				<Route path="/oauth" element={<OAuth />} />
				<Route path="/app" element={<App />}>
					<Route path="/" element={<Queue />} />
					<Route path="/queue" element={<Queue />} />
					<Route path="/video/:id" element={<VideoDetail />} />
					<Route path="/recommended" element={<Recommend />} />
					<Route path="/search" element={<Search />} />
				</Route>
			</Routes>
		</Router>
	),
	document.getElementById("root") as HTMLElement
);
