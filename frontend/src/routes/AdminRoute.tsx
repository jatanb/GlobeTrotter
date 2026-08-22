import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface AdminRouteProps {
	children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
	const storedUser = localStorage.getItem("globetrotter_user");
	const user = storedUser ? JSON.parse(storedUser) as { is_admin?: boolean } : {};

	return user.is_admin ? children : <Navigate to="/" replace />;
}
