import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
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
import { Employee } from '@/types'
import { Checkbox } from '@mui/material'

interface Props {
	employee: Employee
	checked: boolean
	onEmployeeCheck: (id: string[]) => void
}

export default function EmployeeRow({employee, checked, onEmployeeCheck}: Props) {
	const checkbox = <Checkbox
		checked={checked}
		onChange={() => onEmployeeCheck([]/* employee.id */)}
	/>
	const employeeData = [employee.name, employee.surname, employee.position, employee.team_id] //rewrite team_id to team_name

	return (
		<TableRow sx={{
			backgroundColor: employee.end_date ? '#eeeef0' : 'inherit' ,
			'& > *': { borderBottom: 'unset' }
		}}>
			<TableCell
				key={'checkbox'}
				children={checkbox}
				sx={{
					'color': employee.end_date ? '#707070' : 'inherit' ,
				}}
				padding="checkbox"
			/>
			{employeeData.map((data) => (
				<TableCell
					key={data}
					children={data}
					sx={{
						'color': employee.end_date ? '#707070' : 'inherit' ,
					}}
				/>
			))}
		</TableRow>
	)
}
