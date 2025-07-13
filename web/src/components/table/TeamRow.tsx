import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { Checkbox } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Team } from '@/types'
import EmployeeRow from './EmployeeRow'

interface Props {
	team: Team
	checked: boolean
	collapsed: boolean
	checkedEmployees: string[]
	onEmployeesCheck: (ids: string[]) => void
	onTeamCheck: (id: string) => void
}

export default function TeamRow({team, checked, checkedEmployees, collapsed, onTeamCheck}: Props) {

	const [isOpen, setOpen] = React.useState(false)

	const handleEmployeeCheck = (ids: string[]) => {
		// if (checkEmplyees.includes(id)) {
		// 	setChecked((prev) => prev.filter((id) => !prev.includes(id)))
		// } else {
		// 	setChecked((prev) => [...prev, id])
		// }
	}
	const employeeCheckbox = (ids: string[]) => (
		<Checkbox
			checked={checkedEmployees.length === team.employees.length}
			indeterminate={checkedEmployees.length !== 0 && checkedEmployees.length < team.employees.length}
			onChange={() => handleEmployeeCheck(ids)}
		/>
	)
	const employeeLabels = ['Name', 'Surname', 'Position', 'Team']

	const groupCheckbox =
	<Checkbox
		checked={false/* checkedTeams.length === teams.length */}
		indeterminate={false/* checkedTeams.length !== 0 && checkedTeams.length < teams.length */}
		onChange={() => {}/* handleTeamsCheck */}
	/>

	const transparentCell = <TableCell sx={{backgroundColor: '#f5f5f5'}}/>

	return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell padding="checkbox">
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!isOpen)}
					>
						{isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell padding={'checkbox'}>
					<Checkbox
						checked={checked}
						onChange={() => onTeamCheck(team.id)}
					/>
				</TableCell>
				<TableCell component="th" scope="row">
					{team.name}
				</TableCell>
			</TableRow>

			{(team.employees.length > 0 || team.child_teams.length > 0) ?
				<TableRow>
					<TableCell colSpan={3} sx={{ paddingBottom: 0, paddingTop: 0, paddingRight: 0, paddingLeft: '44px'}}>
						<Collapse in={!collapsed} timeout="auto" unmountOnExit>
							{team.employees.length > 0 && <Box>
								<Table sx={{borderBottom: '1px solid #cccccc'}}>
									<TableHead sx={{ backgroundColor: '#47515f' }}>
										<TableRow>
											<TableCell padding={'checkbox'}>
												<Checkbox
													checked={checkedEmployees.length === team.employees.length}
													indeterminate={checkedEmployees.length !== 0 && checkedEmployees.length < team.employees.length}
													onChange={() => handleEmployeeCheck([])}
												/>
											</TableCell>
											{employeeLabels.map((label) => (
												<TableCell key={label} align="left" sx={{ color: 'white' }} children={label} />
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{team.employees.map((employee) => <EmployeeRow key={employee.id} employee={employee} checked={false} onEmployeeCheck={handleEmployeeCheck}/>)}
									</TableBody>
								</Table>
							</Box>}

							{team.child_teams.length > 0 && <Box>
								<Table sx={{borderBottom: '1px solid #cccccc'}}>
									<TableHead sx={{ backgroundColor: '#1A2638' }}>
										<TableRow>
											<TableCell />
											<TableCell padding={'checkbox'}>
												<Checkbox
													checked={checked}
													onChange={() => onTeamCheck(team.id)}
												/>
											</TableCell>
											<TableCell align="left" sx={{ color: 'white' }} children={'Team name'} />
										</TableRow>
									</TableHead>
									<TableBody>
										{team.child_teams.map(((childTeam) => (
											<TeamRow
												key={childTeam.id}
												team={childTeam}
												checked={false}
												collapsed={false}
												checkedEmployees={[]}
												onEmployeesCheck={([]) => {}}
												onTeamCheck={() => {}}
											/>
										)))}
									</TableBody>
							</Table>
							</Box>}
						</Collapse>
					</TableCell>
				</TableRow> : null
			}
		</React.Fragment>
	)
}
