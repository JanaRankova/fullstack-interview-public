import { Team } from '@/types'
import Delete from '@mui/icons-material/Clear'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, Checkbox, Collapse, IconButton, Table, TableBody, TableCell,TableHead, TableRow } from '@mui/material'
import * as React from 'react'
import EmployeeRow from './EmployeeRow'

interface Props {
	team: Team
	isNested: boolean
	checked: boolean
	collapsed: boolean
	checkedEmployees: string[]
	//checkedTeams: Set<string>
	onCollapseToggle: (id: string) => void
	onEmployeesCheck: (ids: string[]) => void
	onTeamCheck: (teamId: string, checked: boolean) => void
	onTeamDelete: (id: string) => void
	onEmployeeDelete: (id: string) => void
}

export default function TeamRow({team, isNested, checked, checkedEmployees, collapsed, onTeamCheck, onEmployeeDelete, onCollapseToggle, onTeamDelete}: Props) {

	const handleEmployeeCheck = (ids: string[]) => {
	}
	const employeeCheckbox = (ids: string[]) => (
		<Checkbox
			checked={checkedEmployees.length === team.employees.length}
			indeterminate={checkedEmployees.length !== 0 && checkedEmployees.length < team.employees.length}
			onChange={() => handleEmployeeCheck(ids)}
		/>
	)

	//const isChecked = checkedTeams.has(team.id)

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onTeamCheck(team.id, e.target.checked)
	}

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
						onChange={(event) => onTeamCheck(team.id, event.target.checked)}
					/>
				</TableCell>
				<TableCell component="th" scope="row">
					{team.name}
				</TableCell>
				<TableCell padding="checkbox"  sx={{ width: '40px', maxWidth: '40px' }}>
					<IconButton
						size="small"
						title='Delete employee'
						onClick={() => onTeamDelete(team.id)}
					>
						{<Delete/>}
					</IconButton>
				</TableCell>
			</TableRow>

			{(team.employees.length > 0 || team.child_teams.length > 0) ?
				<TableRow>
					<TableCell colSpan={4} sx={{ paddingBottom: 0, paddingTop: 0, paddingRight: 0, paddingLeft: '44px'}}>
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
													onChange={(event) => onTeamCheck(team.id, event.target.checked)}
												/>
											</TableCell>
											<TableCell align="left" sx={{ color: 'white' }} children={'Team name'} />
											<TableCell/>
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
												//checkedTeams={checkedTeams}
												onCollapseToggle={onCollapseToggle}
												onEmployeesCheck={([]) => {}}
												onTeamCheck={onTeamCheck}
												onTeamDelete={() => onTeamDelete(childTeam.id)}
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
