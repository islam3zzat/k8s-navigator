import useTheme from "@mui/material/styles/useTheme";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { render as renderTemplate } from "mustache";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import { useForkRef, useIsFocusVisible } from "@mui/material";

interface Template {
  name: string;
  template: string;
}

interface TemplateForgeProps<T> {
  resourceName: string;
  resourceValue: T;
}

const getTemplates = (resourceName: string): Template[] => {
  const savedTemplates = localStorage.getItem(`templates_${resourceName}`);
  return savedTemplates ? JSON.parse(savedTemplates) : [];
};

const saveTemplates = (resourceName: string, templates: Template[]): void => {
  localStorage.setItem(`templates_${resourceName}`, JSON.stringify(templates));
};

const addTemplate = (resourceName: string, template: Template): void => {
  const templates = getTemplates(resourceName);
  templates.push(template);
  saveTemplates(resourceName, templates);
};

const updateTemplate = (
  resourceName: string,
  index: number,
  template: Template,
): void => {
  const templates = getTemplates(resourceName);
  templates[index] = template;
  saveTemplates(resourceName, templates);
};

const deleteTemplate = (resourceName: string, index: number): void => {
  const templates = getTemplates(resourceName);
  templates.splice(index, 1);
  saveTemplates(resourceName, templates);
};

const applyTemplate = <T,>(templateString: string, data: T): string => {
  return renderTemplate(templateString, data);
};
const Item = ({ entity }: { entity: string }) => {
  const theme = useTheme(); // Access theme variables
  const { isFocusVisibleRef } = useIsFocusVisible();
  const ref = useRef(null);

  return (
    <MenuItem
      component="div"
      ref={ref}
      disableRipple
      sx={{
        backgroundColor: isFocusVisibleRef.current
          ? theme.palette.action.selected
          : theme.palette.background.default, // Highlight if active
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
        "&:active": {
          color: theme.palette.action.hover + " !important",
        },
        zIndex: 1_000,
      }}
    >
      {entity}
    </MenuItem>
  );
};
Item.displayName = "Item";
const TextAreaComponent = forwardRef((props, ref) => {
  return <TextField {...props} inputRef={ref} />;
});
TextAreaComponent.displayName = "TextAreaComponent";
const TemplateForge = <T,>({
  resourceName,
  resourceValue,
}: TemplateForgeProps<T>) => {
  const [templateName, setTemplateName] = useState("");
  const [templateString, setTemplateString] = useState("");
  const [output, setOutput] = useState("");
  const [templates, setTemplates] = useState<Template[]>(
    getTemplates(resourceName),
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    setTemplates(getTemplates(resourceName));
    setOutput("");
  }, [resourceName, resourceValue]);

  const objectValuePathes = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getPathSuggestions = (obj: any, currentPath = ""): string[] => {
      if (typeof obj !== "object" || obj === null) {
        return [currentPath]; // Base case: reached a leaf value
      }

      const paths: string[] = [];
      for (const key in obj) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        paths.push(...getPathSuggestions(obj[key], newPath)); // Recurse
      }
      return paths;
    };

    return getPathSuggestions(resourceValue);
  }, [resourceValue]);

  const handleGenerate = useCallback(() => {
    try {
      if (editIndex !== null) {
        updateTemplate(resourceName, editIndex, {
          name: templateName,
          template: templateString,
        });
        setEditIndex(null);
      } else {
        addTemplate(resourceName, {
          name: templateName,
          template: templateString,
        });
      }
      setTemplates(getTemplates(resourceName));
      const result = applyTemplate(templateString, resourceValue);
      setOutput(result);
      setTemplateName("");
      setTemplateString("");
    } catch (err) {
      console.error(
        "Failed to apply template. Please check the template syntax.",
      );
    }
  }, [editIndex, resourceName, templateName, templateString, resourceValue]);

  const handleEdit = useCallback(
    (index: number) => {
      const template = templates[index];
      setTemplateName(template.name);
      setTemplateString(template.template);
      setEditIndex(index);
    },
    [templates],
  );

  const handleDelete = useCallback(
    (index: number) => {
      deleteTemplate(resourceName, index);
      setTemplates(getTemplates(resourceName));
    },
    [resourceName],
  );

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbarOpen(true);
    });
  }, []);
  const hasSavedTemplates = templates.length > 0;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Command Forge
      </Typography>

      {hasSavedTemplates && (
        <Paper sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h6" gutterBottom>
            Saved Commands
          </Typography>
          <List>
            {templates.map((template, index) => {
              const interpolatedValue = applyTemplate(
                template.template,
                resourceValue as Record<string, unknown>,
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
      )}

      <Paper sx={{ padding: 2, marginBlock: 2 }}>
        <Typography variant="h6" gutterBottom>
          {editIndex !== null
            ? "Edit Command Template"
            : "Create a Command Template"}
        </Typography>
        <Typography variant="caption" gutterBottom>
          Use templates to generate commands for the resource: {resourceName}
        </Typography>
        <TextField
          label="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <ReactTextareaAutocomplete
          aria-label="Template body"
          // @ts-expect-error - The component is not typed correctly
          textAreaComponent={TextAreaComponent}
          value={templateString}
          onChange={(e) => setTemplateString(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          placeholder="kubectl get {{kind}} {{metadata.name}}"
          helperText="Use {{path}} to reference values from the resource. e.g {{metadata.name}}"
          {...{
            className:
              "MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputMultiline",
            loadingComponent: CircularProgress,
            minChar: 0,
            trigger: {
              "{{": {
                component: Item,
                dataProvider: (input: string) => {
                  if (input === "{") {
                    return objectValuePathes;
                  }
                  const userquery = input.replace("{", "");
                  return input
                    ? objectValuePathes.filter((item) =>
                        item.includes(userquery),
                      )
                    : objectValuePathes;
                },
                output: (item, trigger) => `{{${item}}}`,
              },
            },
          }}
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
