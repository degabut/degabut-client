import { Icon, Icons } from "@components";
import { doubleClick } from "@directives";
import { Component, JSX, onMount, splitProps } from "solid-js";
import { Quit, WindowMaximise, WindowMinimise, WindowUnmaximise } from "../../../wailsjs/runtime/runtime";

doubleClick;

type AppIconProps = JSX.HTMLAttributes<HTMLDivElement> & {
	icon: Icons;
};

const AppIcon: Component<AppIconProps> = (props) => {
	const [{ icon }, rest] = splitProps(props, ["icon"]);

	return (
		<div class="hover:cursor-pointer hover:bg-white/10 px-4 py-2" {...rest}>
			<Icon name={icon} extraClass="w-[0.625rem] h-[0.625rem] fill-white" />
		</div>
	);
};

export const AppMenuBar = () => {
	let isMaximized = false;
	let isDragging = false;

	const toggleMaximize = () => {
		console.log("toggling");
		isMaximized = !isMaximized;
		isMaximized ? WindowMaximise() : WindowUnmaximise();
	};

	onMount(() => {
		document.addEventListener("mousemove", () => {
			if (isDragging && isMaximized) isMaximized = false;
		});
	});

	return (
		<div
			class="flex flex-row items-stretch pl-4 bg-neutral-900"
			onMouseDown={() => (isDragging = true)}
			onMouseUp={() => (isDragging = false)}
		>
			<div
				class="flex flex-grow text-sm text-neutral-500 uppercase font-medium my-auto"
				data-wails-drag
				use:doubleClick={toggleMaximize}
			>
				Degabut
			</div>
			<div class="flex flex-row items-stretch">
				<AppIcon icon="minus" onClick={() => WindowMinimise()} />
				<AppIcon icon="squareLine" onClick={toggleMaximize} />
				<AppIcon icon="closeLine" onClick={() => Quit()} />
			</div>
		</div>
	);
};
