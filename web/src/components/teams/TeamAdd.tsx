import { Controller, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormFieldError } from "../forms/FormFieldError";
import { FormSuccess } from "../forms/FormSuccess";
import { FormError } from "../forms/FormError";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  parentTeam: yup.string(),
});

interface Props {
  teams: {
    id: string
    name: string
  }[]
}

export const TeamAdd = ({
  teams,
}: Props) => {
  const [formError, setFormError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = handleSubmit((formData) => {
    // Process formData as needed
    console.log(formData);
    setSuccess(true);
    reset();
    setTimeout(() => setSuccess(false), 2000);
  });

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Add Team
      </Typography>
      <form onSubmit={onSubmit}>
        <Controller
          name="name"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <TextField fullWidth {...field} label="Name" />
          )}
        />

        {errors.name && <FormFieldError text={errors.name.message} />}

        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel>Parent team</InputLabel>
          <Controller
            name="parentTeam"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Select {...field} label="Parent team">
                {teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        {errors.parentTeam && (
          <FormFieldError text={errors.parentTeam.message} />
        )}

        <Button type="submit" variant="contained" sx={{ my: 3 }}>
          Add Team
        </Button>
        {formError && <FormError text="Please fill out the form correctly" />}
        {success && <FormSuccess text="Team Added" />}
      </form>
    </Box>
  );
};
