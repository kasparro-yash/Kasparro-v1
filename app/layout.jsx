import "./globals.css";

export const metadata = {
	title: "Kasparro — AI Trust & Visibility Audit",
	description: "AI-powered brand trust and visibility audit dashboard",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
