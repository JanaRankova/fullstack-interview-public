export interface Employee {
	id: string
	name: string
	surname: string
	position: string // add all positions available
	team_id: string
	created_at: Date
	end_date: Date | null
}

export interface Team {
	id: string
	name: string
	parent_team_id: string | null
	child_teams: Team[]
	employees: Employee[]
}
