import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Mustache from "mustache";

interface Template {
  name: string;
  template: string;
}

interface TemplateForgeProps {
  resourceName: string;
  resourceValue: Record<string, any>;
}

const getTemplates = (): Template[] => {
  const savedTemplates = localStorage.getItem("templates");
  return savedTemplates ? JSON.parse(savedTemplates) : [];
};

const saveTemplates = (templates: Template[]): void => {
  localStorage.setItem("templates", JSON.stringify(templates));
};

const addTemplate = (template: Template): void => {
  const templates = getTemplates();
  templates.push(template);
  saveTemplates(templates);
};

const updateTemplate = (index: number, template: Template): void => {
  const templates = getTemplates();
  templates[index] = template;
  saveTemplates(templates);
};

const deleteTemplate = (index: number): void => {
  const templates = getTemplates();
  templates.splice(index, 1);
  saveTemplates(templates);
};

const applyTemplate = (
  templateString: string,
  data: Record<string, any>,
): string => {
  return Mustache.render(templateString, data);
};

const TemplateForge: React.FC<TemplateForgeProps> = ({
  resourceName,
  resourceValue,
}) => {
  const [templateName, setTemplateName] = useState("");
  const [templateString, setTemplateString] = useState("");
  const [output, setOutput] = useState("");
  const [templates, setTemplates] = useState<Template[]>(getTemplates);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    setOutput("");
  }, [resourceName, resourceValue]);

  const handleGenerate = () => {
    try {
      if (editIndex !== null) {
        updateTemplate(editIndex, {
          name: templateName,
          template: templateString,
        });
        setEditIndex(null);
      } else {
        addTemplate({ name: templateName, template: templateString });
      }
      setTemplates(getTemplates());
      const result = applyTemplate(templateString, resourceValue);
      setOutput(result);
      setTemplateName("");
      setTemplateString("");
    } catch (err) {
      console.error(
        "Failed to apply template. Please check the template syntax.",
      );
    }
  };

  const handleEdit = (index: number) => {
    const template = templates[index];
    setTemplateName(template.name);
    setTemplateString(template.template);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    deleteTemplate(index);
    setTemplates(getTemplates());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarOpen(true);
    });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Template Forge
      </Typography>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          {editIndex !== null ? "Edit Template" : "Create Template"}
        </Typography>
        <TextField
          label="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Template String"
          value={templateString}
          onChange={(e) => setTemplateString(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          helperText="Use {{key}} to reference values from the resource"
        />
        <Button variant="contained" color="primary" onClick={handleGenerate}>
          {editIndex !== null ? "Save Changes" : "Generate Command"}
        </Button>
      </Paper>
      {output && (
        <Paper sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Generated Command
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              component="div"
              sx={{ whiteSpace: "pre-wrap", flexGrow: 1 }}
            >
              {output}
            </Typography>
            <Tooltip title="Copy to clipboard">
              <IconButton onClick={() => handleCopy(output)}>
                <CopyAllIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      )}
      <Paper sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h6" gutterBottom>
          Saved Templates
        </Typography>
        <List>
          {templates.map((template, index) => {
            const interpolatedValue = applyTemplate(
              template.template,
              resourceValue,
            );
            return (
              <ListItem key={index}>
                <ListItemText
                  primary={template.name}
                  secondary={interpolatedValue}
                />
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit template">
                    <IconButton onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete template">
                    <IconButton onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy to clipboard">
                    <IconButton onClick={() => handleCopy(interpolatedValue)}>
                      <CopyAllIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Command copied to clipboard!"
      />
    </Box>
  );
};

export default TemplateForge;
