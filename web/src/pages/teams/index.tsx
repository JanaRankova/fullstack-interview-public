import { useState, useEffect } from 'react'

import * as React from 'react'
import Link from 'next/link'
import { Box, Container, Typography, Stack, Button} from '@mui/material'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Checkbox } from '@mui/material'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Suspense } from 'react'
import { Team } from '@/types'
import TeamRow from '../../components/table/TeamRow'

interface Props {

}



export default function Teams({

}: Props) {
	const [teams, setTeams] = useState<Team[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [checkedTeams, setCheckedTeams] = useState<string[]>([])
	const [checkedEmplyees, setCheckedEmployees] = useState<string[]>([])
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

	useEffect(() => {
		fetch('http://localhost:8000/teams', {
			headers: {
				Authorization: 'Bearer mysecrettoken123',
			}
		})
			.then((result) => result.json())
			.then((data) => setTeams(data))
			.finally(() => setIsLoading(false))
			.catch((error) => console.error(error))
	}, [])

	const handleTeamsCheck = () => {
		if (checkedTeams.length === teams.length) {
			setCheckedTeams([])
		} else {
			// If no or only partial checked select all.
			setCheckedTeams(teams.map((team) => team.id))
		}
	}

	const handleEmployeesCheck = () => {
		if (checkedEmplyees.length === teams.length) {
			setCheckedTeams([])
		} else {
			// If no or only partial checked select all.
			setCheckedTeams(teams.map((team) => team.id))
		}
	}


	const handleTeamCheck = (id: string) => {
		if (checkedTeams.includes(id)) {
			setCheckedTeams((prev) => prev.filter((id) => !prev.includes(id)))
		} else {
			setCheckedTeams((prev) => [...prev, id])
		}
	}

	const removeEmployeeById = (teams: Team[], employeeId: string): Team[] => {

		return teams.map((team) => {
			const filteredEmployees = team.employees?.filter(
			(emp) => emp.id !== employeeId
		) || []

		// Recursively clean child teams
		const filteredChildTeams = removeEmployeeById(team.child_teams || [], employeeId)

			return {
				...team,
				employees: filteredEmployees,
				child_teams: filteredChildTeams,
			}
		})
	}

	const handleEmployeeDelete = async (id: string) => {
		await fetch(`http://localhost:8000/employees/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer mysecrettoken123',
			},
		})

		// Remove employee from state after successful deletion
		setTeams((prev)  => removeEmployeeById(prev, id))
	}

	const toggleTeamCollapse = (teamId: string) => {
		setCollapsed(prev => ({
			...prev,
			[teamId]: !prev[teamId],
		}))
	}

	const batchToggleCollapsed = (teams: Team[]) => {
		if (Object.values(collapsed).length === teams.length) {
			setCollapsed({})
		} else {
			const toCollapse = teams.reduce((accumulator, team) => {
				accumulator[team.id] = true

				return accumulator
			}, {} as Record<string, boolean>)

			setCollapsed(toCollapse)
		}
	}

	if (isLoading) {
		return (
			<div>Loading</div>
		)
	}

	return (
		<Container >
			<Box my={6}>
				<Typography variant="h4" component="h1" gutterBottom>Teams</Typography>
				<Stack my={2} direction="row" spacing={2}>
					<Link href="/teams/add/team" passHref>
						<Button variant="contained" >Add team</Button>
					</Link>
					<Link href="/teams/add/employee" passHref>
						<Button variant="contained" >Add employee</Button>
					</Link>
					<Button variant="outlined" color='error'>Delete selected</Button>
				</Stack>
				<TableContainer component={Paper}>
					<Table>
						<TableHead sx={{ backgroundColor: '#1A2638' }}>
							<TableRow>
								<TableCell padding="checkbox"  sx={{ width: '40px', maxWidth: '40px', color: 'white'}}>
									<IconButton
										size="small"
										color="inherit"
										onClick={() => batchToggleCollapsed(teams)}
									>
										{Object.values(collapsed).length === teams.length ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon />}
									</IconButton>
								</TableCell>
								<TableCell padding={'checkbox'} sx={{ width: '40px', maxWidth: '40px', color: 'white' }}>
									<Checkbox
										checked={checkedTeams.length === teams.length}
										indeterminate={checkedTeams.length !== 0 && checkedTeams.length < teams.length}
										onChange={handleTeamsCheck}
									/>
								</TableCell>
								<TableCell align="left" sx={{ color: 'white' }}>Team name</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{teams.map((team) => (
								<TeamRow
									key={team.id}
									team={team}
									isNested={false}
									checked={checkedTeams.includes(team.id)}
									collapsed={collapsed[team.id]}
									checkedEmployees={checkedEmplyees}
									onCollapseToggle={toggleTeamCollapse}
									onTeamCheck={handleTeamCheck}
									onEmployeesCheck={handleEmployeesCheck}
									onEmployeeDelete={handleEmployeeDelete}
								/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	)
}
