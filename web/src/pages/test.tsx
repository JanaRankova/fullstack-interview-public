import { useState, useEffect } from 'react'
import { TeamAdd } from '@/components/teams/TeamAdd';

import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Suspense } from 'react';

interface Props {

}

interface Employee {
	id: string
	name: string
	surname: string
	position: string // add all positions available
	team_id: string
	created_at: Date
	end_date: Date | null
}

interface Team {
	id: string
	name: string
	parent_team_id: string | null
	child_teams: Team[]
	employees: Employee[]
}


export default function Test({

}: Props) {
	const [teams, setTeams] = useState([])

	useEffect(() => {
    fetch('http://localhost:8000/teams', {
		headers: {
			Authorization: 'Bearer mysecrettoken123',
		}
	 })
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error(err));
  }, [])

  console.log(teams)


	return (
	<div>
		<h2>Teams</h2>
	</div>
	)
}
