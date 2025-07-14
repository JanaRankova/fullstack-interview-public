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
	isNested: boolean
	checked: boolean
	collapsed: boolean
	checkedEmployees: string[]
	onCollapseToggle: (id: string) => void
	onEmployeesCheck: (ids: string[]) => void
	onTeamCheck: (id: string) => void
	onEmployeeDelete: (id: string) => void
}

export default function TeamRow({team, isNested, checked, checkedEmployees, collapsed, onTeamCheck, onEmployeeDelete, onCollapseToggle}: Props) {

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

	return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell padding="checkbox">
					{isNested ? null : (
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => onCollapseToggle(team.id)}
						>
							{!collapsed ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					)}
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
											<TableCell/>
										</TableRow>
									</TableHead>
									<TableBody>
										{team.employees.map((employee) => (
										<EmployeeRow
											key={employee.id}
											employee={employee}
											checked={false}
											onDelete={() => onEmployeeDelete(employee.id)}
											onEmployeeCheck={() => handleEmployeeCheck([])} />
										))}
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
												isNested={true}
												checked={false}
												collapsed={false}
												checkedEmployees={[]}
												onCollapseToggle={onCollapseToggle}
												onEmployeesCheck={([]) => {}}
												onTeamCheck={() => {}}
												onEmployeeDelete={onEmployeeDelete}
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
