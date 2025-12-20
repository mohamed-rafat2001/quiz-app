import { NavLink, useNavigate } from "react-router-dom";
import "./sideBar.css";
import { removeToken } from "../api/localStorage";
export default function SideBar() {
	const Navigate = useNavigate();
	return (
		<ul className="list-group side-bar  position-sticky sticky-top position-relative">
			<li className="list-group-item header border-bottom my-3">
				<h3>Q</h3>
				<h5 className="d-none d-lg-block">QUIZ APP</h5>
			</li>

			<NavLink to={"/home"} className="text-decoration-none">
				<li className="list-group-item">
					<i className="bi bi-house"></i>
					<h6 className="d-none d-lg-block">Home</h6>
				</li>
			</NavLink>
			<NavLink to={"/dashboard"} className="text-decoration-none">
				<li className="list-group-item">
					<i className="bi bi-ui-radios-grid"></i>
					<h6 className="d-none d-lg-block">Dashboard</h6>
				</li>
			</NavLink>
			<NavLink to={"/profile"} className="text-decoration-none">
				<li className="list-group-item ">
					<i className="bi bi-person" />
					<h6 className="d-none d-lg-block">Profile</h6>
				</li>
			</NavLink>
			<NavLink to={"/QuizsAsnwers"} className="text-decoration-none">
				<li className="list-group-item ">
					<i className="bi bi-pencil-square" />
					<h6 className="d-none d-lg-block">Quizs Asnwers</h6>
				</li>
			</NavLink>
			<NavLink to={"/Quizs"} className="text-decoration-none">
				<li className="list-group-item ">
					<i className="bi bi-pencil-square" />
					<h6 className="d-none d-lg-block">Quizs</h6>
				</li>
			</NavLink>
			<NavLink to={"/notofications"} className="text-decoration-none">
				<li className="list-group-item  ">
					<i className="bi bi-bell"></i>
					<h6 className="d-none d-lg-block">Notifications</h6>
				</li>
			</NavLink>
			<NavLink to={"/settings"} className="text-decoration-none">
				<li className="list-group-item  ">
					<i className="bi bi-gear"></i>
					<h6 className="d-none d-lg-block">Settings</h6>
				</li>
			</NavLink>
			<div className="position-absolute  row bottom-0 start-0 col-12  border-top pt-3  mb-3 mx-0">
				<button
					className="text-center person btn  fw-bold border-0 col-12 py-2 rounded-pill "
					onClick={() => {
						removeToken();
						Navigate("/");
					}}
					style={{ color: "white" }}
				>
					Log Out
				</button>
			</div>
		</ul>
	);
}
