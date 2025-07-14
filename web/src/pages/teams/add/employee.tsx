import { Controller, useForm } from "react-hook-form"
import { useRouter } from 'next/router'
import {
	Box,
	FormControl,
	InputLabel,
	Select,
	Stack,
	TextField,
	Typography,
	Button,
	MenuItem,
} from "@mui/material"
import { useState, useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormFieldError } from "../../../components/forms/FormFieldError"
import { FormError } from "../../../components/forms/FormError"
import { FormSuccess } from "../../../components/forms/FormSuccess"
import { Team } from '@/types'

const schema = yup.object().shape({
	name: yup.string().required("Name is required"),
	surname: yup.string().required("Surname is required"),
	team: yup.string().required("Team is required"),
	position: yup.string(),
	startDate: yup.date(),
	endDate: yup
		.date()
		.min(yup.ref("startDate"), "End date can't be before start date"),
})

interface Props {
}

export default function EmployeeAdd() {
	const [teams, setTeams] = useState<Team[] | null>(null)
	const [isLoading, setLoading] = useState(true)
	const [formError, setFormError] = useState(false)
	const [success, setSuccess] = useState(false)

	const router = useRouter()

	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) })

	useEffect(() => {
		fetch('http://localhost:8000/teams/flatTeams', {
			headers: {
				Authorization: 'Bearer mysecrettoken123',
			}
		})
			.then((result) => result.json())
			.then((data) => setTeams(data))
			.finally(() => setLoading(false))
			.catch((error) => console.error(error))
	}, [])

	const onSubmit = handleSubmit(async (formData) => {
		console.log(formData)

		const response = await fetch('http://localhost:8000/employees', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer mysecrettoken123',
			},
			body: JSON.stringify({
				name: formData.name,
				surname: formData.surname,
				position: formData.position,
				created_at: new Date().toISOString(),
				start_date: formData.startDate?.toISOString(),
				end_date: formData.endDate?.toISOString(),
				team_id: formData.team,
			}),
		})

		if	(response.ok) {
			setSuccess(true)
			router.push('/teams')
		} else {
			setFormError(true)
		}

		reset()
		setTimeout(() => setSuccess(false), 2000)
	})

	return (
		<Box  m={6}>
			<Typography variant="h4" mb={3}>
				Add employee
			</Typography>
			<form onSubmit={onSubmit}>
				<Stack direction="row" gap={3}>
					<Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
						<Controller
							name="name"
							defaultValue=""
							control={control}
							render={({ field }) => (
								<TextField fullWidth {...field} label="Name" />
							)}
						/>

						{errors.name && <FormFieldError text={errors.name.message} />}
					</Box>
					<Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
						<FormControl fullWidth>
							<Controller
								name="surname"
								defaultValue=""
								control={control}
								render={({ field }) => (
									<TextField fullWidth {...field} label="Last Name" />
								)}
							/>
						</FormControl>

						{errors.surname && <FormFieldError text={errors.surname.message} />}
					</Box>
				</Stack>
				<FormControl fullWidth sx={{ mt: 3 }}>
					<InputLabel>Team</InputLabel>
					<Controller
						name="team"
						defaultValue=""
						control={control}
						render={({ field }) => (
							<Select {...field} label="Team">
								{isLoading ? 'teams are loading' : teams?.map((team) => (
									<MenuItem key={team.id} value={team.id}>
										{team.name}
									</MenuItem>
								))}
							</Select>
						)}
					/>
				</FormControl>

				{errors.team && <FormFieldError text={errors.team.message} />}

				<Stack
					direction="row"
					gap={3}
					mt={3}
					flexWrap={{ xs: "wrap", md: "nowrap" }}
				>
					<Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
						<InputLabel>Start Date </InputLabel>
						<Controller
							defaultValue={undefined}
							name="startDate"
							control={control}
							render={({ field }) => (
								<TextField fullWidth type="date" {...field} />
							)}
						/>

						{errors.startDate && (
							<FormFieldError text={errors.startDate.message} />
						)}
					</Box>
					<Box sx={{ flex: { xs: "0 0 100%", md: "0 1 50%" } }}>
						<InputLabel>End Date </InputLabel>
						<Controller
							defaultValue={undefined}
							name="endDate"
							control={control}
							render={({ field }) => (
								<TextField fullWidth type="date" {...field} value={field.value ?? ''}/>
							)}
						/>
						{errors.endDate && <FormFieldError text={errors.endDate.message} />}
					</Box>
				</Stack>
				<Box mt={3}>
					<Controller
						defaultValue=""
						name="position"
						control={control}
						rules={{ required: true }}
						render={({ field }) => (
							<TextField fullWidth {...field} label="Position" />
						)}
					/>
					{errors.position && <FormFieldError text={errors.position.message} />}
				</Box>

				<Button type="submit" variant="contained" sx={{ my: 3 }}>
					Add employee
				</Button>
				{formError && <FormError text="Please fill out the form correctly" />}
				{success && <FormSuccess text="Employee Added" />}
			</form>
		</Box>
	)
}
