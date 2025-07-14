import { Controller, useForm } from "react-hook-form"
import Link from 'next/link'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material"
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FormFieldError } from "../../../components/forms/FormFieldError"
import { FormSuccess } from "../../../components/forms/FormSuccess"
import { FormError } from "../../../components/forms/FormError"
import { Team } from '@/types'

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  parentTeam: yup.string(),
})


export default function TeamAdd() {
	const [formError, setFormError] = useState(false)
	const [success, setSuccess] = useState(false)
	const [teams, setTeams] = useState<Team[] | null>(null)
	const [isLoading, setLoading] = useState(true)
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

	const router = useRouter()

	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) })

	const onSubmit = handleSubmit(async (formData) => {
		console.log(formData)

		const response = await fetch('http://localhost:8000/teams', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer mysecrettoken123',
			},
			body: JSON.stringify({
				name: formData.name,
				parent_team_id: formData.parentTeam,
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
	 <Box m={6}>
		<Typography variant="h4" mb={3}>
			Add Team
		</Typography>
		<form onSubmit={onSubmit}>
		  <Controller
			 name="name"
			 defaultValue=""
			 control={control}
			 render={({ field }) => (
				<TextField fullWidth {...field} label="Name" />
			 )}
		/>

		  {errors.name && <FormFieldError text={errors.name.message} />}

		  <FormControl fullWidth sx={{ mt: 3 }}>
			 <InputLabel>Parent team</InputLabel>
			 <Controller
				name="parentTeam"
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

		{errors.parentTeam && (
			 <FormFieldError text={errors.parentTeam.message} />
		)}
			<Stack my={2} direction="row" spacing={2}>
				<Button type="submit" variant="contained">
					Add Team
				</Button>
				<Link href="/teams" passHref>
					<Button type="button" variant="outlined" color='error'>
						Cancel
					</Button>
				</Link>
			</Stack>
		  {formError && <FormError text="Please fill out the form correctly" />}
		  {success && <FormSuccess text="Team Added" />}
		</form>
	 </Box>
  )
}
