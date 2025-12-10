import { Outlet } from "react-router-dom";

export default function RootLayout() {
	return (
		<>
			<header>/* Navbar / header */</header>
			<main>
				<Outlet />
			</main>
			<footer>/* Footer */</footer>
		</>
	);
}
