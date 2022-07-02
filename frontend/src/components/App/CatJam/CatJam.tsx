import { Component, onCleanup, onMount } from "solid-js";

export const CatJam: Component = () => {
	onMount(() => document.addEventListener("keydown", onKeyDown));
	onCleanup(() => document.removeEventListener("keydown", onKeyDown));

	const onKeyDown = (e: KeyboardEvent) => {
		const target = e.target as Element | null;
		const tagName = target?.tagName.toUpperCase();

		if (tagName !== "INPUT" && tagName !== "TEXTAREA" && e.key === "j") {
			e.preventDefault();
			jam();
		}
	};

	const jam = () => {
		const element = document.createElement("img");
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		element.src = "https://c.tenor.com/1MG3j4q4W5AAAAAj/cat-jam.gif";
		element.className = "fixed w-16 h-16 pointer-events-none z-[1000]";

		const x = random(0, screenWidth);
		const speed = random(6, 18);

		element.style.transform = `translate(${x}px, 0px)`;
		element.style.transition = `opacity 3s linear, transform ${speed}s linear`;
		document.body.appendChild(element);

		setTimeout(() => {
			element.style.transform = `translate(${x}px, -${screenHeight * 2}px)`;
		}, 50);

		setTimeout(() => {
			element.style.opacity = "0";
			setTimeout(() => element.remove(), 3000);
		}, 3000);
	};

	const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

	return <></>;
};
