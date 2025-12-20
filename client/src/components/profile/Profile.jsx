import { useState } from "react";
import image from "../../images/Picsart_22-08-02_06-32-06-459.png";
import "./profile.css";
import UserDetails from "./UserDetails";
import UpdatePass from "./UpdatePass";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/userApi";
function Profile() {
	const [active, setActive] = useState("details");
	const {
		data: user,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["user"],
		queryFn: getMe,
	});
	return (
		<div className="Profile">
			<div className="Profile-images">
				<div>
					<img src={image} alt="" />
				</div>
			</div>
			<div className="container mt-5 py-3 px-4  ">
				<div className="row">
					<div className="col-12 mb-3">
						<h4 className="fw-bold mb-1">{user?.name}</h4>
						<span>
							<i className="bi bi-envelope me-2 text-secondary"></i>
						</span>
						<small className="text-secondary">{user?.email}</small>
					</div>
					<ul className="col-12 list-inline mb-1  text-secondary text-center">
						<li
							className={
								active === "details"
									? "list-inline-item me-5 px-3 pb-1  active"
									: "list-inline-item me-5 px-3 pb-1"
							}
							onClick={() => {
								setActive("details");
							}}
						>
							Details
						</li>
						<li
							className={
								active === "password"
									? "list-inline-item px-3 pb-1 active"
									: "list-inline-item px-3 pb-1"
							}
							onClick={() => {
								setActive("password");
							}}
						>
							Password
						</li>
					</ul>
					{active === "details" && <UserDetails />}
					{active === "password" && <UpdatePass />}
				</div>
			</div>
		</div>
	);
}
export default Profile;
