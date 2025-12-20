import { Outlet, useNavigation } from "react-router-dom";
import SideBar from "./SideBar";
import Loader from "./Loader";
export default function AppLayout() {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";
	return (
		<div className="AppLayout">
			<div className="  row m-0 d-flex ">
				{isLoading && <Loader />}
				<div
					className="col-2"
					style={{
						backgroundColor: "#5046e5",
					}}
				>
					<SideBar />
				</div>
				<main className="col-10 p-0  " style={{ backgroundColor: "#f9fafc" }}>
					<Outlet />
				</main>
			</div>
		</div>
	);
}
