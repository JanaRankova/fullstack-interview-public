import { useState, useEffect } from 'react'

import Link from 'next/link'
import { Box, Container, Typography, Stack, Button } from '@mui/material'
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
import { Team } from '@/types'
import TeamRow from '../../components/table/TeamRow'


export default function Teams() {
	const [teams, setTeams] = useState<Team[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [checkedTeams, setCheckedTeams] = useState<Set<string>>(new Set())
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

	const updateCheckedState = (
		teams: Team[],
		checkedIds: Set<string>,
		targetId: string,
		checked: boolean
	): Set<string> => {
		const newChecked = new Set(checkedIds)

		const toggleRecursive = (team: Team) => {
			if (checked) {
				newChecked.add(team.id)
			} else {
				newChecked.delete(team.id)
			}

			team.employees.forEach(emp =>
				checked ? newChecked.add(emp.id) : newChecked.delete(emp.id)
			)

			team.child_teams.forEach(child => toggleRecursive(child))
		}

		const findAndToggle = (teams: Team[]) => {
			for (const team of teams) {
				if (team.id === targetId) {
					toggleRecursive(team)
					break
				} else if (team.child_teams.length > 0) {
					findAndToggle(team.child_teams)
				}
			}
		}

		findAndToggle(teams)

		return newChecked
	}

	const getAllIds = (teams: Team[]): string[] => {
		const ids: string[] = []

		const traverse = (teamList: Team[]) => {
			teamList.forEach(team => {
				ids.push(team.id)
				team.employees.forEach(emp => ids.push(emp.id))
				traverse(team.child_teams)
			})
		}

		traverse(teams)
		return ids
	}

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			const allIds = getAllIds(teams)
			setCheckedTeams(new Set(allIds))
		} else {
			setCheckedTeams(new Set())
		}
	};

	const handleTeamCheckbox = (teamId: string, checked: boolean) => {
		setCheckedTeams(prev =>
			updateCheckedState(teams, prev, teamId, checked)
		)
	}

	const removeEmployeeById = (teams: Team[], employeeId: string): Team[] => {

		return teams.map((team) => {
			const filteredEmployees = team.employees?.filter(
				(emp) => emp.id !== employeeId
			) || []

			const filteredChildTeams = removeEmployeeById(team.child_teams || [], employeeId)

			return {
				...team,
				employees: filteredEmployees,
				child_teams: filteredChildTeams,
		}})
	}

	const removeTeamById = (teams: Team[], teamId: string): Team[] => {
		return teams
			.filter((team) => team.id !== teamId)
			.map((team) => ({
				...team,
				child_teams: removeTeamById(team.child_teams || [], teamId)
			}))
	}

	const handleEmployeeDelete = async (id: string) => {
		await fetch(`http://localhost:8000/employees/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer mysecrettoken123',
			}
		})

		setTeams((prev)  => removeEmployeeById(prev, id))
	}

	const handleTeamDelete = async (id: string) => {
		await fetch(`http://localhost:8000/teams/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer mysecrettoken123',
			}
		})

		setTeams((prev)  => removeTeamById(prev, id))
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
										checked={checkedTeams.size === getAllIds(teams).length && getAllIds(teams).length > 0}
										indeterminate={checkedTeams.size > 0 && checkedTeams.size < getAllIds(teams).length}
										onChange={(event) => handleSelectAll(event.target.checked)}
									/>
								</TableCell>
								<TableCell align="left" sx={{ color: 'white' }}>Team name</TableCell>
								<TableCell/>
							</TableRow>
						</TableHead>
						<TableBody>
							{teams.map((team) => (
								<TeamRow
									key={team.id}
									team={team}
									isNested={false}
									checked={checkedTeams.has(team.id)}
									collapsed={collapsed[team.id]}
									checkedEmployees={checkedEmplyees}
									onCollapseToggle={toggleTeamCollapse}
									onTeamCheck={handleTeamCheckbox}
									onTeamDelete={handleTeamDelete}
									onEmployeesCheck={() => {}}
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
