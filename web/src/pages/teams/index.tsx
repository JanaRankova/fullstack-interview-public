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
	const [isOpen, setOpen] = useState(true)

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
		// if (checkedEmplyees.length === teams.length) {
		// 	setCheckedTeams([])
		// } else {
		// 	// If no or only partial checked select all.
		// 	setCheckedTeams(teams.map((team) => team.id))
		// }
	}

	const handleTeamCheck = (id: string) => {
		if (checkedTeams.includes(id)) {
			setCheckedTeams((prev) => prev.filter((id) => !prev.includes(id)))
		} else {
			setCheckedTeams((prev) => [...prev, id])
		}
	}

	if (isLoading) {
		return (
			<div>Loading</div>
		)
	}


	const transparentCell = <TableCell sx={{backgroundColor: '#f5f5f5'}}/>


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
					<Button variant="outlined" color='error'>Delete selected</Button> {/* two buttons employees and teams */}
				</Stack>
				<TableContainer component={Paper}>
					<Table>
						<TableHead sx={{ backgroundColor: '#1A2638' }}>
							<TableRow>
								<TableCell padding="checkbox"  sx={{ width: '40px', maxWidth: '40px' }}>
									<IconButton
										size="small"
										color='primary'
										onClick={() => setOpen(!isOpen)}
									>
										{isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
									</IconButton>
								</TableCell>
								<TableCell padding={'checkbox'} sx={{ width: '40px', maxWidth: '40px' }}>
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
								<TeamRow key={team.id} team={team} checked={checkedTeams.includes(team.id)} collapsed={!isOpen} checkedEmployees={checkedEmplyees} onTeamCheck={handleTeamCheck} onEmployeesCheck={handleEmployeesCheck}/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	)
}
