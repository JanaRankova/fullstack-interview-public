import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Delete from '@mui/icons-material/Clear'
import { Employee } from '@/types'
import { Checkbox } from '@mui/material'

interface Props {
	employee: Employee
	checked: boolean
	onEmployeeCheck: () => void
	onDelete: () => void
}

export default function EmployeeRow({employee, checked, onEmployeeCheck, onDelete}: Props) {
	const checkbox = <Checkbox
		checked={checked}
		onChange={() => onEmployeeCheck()}
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
			<TableCell padding="checkbox"  sx={{ width: '40px', maxWidth: '40px' }}>
				<IconButton
					size="small"
					sx={{
						'color': employee.end_date ? '#707070' : 'inherit' ,
					}}
					title='Delete employee'
					onClick={onDelete}
				>
					{<Delete/>}
				</IconButton>
			</TableCell>
		</TableRow>
	)
}
