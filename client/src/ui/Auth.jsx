import { useState } from "react";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/SignUp";
import image from "../images/authBackGround.png";
import "./auth.css";
export default function Auth() {
	const [state, setState] = useState(true);
	return (
		<div className="Auth container-fluid">
			<div className="row" style={{ height: "100vh" }}>
				<div className="left d-none d-sm-flex col-sm-4 p-0 justify-content-center align-items-center">
					<h2 className="text-white" style={{ width: "70%" }}>
						Wellcome to Quiz Application.
					</h2>
				</div>
				<div className="right col-12 col-sm-8 p-0 d-flex justify-content-center align-items-center">
					<div className="auth col-10 col-md-6">
						<div className="my-5 col-12 d-flex justify-content-center">
							<button
								className="py-2 px-5 rounded-pill border border-secondary-subtile me-2 "
								onClick={() => setState(false)}
								style={{
									background: !state && "#5046e5",
									color: !state && "white",
								}}
							>
								Login
							</button>
							<button
								className="py-2 px-5  border rounded-pill border-secondary-subtile "
								onClick={() => setState(true)}
								style={{
									background: state && "#5046e5",
									color: state && "white",
								}}
							>
								sign Up
							</button>
						</div>
						<div className="col-12 ">{state ? <SignUp /> : <Login />}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
