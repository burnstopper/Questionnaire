import React, { useState, useEffect } from "react";
import "./radio.css";
import "./styles.css";
import axios from "axios";
import LoadingScreen from "react-loading-screen";
import { Spinner } from "react-bootstrap";

import CookieLib from "../../cookielib/index";

function calculateAge(birthday) {
	// birthday is a date
	var ageDifMs = Date.now() - birthday;
	if (ageDifMs < 0) return -1;
	var ageDate = new Date(ageDifMs); // miliseconds from epoch
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function Form() {
	const [params, setParams] = useState({ loading: true });
	const [another, setAnother] = useState(false);
	const [token, setToken] = useState(null);
	useEffect(() => {
		async function data() {
			setToken(CookieLib.getCookieToken());
			setParams({
				...((await axios
					.get("localhost:8081/api/fetch-results", {
						params: {
							respondent_token: token,
						},
					})
					.catch(() => {})) || {}),
				loading: false,
			});
		}
		data();
	}, []);

	function setWork(e) {
		setParams({ ...params, work: e.target.value });
		setAnother(false);
	}
	/**
	 *
	 * @param {String} str
	 * @returns
	 */
	function rebuildBirth(str) {
		str = str.replace("/", "");
		return `${str.slice(0, 2)}/${str.slice(2, 6)}`;
	}

	function submit() {
		let birth = new Date(
			params.birthday.slice(0, 2) + "/01/" + params.birthday.slice(3, 7)
		);

		if (
			params.birthday.length < 7 ||
			isNaN(birth) ||
			calculateAge(birth) <= 0
			// || calculateAge(birth) > 90
		)
			return alert("Вы ввели неправильную дату");
		let uncheck = ["gender", "work", "workedYears", "birthday"].filter(
			(x) => !params[x] || params[x] === ""
		);
		if (uncheck.length !== 0)
			return alert(`Вы не ввели: ${uncheck.join(", ")}`);

		axios.post("localhost:8081/api/submit", params, {
			params: { respondent_token: token },
		});
	}

	return params.loading ? (
		<>
			{" "}
			<LoadingScreen
				loading={true}
				bgColor="#E7E2E2"
				spinnerColor="#ff7f50"
				textColor="#676767"
			></LoadingScreen>
			<Spinner animation="border" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
			<div
				id="loading"
				style={{
					backgroundImage:
						"url('https://cdn.discordapp.com/attachments/1081428905082245130/1081484406549651517/ezgif-5-d1da3f96d7.gif') no-repeat center center fixed",
				}}
			></div>
		</>
	) : (
		<div class="parent">
			<div id="upTile">
				<a id="text">Форма анкеты</a>
				<button id="btnBack" onclick=""></button>
			</div>

			<div class="wrapper">
				<a id="quizText">Пол:</a>
				<br />
				<input
					type="radio"
					name="select"
					id="option-1"
					checked={params.gender === "male"}
					onClick={() => setParams({ ...params, gender: "male" })}
				/>
				<input
					type="radio"
					name="select"
					id="option-2"
					checked={params.gender === "female"}
					onClick={() => setParams({ ...params, gender: "female" })}
				/>
				<label for="option-1" class="option option-1">
					<div class="dot"></div>
					<span>Мужской</span>
				</label>
				<label for="option-2" class="option option-2">
					<div class="dot"></div>
					<span>Женский</span>
				</label>
			</div>

			<div id="quizTile">
				<div id="createQuizTile1" class="row">
					<a id="quizText">День Рождения</a>
					<input
						id="search"
						type="text"
						placeholder="Месяц/год"
						value={params.birthday}
						onChange={(e) =>
							setParams({ ...params, birthday: rebuildBirth(e.target.value) })
						}
					/>
				</div>

				<div id="createQuizTile1" class="row">
					<a id="quizText">Специальность</a>
					<select id="select" onChange={setWork} value={params.work}>
						<option value="1">Специальность 1</option>
						<option value="2">Специальность 2</option>
						<option value="3">Специальность 3</option>
						<option value="">Другое</option>
					</select>
				</div>

				{another ? (
					<div id="createQuizTile1" class="row">
						<div id="createQuizTile1" class="row">
							<a id="quizText">Другое</a>
							<input
								id="search"
								type="text"
								placeholder="Введите свою специальность"
								value={params.work}
								onChange={(e) =>
									setParams({
										...params,
										work: e.target.value,
									})
								}
							/>
						</div>
					</div>
				) : (
					<></>
				)}

				<div id="createQuizTile1" class="row">
					<a id="quizText">Сейчас лет работы</a>
					<input
						id="search"
						type="text"
						placeholder="Число"
						value={params.workedYears}
						onChange={(e) =>
							setParams({ ...params, workedYears: e.target.value.slice(0, 2) })
						}
					/>
				</div>
			</div>

			<div id="downTile">
				<button id="btnPlay" onClick={submit}>
					Сохранить
				</button>
			</div>
		</div>
	);
}
